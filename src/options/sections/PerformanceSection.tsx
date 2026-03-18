import React from "react";
import { FeatureCard, SegmentedControl, SectionHeader, Toggle } from "../../components/ui";
import { useMetrics } from "../../store/metrics";
import type { SlimTabSettings, SuspensionDelay } from "../../store/settings";
import type { SiteOverride, SuspensionHistoryEntry } from "../../shared/types/settings";
import { minutesAgo } from "../../shared/utils/time";

// ── Icons ────────────────────────────────────────────────────────────
const GaugeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><title>Performance</title><path d="m12 14 4-4" /><path d="M3.34 19a10 10 0 1 1 17.32 0" /></svg>
);

const PauseCircleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><title>Suspend</title><circle cx="12" cy="12" r="10" /><line x1="10" x2="10" y1="15" y2="9" /><line x1="14" x2="14" y1="15" y2="9" /></svg>
);

const EyeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><title>Visible</title><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" /><circle cx="12" cy="12" r="3" /></svg>
);

const ShieldAlertIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><title>Safe Mode</title><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" /><path d="M12 8v4" /><path d="M12 16h.01" /></svg>
);

const SUSPENSION_OPTIONS: { value: SuspensionDelay; label: string }[] = [
  { value: "30s", label: "30s" },
  { value: "1m", label: "1m" },
  { value: "5m", label: "5m" },
  { value: "15m", label: "15m" },
  { value: "30m", label: "30m" },
  { value: "1h", label: "1h" },
  { value: "never", label: "Never" },
];

interface PerformanceSectionProps {
  settings: SlimTabSettings;
  onUpdate: <K extends keyof SlimTabSettings>(
    key: K,
    value: SlimTabSettings[K],
  ) => void;
}

function summarizeSuspensionHistory(history: SuspensionHistoryEntry[]) {
  return Array.from(
    history.reduce<Map<string, number>>((sites, entry) => {
      sites.set(
        entry.hostname,
        (sites.get(entry.hostname) ?? 0) + entry.estimatedMemorySavedMb,
      );
      return sites;
    }, new Map()).entries(),
  )
    .map(([hostname, savedMb]) => ({ hostname, savedMb }))
    .sort((left, right) => right.savedMb - left.savedMb);
}

function formatRecoveryState(entry: SiteOverride) {
  if (!entry.disableUntil) {
    return {
      tone: "text-amber-300",
      label: "Temporarily disabled",
    };
  }

  const remainingMinutes = Math.ceil((entry.disableUntil - Date.now()) / 60_000);

  if (remainingMinutes > 0) {
    return {
      tone: "text-teal-300",
      label: `Active for ${remainingMinutes}m`,
    };
  }

  return {
    tone: "text-white/35",
    label: `Expired ${Math.max(1, Math.floor(minutesAgo(entry.disableUntil)))}m ago`,
  };
}

