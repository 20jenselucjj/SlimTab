import { DEFAULT_PROTECTED_HOSTS } from './constants';
import type { DashboardStats, Settings } from './types/settings';

export const defaultSettings: Settings = {
  suspension: {
    level: 'medium',
    delayMinutes: 5,
    protectPinnedTabs: true,
    protectAudibleTabs: true,
    protectActiveWindow: true,
    respectFormActivity: true,
  },
  blocking: {
    adsLevel: 'high',
    scriptsLevel: 'low',
    enableSafeDefaults: true,
  },
  pageTweaks: {
    fontOptimization: 'medium',
    visibleContentPriority: 'medium',
    preloading: 'all',
    stopAutoplay: 'allow-common',
  },
  safeMode: {
    enabled: true,
    autoRecover: true,
    recentRecoveries: [],
  },
  whitelist: [],
  protectedHosts: [...DEFAULT_PROTECTED_HOSTS],
  ui: {
    theme: 'midnight',
    reduceMotion: false,
    compactMetrics: false,
    showBlockedBadge: true,
    notifyOnSuspend: false,
  },
};

export const defaultStats: DashboardStats = {
  tabsSuspended: 0,
  pagesOptimized: 0,
  scriptsControlled: 0,
  estimatedMemorySavedMb: 0,
  autoplayStops: 0,
  preloadHintsInjected: 0,
  suspensionHistory: [],
  lastUpdatedAt: Date.now(),
};
