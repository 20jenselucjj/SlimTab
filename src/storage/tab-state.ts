import { storage } from '#imports';

import type { TabSignal } from '@/shared/types/settings';

type TabStateMap = Record<string, TabSignal>;

export const tabStateItem = storage.defineItem<TabStateMap>('session:tab-state', {
  fallback: {},
});

export async function getTabStateMap() {
  return tabStateItem.getValue();
}

export async function setTabSignal(signal: TabSignal) {
  const current = await getTabStateMap();
  await tabStateItem.setValue({
    ...current,
    [String(signal.tabId)]: signal,
  });
}

export async function clearTabSignal(tabId: number) {
  const current = await getTabStateMap();
  const next = { ...current };
  delete next[String(tabId)];
  await tabStateItem.setValue(next);
}
