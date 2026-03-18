import { storage } from '#imports';

import { defaultSettings } from '@/shared/defaults';
import { clearProtectedHosts, migrateProtectedHosts } from '@/storage/migrations';
import type { Settings } from '@/shared/types/settings';

export const settingsItem = storage.defineItem<Settings>('local:settings', {
  fallback: defaultSettings,
  version: 3,
  migrations: {
    2: migrateProtectedHosts,
    3: clearProtectedHosts,
  },
});

export function normalizeSettings(settings: Settings): Settings {
  return clearProtectedHosts(settings);
}

export async function getSettings(): Promise<Settings> {
  const settings = await settingsItem.getValue();
  const normalized = normalizeSettings(settings);

  if (normalized !== settings) {
    await settingsItem.setValue(normalized);
  }

  return normalized;
}

export async function updateSettings(updater: (current: Settings) => Settings) {
  const current = await getSettings();
  const next = normalizeSettings(updater(current));
  await settingsItem.setValue(next);
  return next;
}
