import React from "react";
import {
  FeatureCard,
  LevelSelector,
  SectionHeader,
} from "../../components/ui";
import type { SlimTabSettings, BlockingLevel } from "../../store/settings";

// ── Icons ────────────────────────────────────────────────────────────
const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><title>Privacy</title><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
);

const ShieldCheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><title>Block Ads</title><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" /><path d="m9 12 2 2 4-4" /></svg>
);

const CodeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><title>Scripts</title><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
);

const BLOCKING_LEVELS: { value: BlockingLevel; label: string }[] = [
  { value: "off", label: "Off" },
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

interface PrivacySectionProps {
  settings: SlimTabSettings;
  onUpdate: <K extends keyof SlimTabSettings>(
    key: K,
    value: SlimTabSettings[K],
  ) => void;
}

export const PrivacySection: React.FC<PrivacySectionProps> = ({
  settings,
  onUpdate,
}) => {
  return (
    <section>
      <SectionHeader
        icon={<LockIcon />}
        title="Privacy & Blocking"
        description="Control ads, trackers, and third-party scripts"
      />

      <div className="space-y-3">
        {/* Ad Blocking */}
        <FeatureCard
          icon={<ShieldCheckIcon />}
          title="Ad & Tracker Blocking"
          description="Block ads, trackers, analytics, and common nuisance requests with one ruleset family."
          enabled={settings.adBlocking}
          onToggle={(v) => onUpdate("adBlocking", v)}
        >
          <div>
            <span className="text-xs text-white/40 font-medium mb-2 block">
              Blocking Level
            </span>
            <LevelSelector
              value={settings.adBlockingLevel}
              onChange={(v) => onUpdate("adBlockingLevel", v)}
              options={BLOCKING_LEVELS}
            />
          </div>
        </FeatureCard>

        {/* Script Control */}
        <FeatureCard
          icon={<CodeIcon />}
          title="Script Control"
          description="Limit or block third-party JavaScript execution to improve security and reduce page weight."
          enabled={settings.scriptControl}
          onToggle={(v) => onUpdate("scriptControl", v)}
        >
          <div>
            <span className="text-xs text-white/40 font-medium mb-2 block">
              Control Level
            </span>
            <LevelSelector
              value={settings.scriptControlLevel}
              onChange={(v) => onUpdate("scriptControlLevel", v)}
              options={BLOCKING_LEVELS}
            />
          </div>
        </FeatureCard>
      </div>
    </section>
  );
};
