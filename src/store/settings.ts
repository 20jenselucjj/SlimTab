import { useCallback, useEffect, useMemo, useState } from 'react';

import { defaultSettings } from '@/shared/defaults';
import { sendRuntimeMessage } from '@/shared/runtime';
import type { RuntimeResponse } from '@/shared/types/messages';
import type { Level, Settings, SiteOverride, ThemeMode as SharedThemeMode, WhitelistEntry } from '@/shared/types/settings';

export type BlockingLevel = Level;
export type SuspensionDelay = '30s' | '1m' | '5m' | '15m' | '30m' | '1h' | 'never';
export type ThemeMode = Extract<SharedThemeMode, 'dark' | 'system'>;
export type FontStrategy = 'off' | 'swap' | 'optional' | 'system-only';
export type PreloadStrategy = 'off' | 'hover' | 'viewport';
export type AutoplayStrategy = 'allow-common' | 'block-all';

export interface SlimTabSettings {
  tabSuspension: boolean;
  suspensionDelay: SuspensionDelay;
  protectPinnedTabs: boolean;
  protectAudibleTabs: boolean;
  protectActiveWindow: boolean;
  respectFormActivity: boolean;
  recentRecoveries: SiteOverride[];
  prioritizeVisibleContent: boolean;
  safeMode: boolean;
  adBlocking: boolean;
  adBlockingLevel: BlockingLevel;
  scriptControl: boolean;
  scriptControlLevel: BlockingLevel;
  fontOptimization: boolean;
  fontStrategy: FontStrategy;
  stopAutoplay: boolean;
  autoplayStrategy: AutoplayStrategy;
  linkPreloading: boolean;
  preloadStrategy: PreloadStrategy;
  whitelist: WhitelistEntry[];
  theme: ThemeMode;
  showBadgeCount: boolean;
  notifyOnSuspend: boolean;
}

const delayToMinutes: Record<SuspensionDelay, number> = {
  '30s': 0.5,
  '1m': 1,
  '5m': 5,
  '15m': 15,
  '30m': 30,
  '1h': 60,
  never: 0,
};

function minutesToDelay(minutes: number): SuspensionDelay {
  if (minutes <= 0) return 'never';
  if (minutes <= 0.5) return '30s';
  if (minutes <= 1) return '1m';
  if (minutes <= 5) return '5m';
  if (minutes <= 15) return '15m';
  if (minutes <= 30) return '30m';
  return '1h';
}

function fontLevelToStrategy(level: Settings['pageTweaks']['fontOptimization']): FontStrategy {
  if (level === 'off') return 'off';
  if (level === 'low') return 'swap';
  if (level === 'medium') return 'optional';
  return 'system-only';
}

function strategyToFontLevel(strategy: FontStrategy): Settings['pageTweaks']['fontOptimization'] {
  switch (strategy) {
    case 'swap':
      return 'low';
    case 'optional':
      return 'medium';
    case 'system-only':
      return 'high';
    default:
      return 'off';
  }
}

function preloadToStrategy(mode: Settings['pageTweaks']['preloading']): PreloadStrategy {
  if (mode === 'same-site') return 'hover';
  if (mode === 'all') return 'viewport';
  return 'off';
}

function strategyToPreload(mode: PreloadStrategy): Settings['pageTweaks']['preloading'] {
  if (mode === 'hover') return 'same-site';
  if (mode === 'viewport') return 'all';
  return 'off';
}

function toUiSettings(settings: Settings): SlimTabSettings {
  return {
    tabSuspension: settings.suspension.level !== 'off',
    suspensionDelay: minutesToDelay(settings.suspension.delayMinutes),
    protectPinnedTabs: settings.suspension.protectPinnedTabs,
    protectAudibleTabs: settings.suspension.protectAudibleTabs,
    protectActiveWindow: settings.suspension.protectActiveWindow,
    respectFormActivity: settings.suspension.respectFormActivity,
    recentRecoveries: settings.safeMode.recentRecoveries,
    prioritizeVisibleContent: settings.pageTweaks.visibleContentPriority !== 'off',
    safeMode: settings.safeMode.enabled,
    adBlocking: settings.blocking.adsLevel !== 'off',
    adBlockingLevel: settings.blocking.adsLevel,
    scriptControl: settings.blocking.scriptsLevel !== 'off',
    scriptControlLevel: settings.blocking.scriptsLevel,
    fontOptimization: settings.pageTweaks.fontOptimization !== 'off',
    fontStrategy: fontLevelToStrategy(settings.pageTweaks.fontOptimization),
    stopAutoplay: settings.pageTweaks.stopAutoplay !== 'off',
    autoplayStrategy: settings.pageTweaks.stopAutoplay === 'block-all' ? 'block-all' : 'allow-common',
    linkPreloading: settings.pageTweaks.preloading !== 'off',
    preloadStrategy: preloadToStrategy(settings.pageTweaks.preloading),
    whitelist: settings.whitelist,
    theme: settings.ui.theme === 'system' ? 'system' : 'dark',
    showBadgeCount: settings.ui.showBlockedBadge,
    notifyOnSuspend: settings.ui.notifyOnSuspend,
  };
}

