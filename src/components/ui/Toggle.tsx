import React from "react";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  size?: "sm" | "md";
  disabled?: boolean;
  label?: string;
  id?: string;
}

export const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  size = "md",
  disabled = false,
  label,
  id,
}) => {
  const trackW = size === "sm" ? "w-9" : "w-11";
  const trackH = size === "sm" ? "h-5" : "h-6";
  const thumbSize = size === "sm" ? "h-3.5 w-3.5" : "h-4.5 w-4.5";
  const thumbTranslate = checked
    ? size === "sm"
      ? "translate-x-[17px]"
      : "translate-x-[21px]"
    : "translate-x-[3px]";

  return (
    <label
      className={`inline-flex items-center gap-2.5 ${
        disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"
      }`}
      htmlFor={id}
    >
      {label && (
        <span className="text-sm text-white/70 select-none">{label}</span>
      )}
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`
          relative inline-flex ${trackW} ${trackH} shrink-0 items-center
          rounded-full border-2 border-transparent
          transition-colors duration-200 ease-in-out
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#040b16]
          ${
            checked
              ? "bg-gradient-to-r from-teal-500 to-cyan-500 shadow-[0_0_12px_rgba(45,212,191,0.3)]"
              : "bg-white/10"
          }
        `}
      >
        <span
          className={`
            pointer-events-none inline-block ${thumbSize} rounded-full
            bg-white shadow-lg ring-0
            transition-transform duration-200 ease-in-out
            ${thumbTranslate}
          `}
        />
      </button>
    </label>
  );
};
