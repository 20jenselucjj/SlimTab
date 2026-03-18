import { useCallback, useEffect, useState } from 'react';

import { sendRuntimeMessage } from '@/shared/runtime';
import type { RuntimeResponse } from '@/shared/types/messages';
import type { SuspensionHistoryEntry } from '@/shared/types/settings';

export interface TabMetrics {
  activeTabs: number;
  suspendedTabs: number;
  totalTabs: number;
  memorySavedMB: number;
  pagesOptimized: number;
  scriptsControlled: number;
  autoplayStops: number;
  preloadHintsInjected: number;
  suspensionHistory: SuspensionHistoryEntry[];
}

export const EMPTY_METRICS: TabMetrics = {
  activeTabs: 0,
  suspendedTabs: 0,
  totalTabs: 0,
  memorySavedMB: 0,
  pagesOptimized: 0,
  scriptsControlled: 0,
  autoplayStops: 0,
  preloadHintsInjected: 0,
  suspensionHistory: [],
};

export function useMetrics() {
  const [metrics, setMetrics] = useState<TabMetrics>(EMPTY_METRICS);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);

    const [statsResponse, tabs] = await Promise.all([
      sendRuntimeMessage<RuntimeResponse>({ type: 'stats:get' }),
      chrome.tabs.query({ currentWindow: true }),
    ]);

    const stats = statsResponse.ok && 'stats' in statsResponse ? statsResponse.stats : null;
    const activeTabs = tabs.filter((tab) => !tab.discarded).length;
    const suspendedTabs = tabs.filter((tab) => tab.discarded).length;

    setMetrics({
      activeTabs,
      suspendedTabs,
      totalTabs: tabs.length,
      memorySavedMB: stats?.estimatedMemorySavedMb ?? 0,
      pagesOptimized: stats?.pagesOptimized ?? 0,
      scriptsControlled: stats?.scriptsControlled ?? 0,
      autoplayStops: stats?.autoplayStops ?? 0,
      preloadHintsInjected: stats?.preloadHintsInjected ?? 0,
      suspensionHistory: stats?.suspensionHistory ?? [],
    });

    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { metrics, loading, refresh } as const;
}
