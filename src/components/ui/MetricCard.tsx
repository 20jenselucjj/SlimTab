import React from "react";

interface MetricCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  onClick?: () => void;
  trend?: { value: number; direction: "up" | "down" };
  accentColor?: string; // Tailwind color class for the glow (e.g., "blue" | "violet" | "emerald" | "amber")
}

const accentMap: Record<string, { glow: string; text: string; bg: string }> = {
  blue: {
    glow: "shadow-[0_0_20px_rgba(20,184,166,0.08)]",
    text: "text-teal-400",
    bg: "bg-teal-500/10",
  },
  violet: {
    glow: "shadow-[0_0_20px_rgba(6,182,212,0.08)]",
    text: "text-cyan-400",
    bg: "bg-cyan-500/10",
  },
  emerald: {
    glow: "shadow-[0_0_20px_rgba(16,185,129,0.08)]",
    text: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  amber: {
    glow: "shadow-[0_0_20px_rgba(245,158,11,0.08)]",
    text: "text-amber-400",
    bg: "bg-amber-500/10",
  },
  red: {
    glow: "shadow-[0_0_20px_rgba(239,68,68,0.08)]",
    text: "text-red-400",
    bg: "bg-red-500/10",
  },
};

export const MetricCard: React.FC<MetricCardProps> = ({
  icon,
  value,
  label,
  onClick,
  trend,
  accentColor = "blue",
}) => {
  const accent = accentMap[accentColor] ?? accentMap.blue;
  const classes = `
    group relative rounded-xl border border-white/8 bg-white/[0.03]
    p-3.5 text-left transition-all duration-200
    hover:border-white/12 hover:bg-white/[0.05]
    ${onClick ? "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/50" : ""}
    ${accent.glow}
  `;

  const content = (
    <>
      <div
        className={`
          mb-2.5 flex h-8 w-8 items-center justify-center rounded-lg
          ${accent.bg} ${accent.text}
        `}
      >
        {icon}
      </div>

      <div className="flex items-baseline gap-1.5">
        <span className="text-xl font-bold tracking-tight text-white tabular-nums">
          {typeof value === "number" ? value.toLocaleString() : value}
        </span>
        {trend && (
          <span
            className={`text-xs font-medium ${
              trend.direction === "up" ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {trend.direction === "up" ? "+" : "-"}
            {trend.value}%
          </span>
        )}
      </div>

      <p className="mt-0.5 text-xs text-white/40 font-medium">{label}</p>
    </>
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={classes}>
        {content}
      </button>
    );
  }

  return (
    <div className={classes}>
      {content}
    </div>
  );
};
