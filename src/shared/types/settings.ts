import { FEATURE_KEYS, LEVELS, THEME_OPTIONS } from '../constants';

export type FeatureKey = (typeof FEATURE_KEYS)[number];
export type Level = (typeof LEVELS)[number];
export type ThemeMode = (typeof THEME_OPTIONS)[number];

export type WhitelistEntry = {
  id: string;
  pattern: string;
  features: FeatureKey[];
  note?: string;
};

export type SiteOverride = {
  hostname: string;
  disableUntil?: number;
  reason?: string;
};

export type SuspensionHistoryEntry = {
  hostname: string;
  estimatedMemorySavedMb: number;
  suspendedAt: number;
};

export type Settings = {
  suspension: {
    level: Exclude<Level, 'high'> | 'high';
    delayMinutes: number;
    protectPinnedTabs: boolean;
    protectAudibleTabs: boolean;
    protectActiveWindow: boolean;
    respectFormActivity: boolean;
  };
  blocking: {
    adsLevel: Level;
    scriptsLevel: Level;
    enableSafeDefaults: boolean;
  };
  pageTweaks: {
    fontOptimization: Level;
    visibleContentPriority: Level;
    preloading: 'off' | 'same-site' | 'all';
    stopAutoplay: 'off' | 'allow-common' | 'block-all';
  };
  safeMode: {
    enabled: boolean;
    autoRecover: boolean;
    recentRecoveries: SiteOverride[];
  };
  whitelist: WhitelistEntry[];
  protectedHosts: string[];
  ui: {
    theme: ThemeMode;
    reduceMotion: boolean;
    compactMetrics: boolean;
    showBlockedBadge: boolean;
    notifyOnSuspend: boolean;
  };
};

export type DashboardStats = {
  tabsSuspended: number;
  pagesOptimized: number;
  scriptsControlled: number;
  estimatedMemorySavedMb: number;
  autoplayStops: number;
  preloadHintsInjected: number;
  suspensionHistory: SuspensionHistoryEntry[];
  lastUpdatedAt: number;
};

export type TabSignal = {
  tabId: number;
  hostname: string;
  lastInteractionAt: number;
  hasDirtyForm: boolean;
  mediaActive: boolean;
};

export type PolicySnapshot = {
  settings: Settings;
  hostname: string;
  exemptions: Set<FeatureKey>;
  protectedHost: boolean;
  recoveryActive: boolean;
};
