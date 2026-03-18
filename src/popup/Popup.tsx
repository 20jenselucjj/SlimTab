import React from "react";
import { useSettings } from "../store/settings";
import { DashboardSection } from "./DashboardSection";
import { QuickControls } from "./QuickControls";
import { Logo } from "../components/Logo";

type OptionsTab = "performance" | "privacy" | "content";

// ── Lucide-style gear icon ───────────────────────────────────────────
const SettingsIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><title>Settings</title><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>
);

export const Popup: React.FC = () => {
  const { settings, updateSetting } = useSettings();

  const handleOpenOptions = () => {
    void chrome.runtime.openOptionsPage();
  };

  const handleMetricClick = (tab: OptionsTab) => {
    void chrome.tabs.create({
      url: chrome.runtime.getURL(`options.html?tab=${tab}`),
    });
  };

  return (
    <div className="w-[380px] min-h-[480px] max-h-[600px] bg-[#040b16] text-white overflow-y-auto">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-[#040b16]/90 backdrop-blur-xl border-b border-white/6">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2.5">
            <Logo className="h-7 w-7 rounded-lg" iconSize={16} />
            <div>
              <h1 className="text-sm font-bold tracking-tight">SlimTab</h1>
              <p className="text-[10px] text-white/30 font-medium">Performance Optimizer</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleOpenOptions}
            className="
              flex h-8 w-8 items-center justify-center rounded-lg
              text-white/30 hover:text-white/60 hover:bg-white/5
              transition-all duration-150
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/50
            "
            aria-label="Open settings"
          >
            <SettingsIcon />
          </button>
        </div>
      </header>

      {/* Content */}
        <div className="p-4 space-y-5">
          {/* Dashboard metrics */}
          <DashboardSection onMetricClick={handleMetricClick} />

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />

        {/* Quick toggles */}
        <QuickControls settings={settings} onUpdate={updateSetting} />
      </div>

      {/* Footer */}
      <footer className="sticky bottom-0 border-t border-white/6 bg-[#040b16]/90 backdrop-blur-xl px-4 py-2.5">
        <button
          type="button"
          onClick={handleOpenOptions}
          className="
            w-full rounded-lg bg-white/[0.04] border border-white/8
            px-3 py-2 text-xs font-medium text-white/50
            hover:bg-white/[0.07] hover:text-white/70 hover:border-white/12
            transition-all duration-150
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/50
          "
        >
          Advanced Settings
        </button>
      </footer>
    </div>
  );
};

export default Popup;
