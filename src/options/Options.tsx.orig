import React, { useState } from "react";
import { useSettings } from "../store/settings";
import { DashboardSection } from "../popup/DashboardSection";
import { PerformanceSection } from "./sections/PerformanceSection";
import { PrivacySection } from "./sections/PrivacySection";
import { ContentSection } from "./sections/ContentSection";
import { WhitelistSection } from "./sections/WhitelistSection";
import { PreferencesSection } from "./sections/PreferencesSection";
import { Logo } from "../components/Logo";
import {
  getOptionsTabFromSearch,
  type OptionsTabId,
} from "./navigation";

// ── Icons ────────────────────────────────────────────────────────────
const GaugeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><title>Performance</title><path d="m12 14 4-4" /><path d="M3.34 19a10 10 0 1 1 17.32 0" /></svg>
);

const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><title>Privacy</title><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
);

const FileTextIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><title>Content</title><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /></svg>
);

const GlobeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><title>Whitelist</title><circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" /></svg>
);

const SlidersIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><title>Preferences</title><line x1="4" x2="4" y1="21" y2="14" /><line x1="4" x2="4" y1="10" y2="3" /><line x1="12" x2="12" y1="21" y2="12" /><line x1="12" x2="12" y1="8" y2="3" /><line x1="20" x2="20" y1="21" y2="16" /><line x1="20" x2="20" y1="12" y2="3" /><line x1="2" x2="6" y1="14" y2="14" /><line x1="10" x2="14" y1="8" y2="8" /><line x1="18" x2="22" y1="16" y2="16" /></svg>
);

const LayoutDashboardIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><title>Dashboard</title><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /></svg>
);

// ── Navigation tabs ──────────────────────────────────────────────────
export type TabId = OptionsTabId;

interface NavItem {
  id: TabId;
  label: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboardIcon /> },
  { id: "performance", label: "Performance", icon: <GaugeIcon /> },
  { id: "privacy", label: "Privacy", icon: <LockIcon /> },
  { id: "content", label: "Content", icon: <FileTextIcon /> },
  { id: "whitelist", label: "Whitelist", icon: <GlobeIcon /> },
  { id: "preferences", label: "Preferences", icon: <SlidersIcon /> },
];

export const Options: React.FC = () => {
  const { settings, updateSetting, resetSettings } = useSettings();
  const [activeTab, setActiveTab] = useState<TabId>(() =>
    getOptionsTabFromSearch(window.location.search),
  );

  return (
    <div className="min-h-screen bg-[#040b16] text-white">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-white/6 bg-[#040b16]/80 backdrop-blur-2xl">
        <div className="mx-auto max-w-4xl px-6 py-4">
          <div className="flex items-center gap-3">
            <Logo className="h-9 w-9 rounded-xl" iconSize={20} />
            <div>
              <h1 className="text-base font-bold tracking-tight">
                SlimTab Settings
              </h1>
              <p className="text-xs text-white/30 font-medium">
                Performance Optimizer
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-6">
        <div className="flex gap-8">
          {/* Sidebar nav */}
          <nav className="sticky top-[73px] self-start w-48 shrink-0 space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`
                    w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium
                    transition-all duration-150
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/50
                    ${
                      isActive
                        ? "bg-white/8 text-white shadow-sm"
                        : "text-white/35 hover:text-white/60 hover:bg-white/[0.03]"
                    }
                  `}
                >
                  <span
                    className={`transition-colors ${
                      isActive ? "text-teal-400" : "text-white/25"
                    }`}
                  >
                    {item.icon}
                  </span>
                  {item.label}
                </button>
              );
            })}

            {/* Version info */}
            <div className="pt-6 px-3">
              <p className="text-[10px] text-white/15 font-medium">
                SlimTab v0.1.0
              </p>
            </div>
          </nav>

          {/* Main content */}
          <main className="flex-1 min-w-0 pb-12">
            {activeTab === "dashboard" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold tracking-tight mb-1">
                    Dashboard
                  </h2>
                  <p className="text-sm text-white/35">
                    Overview of SlimTab's impact on your browsing
                  </p>
                </div>
                <DashboardSection />

                {/* Session summary card */}
                <div className="rounded-xl border border-white/8 bg-white/[0.02] p-5">
                  <h3 className="text-sm font-semibold text-white/80 mb-3">
                    Active Protections
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      {
                        label: "Tab Suspension",
                        active: settings.tabSuspension,
                      },
                      { label: "Ad Blocking", active: settings.adBlocking },
                      {
                        label: "Script Control",
                        active: settings.scriptControl,
                      },
                      {
                        label: "Visible Priority",
                        active: settings.prioritizeVisibleContent,
                      },
                      {
                        label: "Font Optimization",
                        active: settings.fontOptimization,
                      },
                      {
                        label: "Stop Autoplay",
                        active: settings.stopAutoplay,
                      },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="flex items-center gap-2 py-1"
                      >
                        <div
                          className={`h-1.5 w-1.5 rounded-full ${
                            item.active
                              ? "bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.4)]"
                              : "bg-white/15"
                          }`}
                        />
                        <span
                          className={`text-xs ${
                            item.active
                              ? "text-white/60"
                              : "text-white/25"
                          }`}
                        >
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "performance" && (
              <PerformanceSection
                settings={settings}
                onUpdate={updateSetting}
              />
            )}

            {activeTab === "privacy" && (
              <PrivacySection settings={settings} onUpdate={updateSetting} />
            )}

            {activeTab === "content" && (
              <ContentSection settings={settings} onUpdate={updateSetting} />
            )}

            {activeTab === "whitelist" && (
              <WhitelistSection settings={settings} onUpdate={updateSetting} />
            )}

            {activeTab === "preferences" && (
              <PreferencesSection
                settings={settings}
                onUpdate={updateSetting}
                onReset={resetSettings}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Options;
