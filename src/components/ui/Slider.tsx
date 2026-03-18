import React from "react";

interface SliderProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  formatLabel?: (value: number) => string;
  disabled?: boolean;
}

export const Slider: React.FC<SliderProps> = ({
  value,
  min,
  max,
  step = 1,
  onChange,
  formatLabel,
  disabled = false,
}) => {
  const percent = ((value - min) / (max - min)) * 100;

  return (
    <div
      className={`space-y-1.5 ${disabled ? "opacity-40 pointer-events-none" : ""}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs text-white/40 tabular-nums">
          {formatLabel ? formatLabel(min) : min}
        </span>
        <span className="text-xs font-medium text-white tabular-nums">
          {formatLabel ? formatLabel(value) : value}
        </span>
        <span className="text-xs text-white/40 tabular-nums">
          {formatLabel ? formatLabel(max) : max}
        </span>
      </div>
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          disabled={disabled}
          className="
            w-full h-1.5 rounded-full appearance-none cursor-pointer
            bg-white/8
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-4
            [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-white
            [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(45,212,191,0.3)]
            [&::-webkit-slider-thumb]:transition-shadow
            [&::-webkit-slider-thumb]:hover:shadow-[0_0_12px_rgba(45,212,191,0.5)]
            focus-visible:outline-none
          "
          style={{
            background: `linear-gradient(to right, rgb(20 184 166) 0%, rgb(6 182 212) ${percent}%, rgba(255,255,255,0.08) ${percent}%)`,
          }}
        />
      </div>
    </div>
  );
};
