import { createSuspensionHistoryEntry } from '@/storage/stats';
import { SUSPENSION_PRESETS } from '@/shared/constants';
import { buildPolicySnapshot, isFeatureEnabled } from '@/shared/policy';
import { minutesAgo } from '@/shared/utils/time';
import { hostnameFromUrl } from '@/shared/utils/domain';
import type { Settings, SuspensionHistoryEntry, TabSignal } from '@/shared/types/settings';

function protectBySignal(signal: TabSignal | undefined, settings: Settings) {
  if (!signal) return false;
  if (settings.suspension.respectFormActivity && signal.hasDirtyForm) return true;
  if (signal.mediaActive) return true;
  return minutesAgo(signal.lastInteractionAt) < getSuspendThresholdMinutes(settings);
}

function getSuspendThresholdMinutes(settings: Settings) {
  if (settings.suspension.level === 'off') return Infinity;
  return settings.suspension.delayMinutes || SUSPENSION_PRESETS[settings.suspension.level];
}

export async function suspendEligibleTabs(
  settings: Settings,
  signals: Record<string, TabSignal>,
) {
  if (settings.suspension.level === 'off') return [] as SuspensionHistoryEntry[];

  const tabs = await chrome.tabs.query({ discarded: false });
  const suspendedEntries: SuspensionHistoryEntry[] = [];

  for (const tab of tabs) {
    if (!tab.id || !tab.url) continue;
    if (tab.active && settings.suspension.protectActiveWindow) continue;
    if (tab.pinned && settings.suspension.protectPinnedTabs) continue;
    if (tab.audible && settings.suspension.protectAudibleTabs) continue;

    const hostname = hostnameFromUrl(tab.url);
    if (!hostname) continue;

    const policy = buildPolicySnapshot(hostname, settings);
    if (!isFeatureEnabled(policy, 'suspension')) continue;
    if (protectBySignal(signals[String(tab.id)], settings)) continue;

    const lastAccessedMinutes = tab.lastAccessed ? minutesAgo(tab.lastAccessed) : Infinity;
    if (lastAccessedMinutes < getSuspendThresholdMinutes(settings)) continue;

    try {
      await chrome.tabs.discard(tab.id);
      suspendedEntries.push(createSuspensionHistoryEntry(hostname));
    } catch {
      continue;
    }
  }

  return suspendedEntries;
}

export async function suspendCurrentTab(settings: Settings, signals: Record<string, TabSignal>) {
  const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!activeTab?.id || !activeTab.url) return false;

  const hostname = hostnameFromUrl(activeTab.url);
  if (!hostname) return false;

  const policy = buildPolicySnapshot(hostname, settings);
  if (!isFeatureEnabled(policy, 'suspension')) return false;
  if (activeTab.audible || activeTab.pinned) return false;
  if (protectBySignal(signals[String(activeTab.id)], settings)) return false;

  try {
    await chrome.tabs.discard(activeTab.id);
    return true;
  } catch {
    return false;
  }
}
