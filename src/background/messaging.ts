import { buildPolicySnapshot } from '@/shared/policy';
import type { RuntimeRequest, RuntimeResponse } from '@/shared/types/messages';
import { plusMinutes } from '@/shared/utils/time';
import { getSettings, settingsItem, updateSettings } from '@/storage/settings';
import { incrementStats } from '@/storage/stats';
import { statsItem } from '@/storage/stats';
import { getTabStateMap, setTabSignal } from '@/storage/tab-state';
import { suspendCurrentTab } from './suspension';

async function disableHostname(hostname: string, minutes = 15) {
  const current = await getSettings();
  const next = {
    ...current,
    safeMode: {
      ...current.safeMode,
      recentRecoveries: [
        ...current.safeMode.recentRecoveries.filter((entry) => entry.hostname !== hostname),
        { hostname, disableUntil: plusMinutes(minutes), reason: 'temporary-disable' },
      ],
    },
  };

  await settingsItem.setValue(next);
  return next;
}

export function registerMessageHandlers() {
  chrome.runtime.onMessage.addListener((message: RuntimeRequest, sender, sendResponse) => {
    void (async () => {
      try {
        switch (message.type) {
          case 'settings:get': {
            sendResponse({ ok: true, settings: await getSettings() } satisfies RuntimeResponse);
            return;
          }
          case 'settings:update': {
            const settings = await updateSettings(() => message.value);
            sendResponse({ ok: true, settings } satisfies RuntimeResponse);
            return;
          }
          case 'stats:get': {
            sendResponse({ ok: true, stats: await statsItem.getValue() } satisfies RuntimeResponse);
            return;
          }
          case 'stats:increment': {
            await incrementStats(message.value);
            sendResponse({ ok: true, stats: await statsItem.getValue() } satisfies RuntimeResponse);
            return;
          }
          case 'tab:suspend-current': {
            const settings = await getSettings();
            const signals = await getTabStateMap();
            const suspended = await suspendCurrentTab(settings, signals);
            sendResponse({ ok: true, suspended } satisfies RuntimeResponse);
            return;
          }
          case 'tab:signal': {
            if (!sender.tab?.id) {
              sendResponse({ ok: false, error: 'Missing sender tab id' } satisfies RuntimeResponse);
              return;
            }

            await setTabSignal({
              ...message.value,
              tabId: sender.tab.id,
            });
            sendResponse({ ok: true, suspended: false } satisfies RuntimeResponse);
            return;
          }
          case 'site:disable-temporarily': {
            const settings = await disableHostname(message.hostname, message.minutes ?? 15);
            sendResponse({ ok: true, settings } satisfies RuntimeResponse);
            return;
          }
          case 'site:get-policy': {
            const snapshot = buildPolicySnapshot(message.hostname, await getSettings());
            sendResponse({
              ok: true,
              policy: {
                safeMode: snapshot.settings.safeMode.enabled,
                exemptions: [...snapshot.exemptions],
                protectedHost: snapshot.protectedHost,
              },
            } satisfies RuntimeResponse);
            return;
          }
          default:
            sendResponse({ ok: false, error: 'Unknown message type' } satisfies RuntimeResponse);
        }
      } catch (error) {
        sendResponse({ ok: false, error: error instanceof Error ? error.message : 'Unexpected error' } satisfies RuntimeResponse);
      }
    })();

    return true;
  });
}
