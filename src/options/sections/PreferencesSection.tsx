import React from "react";
import { SectionHeader, SegmentedControl, Toggle } from "../../components/ui";
import type { SlimTabSettings, ThemeMode } from "../../store/settings";

// ── Icons ────────────────────────────────────────────────────────────
const SlidersIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><title>Preferences</title><line x1="4" x2="4" y1="21" y2="14" /><line x1="4" x2="4" y1="10" y2="3" /><line x1="12" x2="12" y1="21" y2="12" /><line x1="12" x2="12" y1="8" y2="3" /><line x1="20" x2="20" y1="21" y2="16" /><line x1="20" x2="20" y1="12" y2="3" /><line x1="2" x2="6" y1="14" y2="14" /><line x1="10" x2="14" y1="8" y2="8" /><line x1="18" x2="22" y1="16" y2="16" /></svg>
);

const THEME_OPTIONS: { value: ThemeMode; label: string }[] = [
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
];

interface PreferencesSectionProps {
  settings: SlimTabSettings;
  onUpdate: <K extends keyof SlimTabSettings>(
    key: K,
    value: SlimTabSettings[K],
  ) => void;
  onReset: () => void;
}

export const PreferencesSection: React.FC<PreferencesSectionProps> = ({
  settings,
  onUpdate,
  onReset,
}) => {
  return (
    <section>
      <SectionHeader
        icon={<SlidersIcon />}
        title="Preferences"
        description="Appearance and notification settings"
      />

      <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4 space-y-5">
        {/* Theme */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-white/80">Theme</p>
            <p className="text-xs text-white/35 mt-0.5">
              Choose your preferred appearance
            </p>
          </div>
          <SegmentedControl
            value={settings.theme}
            onChange={(v) => onUpdate("theme", v)}
            options={THEME_OPTIONS}
            size="sm"
          />
        </div>

        {/* Divider */}
        <div className="h-px bg-white/6" />

        {/* Badge count */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-white/80">Badge Count</p>
            <p className="text-xs text-white/35 mt-0.5">
              Show blocked count on extension icon
            </p>
          </div>
          <Toggle
            checked={settings.showBadgeCount}
            onChange={(v) => onUpdate("showBadgeCount", v)}
            size="sm"
          />
        </div>

        {/* Suspend notifications */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-white/80">
              Suspend Notifications
            </p>
            <p className="text-xs text-white/35 mt-0.5">
              Notify when a tab gets suspended
            </p>
          </div>
          <Toggle
            checked={settings.notifyOnSuspend}
            onChange={(v) => onUpdate("notifyOnSuspend", v)}
            size="sm"
          />
        </div>

        {/* Divider */}
        <div className="h-px bg-white/6" />

        {/* Reset */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-white/80">Reset Settings</p>
            <p className="text-xs text-white/35 mt-0.5">
              Restore all settings to their defaults
            </p>
          </div>
          <button
            type="button"
            onClick={onReset}
            className="
              rounded-lg border border-red-500/20 bg-red-500/8
              px-3 py-1.5 text-xs font-medium text-red-400
              hover:bg-red-500/15 hover:border-red-500/30
              transition-all duration-150
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50
              active:scale-[0.97]
            "
          >
            Reset All
          </button>
        </div>
      </div>
    </section>
  );
};