export const PerformanceSection: React.FC<PerformanceSectionProps> = ({
  settings,
  onUpdate,
}) => {
  const { metrics } = useMetrics();
  const suspendedSites = summarizeSuspensionHistory(metrics.suspensionHistory);
  const recentRecoveries = [...settings.recentRecoveries].sort(
    (left, right) => (right.disableUntil ?? 0) - (left.disableUntil ?? 0),
  );

  return (
    <section>
      <SectionHeader
        icon={<GaugeIcon />}
        title="Performance"
        description="Optimize memory usage and page rendering"
      />

      <div className="space-y-3">
        {/* Tab Suspension */}
        <FeatureCard
          icon={<PauseCircleIcon />}
          title="Tab Suspension"
          description="Automatically suspend inactive tabs to free memory and reduce CPU usage."
          enabled={settings.tabSuspension}
          onToggle={(v) => onUpdate("tabSuspension", v)}
        >
          <div className="space-y-3">
            <span className="text-xs text-white/40 font-medium mb-1.5 block">
              Suspend after
            </span>
            <SegmentedControl
              value={settings.suspensionDelay}
              onChange={(v) => onUpdate("suspensionDelay", v)}
              options={SUSPENSION_OPTIONS}
              size="sm"
            />

            <div className="grid gap-2 pt-1 sm:grid-cols-2">
              {[
                {
                  key: "protectActiveWindow",
                  label: "Protect active tab",
                  description: "Never suspend the tab you are currently using.",
                },
                {
                  key: "protectPinnedTabs",
                  label: "Protect pinned tabs",
                  description: "Keep pinned tabs available even during cleanup.",
                },
                {
                  key: "protectAudibleTabs",
                  label: "Protect audible tabs",
                  description: "Avoid suspending tabs with active audio.",
                },
                {
                  key: "respectFormActivity",
                  label: "Respect form activity",
                  description: "Keep tabs with unsaved input from being suspended.",
                },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-start justify-between gap-3 rounded-lg border border-white/6 bg-white/[0.03] px-3 py-2.5"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-white/75">
                      {item.label}
                    </p>
                    <p className="mt-0.5 text-[11px] leading-relaxed text-white/35">
                      {item.description}
                    </p>
                  </div>
                  <Toggle
                    checked={settings[item.key]}
                    onChange={(next) => onUpdate(item.key, next)}
                    size="sm"
                  />
                </div>
              ))}
            </div>
          </div>
        </FeatureCard>

        {/* Prioritize Visible Content */}
        <FeatureCard
          icon={<EyeIcon />}
          title="Prioritize Visible Content"
          description="Defer loading off-screen images, iframes, and heavy elements until they scroll into view."
          enabled={settings.prioritizeVisibleContent}
          onToggle={(v) => onUpdate("prioritizeVisibleContent", v)}
        />

        {/* Safe Mode */}
        <FeatureCard
          icon={<ShieldAlertIcon />}
          title="Safe Mode"
          description="Automatically recover pages that break and let you temporarily disable SlimTab for the current site."
          enabled={settings.safeMode}
          onToggle={(v) => onUpdate("safeMode", v)}
          badge="Safety"
        >
          <div className="space-y-2.5">
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-medium text-white/65">
                  Temporarily Disabled Sites
                </span>
                <div className="flex items-center gap-2">
                  {recentRecoveries.length > 0 && (
                    <button
                      type="button"
                      onClick={() => onUpdate("recentRecoveries", [])}
                      className="text-[11px] font-medium text-teal-400/70 hover:text-teal-300 transition-colors"
                    >
                      Clear All
                    </button>
                  )}
                  <span className="text-[11px] text-white/30">
                    {recentRecoveries.length} tracked
                  </span>
                </div>
              </div>

              {recentRecoveries.length > 0 ? (
                <div className="space-y-2">
                  {recentRecoveries.map((entry) => {
                    const state = formatRecoveryState(entry);

                    return (
                      <div
                        key={`${entry.hostname}-${entry.disableUntil ?? "permanent"}`}
                        className="flex items-center justify-between rounded-lg border border-white/6 bg-white/[0.03] px-3 py-2"
                      >
                        <div className="min-w-0">
                          <span className="block truncate text-sm text-white/72">
                            {entry.hostname}
                          </span>
                          <span className="text-[11px] text-white/30">
                            {entry.reason === "temporary-disable"
                              ? "Disabled by Safe Mode"
                              : entry.reason ?? "Recovery rule"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`text-xs font-semibold ${state.tone}`}>
                            {state.label}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              onUpdate(
                                "recentRecoveries",
                                settings.recentRecoveries.filter(
                                  (r) =>
                                    r.hostname !== entry.hostname ||
                                    r.disableUntil !== entry.disableUntil,
                                ),
                              )
                            }
                            className="flex items-center justify-center w-5 h-5 rounded text-white/30 hover:text-red-400 hover:bg-white/5 transition-colors"
                            aria-label={`Remove ${entry.hostname}`}
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-white/8 px-3 py-4 text-xs text-white/30">
                  No Safe Mode site recoveries yet.
                </div>
              )}
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-medium text-white/65">
                Suspended Sites
              </span>
              <span className="text-[11px] text-white/30">
                {metrics.memorySavedMB} MB total saved
              </span>
            </div>

            {suspendedSites.length > 0 ? (
              <div className="space-y-2">
                {suspendedSites.map((site) => (
                  <div
                    key={site.hostname}
                    className="flex items-center justify-between rounded-lg border border-white/6 bg-white/[0.03] px-3 py-2"
                  >
                    <span className="truncate text-sm text-white/72">
                      {site.hostname}
                    </span>
                    <span className="shrink-0 text-xs font-semibold text-teal-300">
                      {site.savedMb} MB
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-white/8 px-3 py-4 text-xs text-white/30">
                No sites have been suspended yet.
              </div>
            )}
          </div>
        </FeatureCard>
      </div>
    </section>
  );
};
