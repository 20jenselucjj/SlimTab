import React from "react";
import { Toggle } from "./Toggle";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  children?: React.ReactNode; // extra controls rendered below when enabled
  badge?: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  enabled,
  onToggle,
  children,
  badge,
}) => {
  return (
    <div
      className={`
        group rounded-xl border transition-all duration-200
        ${
          enabled
            ? "bg-white/[0.04] border-white/10 hover:border-white/16"
            : "bg-white/[0.02] border-white/6 hover:border-white/10"
        }
      `}
    >
      {/* Header row */}
      <div className="flex items-start gap-3.5 p-4">
        {/* Icon */}
        <div
          className={`
            mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg
            transition-colors duration-200
            ${
              enabled
                ? "bg-teal-500/12 text-teal-400"
                : "bg-white/5 text-white/30"
            }
          `}
        >
          {icon}
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3
              className={`text-sm font-semibold leading-tight transition-colors ${
                enabled ? "text-white" : "text-white/50"
              }`}
            >
              {title}
            </h3>
            {badge && (
              <span className="inline-flex items-center rounded-md bg-cyan-500/15 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-cyan-300 uppercase">
                {badge}
              </span>
            )}
          </div>
          <p
            className={`mt-0.5 text-xs leading-relaxed transition-colors ${
              enabled ? "text-white/50" : "text-white/30"
            }`}
          >
            {description}
          </p>
        </div>

        {/* Toggle */}
        <div className="shrink-0 mt-0.5">
          <Toggle checked={enabled} onChange={onToggle} size="sm" />
        </div>
      </div>

      {/* Expanded controls */}
      {enabled && children && (
        <div className="border-t border-white/6 px-4 py-3 space-y-3">
          {children}
        </div>
      )}
    </div>
  );
};
