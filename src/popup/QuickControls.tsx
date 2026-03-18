import React from "react";
import { Toggle } from "../components/ui";
import type { SlimTabSettings } from "../store/settings";

// ── Lucide-style icons ───────────────────────────────────────────────
const PauseCircleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><title>Suspend</title><circle cx="12" cy="12" r="10" /><line x1="10" x2="10" y1="15" y2="9" /><line x1="14" x2="14" y1="15" y2="9" /></svg>
);

const ShieldCheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><title>Block Ads</title><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" /><path d="m9 12 2 2 4-4" /></svg>
);

const EyeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><title>Visible</title><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" /><circle cx="12" cy="12" r="3" /></svg>
);

const VolumeXIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><title>Autoplay</title><path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z" /><line x1="22" x2="16" y1="9" y2="15" /><line x1="16" x2="22" y1="9" y2="15" /></svg>
);

const TypeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><title>Fonts</title><polyline points="4 7 4 4 20 4 20 7" /><line x1="9" x2="15" y1="20" y2="20" /><line x1="12" x2="12" y1="4" y2="20" /></svg>
);

const CodeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><title>Scripts</title><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
);

interface QuickControlsProps {
  settings: SlimTabSettings;
  onUpdate: <K extends keyof SlimTabSettings>(
    key: K,
    value: SlimTabSettings[K],
  ) => void;
}

interface QuickToggleRowProps {
  icon: React.ReactNode;
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}

const QuickToggleRow: React.FC<QuickToggleRowProps> = ({
  icon,
  label,
  checked,
  onChange,
}) => (
  <div className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-white/[0.03] transition-colors">
    <div className="flex items-center gap-2.5">
      <span
        className={`transition-colors ${checked ? "text-teal-400" : "text-white/25"}`}
      >
        {icon}
      </span>
      <span
        className={`text-[13px] font-medium transition-colors ${
          checked ? "text-white/80" : "text-white/40"
        }`}
      >
        {label}
      </span>
    </div>
    <Toggle checked={checked} onChange={onChange} size="sm" />
  </div>
);

export const QuickControls: React.FC<QuickControlsProps> = ({
  settings,
  onUpdate,
}) => {
  return (
    <section className="space-y-0.5">
      <h2 className="text-xs font-semibold text-white/30 uppercase tracking-wider px-3 mb-2">
        Quick Controls
      </h2>
      <div className="space-y-0.5">
        <QuickToggleRow
          icon={<PauseCircleIcon />}
          label="Tab Suspension"
          checked={settings.tabSuspension}
          onChange={(v) => onUpdate("tabSuspension", v)}
        />
        <QuickToggleRow
          icon={<ShieldCheckIcon />}
          label="Block Ads"
          checked={settings.adBlocking}
          onChange={(v) => onUpdate("adBlocking", v)}
        />
        <QuickToggleRow
          icon={<EyeIcon />}
          label="Visible Priority"
          checked={settings.prioritizeVisibleContent}
          onChange={(v) => onUpdate("prioritizeVisibleContent", v)}
        />
        <QuickToggleRow
          icon={<CodeIcon />}
          label="Script Control"
          checked={settings.scriptControl}
          onChange={(v) => onUpdate("scriptControl", v)}
        />
        <QuickToggleRow
          icon={<VolumeXIcon />}
          label="Stop Autoplay"
          checked={settings.stopAutoplay}
          onChange={(v) => onUpdate("stopAutoplay", v)}
        />
        <QuickToggleRow
          icon={<TypeIcon />}
          label="Font Optimization"
          checked={settings.fontOptimization}
          onChange={(v) => onUpdate("fontOptimization", v)}
        />
      </div>
    </section>
  );
};
