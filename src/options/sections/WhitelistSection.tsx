import React from "react";
import { SectionHeader, WhitelistEditor } from "../../components/ui";
import type { SlimTabSettings } from "../../store/settings";
import type { FeatureKey, WhitelistEntry } from "@/shared/types/settings";

// ── Icon ─────────────────────────────────────────────────────────────
const GlobeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><title>Whitelist</title><circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" /></svg>
);

interface WhitelistSectionProps {
  settings: SlimTabSettings;
  onUpdate: <K extends keyof SlimTabSettings>(
    key: K,
    value: SlimTabSettings[K],
  ) => void;
}

export const WhitelistSection: React.FC<WhitelistSectionProps> = ({
  settings,
  onUpdate,
}) => {
  const handleAdd = (pattern: string, features: FeatureKey[]) => {
    const entry: WhitelistEntry = {
      id: crypto.randomUUID(),
      pattern,
      features,
    };

    onUpdate("whitelist", [...settings.whitelist, entry]);
  };

  const handleRemove = (entryId: string) => {
    onUpdate("whitelist", settings.whitelist.filter((entry) => entry.id !== entryId));
  };

  return (
    <section>
      <SectionHeader
        icon={<GlobeIcon />}
        title="Domain Whitelist"
        description="Exclude specific domains from all SlimTab optimizations"
      />

      <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4">
        <WhitelistEditor
          entries={settings.whitelist}
          onAdd={handleAdd}
          onRemove={handleRemove}
        />
      </div>
    </section>
  );
};
