import React from "react";

interface LevelOption<T extends string> {
  value: T;
  label: string;
  description?: string;
}

interface LevelSelectorProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  options: LevelOption<T>[];
  disabled?: boolean;
}

export function LevelSelector<T extends string>({
  value,
  onChange,
  options,
  disabled = false,
}: LevelSelectorProps<T>) {
  const activeIndex = options.findIndex((o) => o.value === value);
  const safeActiveIndex = Math.max(activeIndex, 0);
  const denominator = Math.max(options.length - 1, 1);

  return (
    <div className={`${disabled ? "opacity-40 pointer-events-none" : ""}`}>
      <div className="relative h-14 px-2">
        {/* Background track */}
        <div className="absolute left-2 right-2 top-1.5 h-1 rounded-full bg-white/8" />

        {/* Active fill */}
        <div
          className="absolute left-2 top-1.5 h-1 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 transition-all duration-300"
          style={{
            width: `calc(${(safeActiveIndex / denominator) * 100}% - ${safeActiveIndex === 0 ? 0 : 4}px)`,
          }}
        />

        {/* Options (dots and labels together) */}
        {options.map((opt, i) => {
          const isActive = i <= safeActiveIndex;
          const isCurrent = opt.value === value;
          const leftPercent = (i / denominator) * 100;

          return (
            <div
              key={opt.value}
              className="absolute top-0 flex -translate-x-1/2 flex-col items-center"
              style={{ left: `calc(${leftPercent}% + 0px)`, width: 'max-content', minWidth: '3.75rem' }}
            >
              <button
                type="button"
                onClick={() => onChange(opt.value)}
                className={`
                  relative z-10 rounded-full transition-all duration-200 shrink-0
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/50
                  ${
                    isCurrent
                      ? "h-3.5 w-3.5 bg-white shadow-[0_0_8px_rgba(45,212,191,0.4)]"
                    : isActive
                        ? "h-2.5 w-2.5 bg-teal-400/80 hover:bg-teal-400"
                        : "h-2.5 w-2.5 bg-white/20 hover:bg-white/40"
                  }
                `}
                style={{ marginTop: isCurrent ? '1px' : '3px' }}
                aria-label={opt.label}
              />
              <button
                type="button"
                onClick={() => onChange(opt.value)}
                className={`
                  mt-2 w-full px-1 text-center focus-visible:outline-none
                  ${isCurrent ? "text-white" : "text-white/30 hover:text-white/50"}
                  transition-colors duration-200
                `}
              >
                <span className="block text-[11px] font-medium leading-tight whitespace-nowrap">
                  {opt.label}
                </span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
