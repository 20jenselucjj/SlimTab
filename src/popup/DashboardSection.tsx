import React from "react";
import { useMetrics } from "../store/metrics";
import { MetricCard } from "../components/ui";

type DashboardTab = "performance" | "privacy" | "content";

// ── Lucide-style inline SVG icons ────────────────────────────────────
const MemoryIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><title>Memory</title><rect width="16" height="20" x="4" y="2" rx="2" /><line x1="8" x2="8" y1="6" y2="6.01" /><line x1="16" x2="16" y1="6" y2="6.01" /><line x1="12" x2="12" y1="6" y2="6.01" /><line x1="8" x2="8" y1="10" y2="10.01" /><line x1="16" x2="16" y1="10" y2="10.01" /><line x1="12" x2="12" y1="10" y2="10.01" /><line x1="8" x2="8" y1="14" y2="14.01" /><line x1="16" x2="16" y1="14" y2="14.01" /><line x1="12" x2="12" y1="14" y2="14.01" /></svg>
);

const TabsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><title>Tabs</title><path d="M4 8h16" /><rect width="20" height="16" x="2" y="4" rx="2" /><path d="M10 4v4" /></svg>
);

const ShieldIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><title>Blocked</title><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" /></svg>
);

const SpeedIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><title>Speed</title><path d="M12 12m-10 0a10 10 0 1 0 20 0 10 10 0 1 0 -20 0" /><path d="m16.24 7.76-4.24 4.24" /><path d="M12 2v2" /><path d="m2 12 2 0" /><path d="m20 12 2 0" /></svg>
);

interface DashboardSectionProps {
  onMetricClick?: (tab: DashboardTab) => void;
}

export const DashboardSection: React.FC<DashboardSectionProps> = ({
  onMetricClick,
}) => {
  const { metrics } = useMetrics();

  return (
    <section>
      <div className="grid grid-cols-2 gap-2.5">
        <MetricCard
          icon={<MemoryIcon />}
          value={`${metrics.memorySavedMB}MB`}
          label="Memory Saved"
          accentColor="emerald"
          onClick={onMetricClick ? () => onMetricClick("performance") : undefined}
        />
        <MetricCard
          icon={<TabsIcon />}
          value={`${metrics.activeTabs}/${metrics.totalTabs}`}
          label="Active / Total Tabs"
          accentColor="blue"
          onClick={onMetricClick ? () => onMetricClick("performance") : undefined}
        />
        <MetricCard
          icon={<ShieldIcon />}
          value={metrics.scriptsControlled}
          label="Scripts Controlled"
          accentColor="violet"
          onClick={onMetricClick ? () => onMetricClick("privacy") : undefined}
        />
        <MetricCard
          icon={<SpeedIcon />}
          value={metrics.pagesOptimized}
          label="Pages Optimized"
          accentColor="amber"
          onClick={onMetricClick ? () => onMetricClick("content") : undefined}
        />
      </div>
    </section>
  );
};
