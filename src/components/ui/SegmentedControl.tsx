import React from "react";

interface SegmentedControlProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string }[];
  size?: "sm" | "md";
  disabled?: boolean;
}

export function SegmentedControl<T extends string>({
  value,
  onChange,
  options,
  size = "md",
  disabled = false,
}: SegmentedControlProps<T>) {
  const padding = size === "sm" ? "px-2.5 py-1 text-xs" : "px-3.5 py-1.5 text-sm";

  return (
    <div
      className={`inline-flex rounded-lg bg-white/5 border border-white/8 p-0.5 ${
        disabled ? "opacity-40 pointer-events-none" : ""
      }`}
      role="radiogroup"
    >
      {options.map((opt) => {
        const isActive = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            disabled={disabled}
            className={`
              ${padding} rounded-md font-medium transition-all duration-200 ease-out
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/50
              ${
                isActive
                  ? "bg-white/12 text-white shadow-sm"
                  : "text-white/40 hover:text-white/60 hover:bg-white/5"
              }
            `}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
