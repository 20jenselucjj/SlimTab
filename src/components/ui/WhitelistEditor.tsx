import React, { useState, useCallback } from "react";
import type { FeatureKey, WhitelistEntry } from "@/shared/types/settings";

interface WhitelistEditorProps {
  entries: WhitelistEntry[];
  onAdd: (pattern: string, features: FeatureKey[]) => void;
  onRemove: (entryId: string) => void;
}

const FEATURE_OPTIONS: { value: FeatureKey; label: string }[] = [
  { value: "ads", label: "Ads" },
  { value: "scripts", label: "Scripts" },
  { value: "suspension", label: "Suspension" },
  { value: "fonts", label: "Fonts" },
  { value: "priority", label: "Visible" },
  { value: "preloading", label: "Preload" },
  { value: "autoplay", label: "Autoplay" },
];

// Simple domain validation
function isValidDomain(d: string): boolean {
  return /^([a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/.test(
    d.trim(),
  );
}

export const WhitelistEditor: React.FC<WhitelistEditorProps> = ({
  entries,
  onAdd,
  onRemove,
}) => {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [selectedFeatures, setSelectedFeatures] = useState<FeatureKey[]>(["ads", "scripts"]);

  const handleAdd = useCallback(() => {
    const trimmed = input.trim().toLowerCase();
    if (!trimmed) return;
    if (!isValidDomain(trimmed)) {
      setError("Enter a valid domain (e.g. example.com)");
      return;
    }
    if (entries.some((entry) => entry.pattern === trimmed)) {
      setError("Domain already whitelisted");
      return;
    }
    if (selectedFeatures.length === 0) {
      setError("Choose at least one feature to exempt");
      return;
    }
    onAdd(trimmed, selectedFeatures);
    setInput("");
    setError("");
  }, [entries, input, onAdd, selectedFeatures]);

  const toggleFeature = (feature: FeatureKey) => {
    setSelectedFeatures((current) =>
      current.includes(feature)
        ? current.filter((item) => item !== feature)
        : [...current, feature],
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
    if (error) setError("");
  };

  return (
    <div className="space-y-3">
      {/* Input row */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              if (error) setError("");
            }}
            onKeyDown={handleKeyDown}
            placeholder="example.com"
            className={`
              w-full rounded-lg border bg-white/[0.04] px-3 py-2 text-sm text-white
              placeholder:text-white/25
              transition-colors duration-150
              focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500/30
              ${error ? "border-red-500/50" : "border-white/10"}
            `}
          />
          {error && (
            <p className="absolute -bottom-5 left-0 text-[11px] text-red-400">
              {error}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="
            shrink-0 rounded-lg bg-teal-500/15 px-3.5 py-2 text-sm font-medium text-teal-400
            border border-teal-500/20
            transition-all duration-150
            hover:bg-teal-500/25 hover:border-teal-500/30
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/50
            active:scale-[0.97]
          "
        >
          Add
        </button>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {FEATURE_OPTIONS.map((feature) => {
          const active = selectedFeatures.includes(feature.value);
          return (
            <button
              key={feature.value}
              type="button"
              onClick={() => toggleFeature(feature.value)}
              className={`rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors ${
                active
                  ? "border-teal-400/40 bg-teal-500/15 text-teal-200"
                  : "border-white/10 bg-white/[0.03] text-white/40 hover:text-white/65"
              }`}
            >
              {feature.label}
            </button>
          );
        })}
      </div>

      {/* Domain list */}
      {entries.length > 0 ? (
        <ul className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
          {entries.map((entry) => (
            <li
              key={entry.id}
              className="
                flex items-center justify-between rounded-lg
                bg-white/[0.03] border border-white/6 px-3 py-2
                group/item transition-colors hover:border-white/10
              "
            >
              <div className="min-w-0">
                <span className="text-sm text-white/70 truncate font-mono block">
                  {entry.pattern}
                </span>
                <div className="mt-1 flex flex-wrap gap-1">
                  {entry.features.map((feature) => (
                    <span
                      key={feature}
                      className="rounded-full bg-white/[0.04] px-2 py-0.5 text-[10px] uppercase tracking-wide text-white/35"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
              <button
                type="button"
                onClick={() => onRemove(entry.id)}
                className="
                  ml-2 shrink-0 rounded-md p-1
                  text-white/20 hover:text-red-400 hover:bg-red-500/10
                  transition-colors duration-150
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50
                "
                aria-label={`Remove ${entry.pattern}`}
              >
                {/* X icon */}
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <title>Remove</title>
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-lg border border-dashed border-white/8 py-6 text-center">
          <p className="text-xs text-white/25">
            No domains whitelisted. Add a domain above and choose which features should bypass SlimTab.
          </p>
        </div>
      )}
    </div>
  );
};