function toRuntimeSettings(ui: SlimTabSettings, current: Settings): Settings {
  // Preserve previous non-off values when enabling features
  const prevFontLevel = current.pageTweaks.fontOptimization !== 'off' ? current.pageTweaks.fontOptimization : 'medium';
  const prevPreloadMode = current.pageTweaks.preloading !== 'off' ? current.pageTweaks.preloading : 'same-site';
  const prevAdsLevel = current.blocking.adsLevel !== 'off' ? current.blocking.adsLevel : 'high';
  const prevScriptsLevel = current.blocking.scriptsLevel !== 'off' ? current.blocking.scriptsLevel : 'low';

  return {
    ...current,
    suspension: {
      ...current.suspension,
      level: ui.tabSuspension ? current.suspension.level === 'off' ? 'medium' : current.suspension.level : 'off',
      delayMinutes: delayToMinutes[ui.suspensionDelay],
      protectPinnedTabs: ui.protectPinnedTabs,
      protectAudibleTabs: ui.protectAudibleTabs,
      protectActiveWindow: ui.protectActiveWindow,
      respectFormActivity: ui.respectFormActivity,
    },
    blocking: {
      ...current.blocking,
      adsLevel: ui.adBlocking ? (ui.adBlockingLevel === 'off' ? prevAdsLevel : ui.adBlockingLevel) : 'off',
      scriptsLevel: ui.scriptControl ? (ui.scriptControlLevel === 'off' ? prevScriptsLevel : ui.scriptControlLevel) : 'off',
    },
    pageTweaks: {
      ...current.pageTweaks,
      fontOptimization: ui.fontOptimization 
        ? (ui.fontStrategy === 'off' ? prevFontLevel : strategyToFontLevel(ui.fontStrategy)) 
        : 'off',
      visibleContentPriority: ui.prioritizeVisibleContent ? current.pageTweaks.visibleContentPriority === 'off' ? 'medium' : current.pageTweaks.visibleContentPriority : 'off',
      preloading: ui.linkPreloading 
        ? (ui.preloadStrategy === 'off' ? prevPreloadMode : strategyToPreload(ui.preloadStrategy)) 
        : 'off',
      stopAutoplay: ui.stopAutoplay ? ui.autoplayStrategy : 'off',
    },
    safeMode: {
      ...current.safeMode,
      enabled: ui.safeMode,
      recentRecoveries: ui.recentRecoveries,
    },
    whitelist: ui.whitelist,
    ui: {
      ...current.ui,
      theme: ui.theme,
      showBlockedBadge: ui.showBadgeCount,
      notifyOnSuspend: ui.notifyOnSuspend,
    },
  };
}

export const DEFAULT_SETTINGS = toUiSettings(defaultSettings);

export function useSettings() {
  const [runtimeSettings, setRuntimeSettings] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    void (async () => {
      const response = await sendRuntimeMessage<RuntimeResponse>({ type: 'settings:get' });
      if (mounted && response.ok && 'settings' in response) {
        setRuntimeSettings(response.settings);
      }
      if (mounted) setLoading(false);
    })();

    const listener = (
      changes: Record<string, chrome.storage.StorageChange>,
      areaName: string,
    ) => {
      if (areaName !== 'local' || !changes.settings?.newValue) return;
      setRuntimeSettings(changes.settings.newValue as Settings);
    };

    chrome.storage.onChanged.addListener(listener);

    return () => {
      mounted = false;
      chrome.storage.onChanged.removeListener(listener);
    };
  }, []);

  const settings = useMemo(() => toUiSettings(runtimeSettings), [runtimeSettings]);

  const updateSetting = useCallback(
    async <K extends keyof SlimTabSettings>(key: K, value: SlimTabSettings[K]) => {
      const nextUi = { ...toUiSettings(runtimeSettings), [key]: value } as SlimTabSettings;
      const nextRuntime = toRuntimeSettings(nextUi, runtimeSettings);
      setRuntimeSettings(nextRuntime);
      await sendRuntimeMessage<RuntimeResponse>({ type: 'settings:update', value: nextRuntime });
    },
    [runtimeSettings],
  );

  const replaceSettings = useCallback(
    async (nextUi: SlimTabSettings) => {
      const nextRuntime = toRuntimeSettings(nextUi, runtimeSettings);
      setRuntimeSettings(nextRuntime);
      await sendRuntimeMessage<RuntimeResponse>({ type: 'settings:update', value: nextRuntime });
    },
    [runtimeSettings],
  );

  const resetSettings = useCallback(async () => {
    setRuntimeSettings(defaultSettings);
    await sendRuntimeMessage<RuntimeResponse>({ type: 'settings:update', value: defaultSettings });
  }, []);

  return { settings, loading, updateSetting, replaceSettings, resetSettings } as const;
}
