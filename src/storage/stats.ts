import { storage } from '#imports';

import { defaultStats } from '../shared/defaults';
import type { DashboardStats, SuspensionHistoryEntry } from '../shared/types/settings';
import { SUSPENSION_ESTIMATED_MEMORY_MB } from '../shared/constants';

export const statsItem = storage.defineItem<DashboardStats>('local:stats', {
  fallback: defaultStats,
});

export async function incrementStats(partial: Partial<DashboardStats>) {
  const current = await statsItem.getValue();
  await statsItem.setValue({
    ...current,
    ...Object.fromEntries(
      Object.entries(partial).map(([key, value]) => [
        key,
        typeof value === 'number' && key in current
          ? ((current as Record<string, number>)[key] ?? 0) + value
          : value,
      ]),
    ),
    lastUpdatedAt: Date.now(),
  });
}

export function mergeSuspensionHistory(
  current: DashboardStats,
  entries: SuspensionHistoryEntry[],
): DashboardStats {
  if (entries.length === 0) {
    return current;
  }

  const estimatedMemorySavedMb = entries.reduce(
    (total, entry) => total + entry.estimatedMemorySavedMb,
    0,
  );

  return {
    ...current,
    tabsSuspended: current.tabsSuspended + entries.length,
    estimatedMemorySavedMb: current.estimatedMemorySavedMb + estimatedMemorySavedMb,
    suspensionHistory: [...entries, ...current.suspensionHistory].slice(0, 100),
    lastUpdatedAt: Date.now(),
  };
}

export async function recordSuspensions(entries: SuspensionHistoryEntry[]) {
  if (entries.length === 0) {
    return statsItem.getValue();
  }

  const current = await statsItem.getValue();
  const next = mergeSuspensionHistory(current, entries);
  await statsItem.setValue(next);
  return next;
}

export function createSuspensionHistoryEntry(hostname: string): SuspensionHistoryEntry {
  return {
    hostname,
    estimatedMemorySavedMb: SUSPENSION_ESTIMATED_MEMORY_MB,
    suspendedAt: Date.now(),
  };
}
