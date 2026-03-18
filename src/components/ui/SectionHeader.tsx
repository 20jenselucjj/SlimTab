import React from "react";

interface SectionHeaderProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  icon,
  title,
  description,
}) => {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-white/50">
        {icon}
      </div>
      <div>
        <h2 className="text-sm font-semibold text-white tracking-tight">
          {title}
        </h2>
        {description && (
          <p className="text-xs text-white/35 mt-0.5">{description}</p>
        )}
      </div>
    </div>
  );
};
