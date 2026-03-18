import { defineBackground } from '#imports';

import { registerMessageHandlers } from '@/background/messaging';
import { reconcileRulesets } from '@/background/rules';
import { suspendEligibleTabs } from '@/background/suspension';
import {
  ALARM_NAME,
  EXTENSION_NAME,
} from '@/shared/constants';
import { defaultSettings } from '@/shared/defaults';
import { getSettings, settingsItem } from '@/storage/settings';
import { recordSuspensions } from '@/storage/stats';
import { getTabStateMap } from '@/storage/tab-state';

async function ensureDefaults() {
  const stored = await settingsItem.getValue();
  if (!stored) {
    await settingsItem.setValue(defaultSettings);
  }
}

async function reconcile() {
  const settings = await getSettings();
  await reconcileRulesets(settings);
  await chrome.declarativeNetRequest.setExtensionActionOptions({
    displayActionCountAsBadgeText: settings.ui.showBlockedBadge,
  });

  if (!settings.ui.showBlockedBadge) {
    await chrome.action.setBadgeText({ text: '' });
  }
}

export default defineBackground(() => {
  registerMessageHandlers();

  chrome.runtime.onInstalled.addListener(async () => {
    await ensureDefaults();
    await chrome.alarms.create(ALARM_NAME, { delayInMinutes: 1, periodInMinutes: 1 });
    await reconcile();
    await chrome.action.setBadgeBackgroundColor({ color: '#2ccfc1' });
  });

  chrome.runtime.onStartup.addListener(async () => {
    await ensureDefaults();
    await reconcile();
  });

  chrome.storage.onChanged.addListener((_changes, areaName) => {
    if (areaName !== 'local') return;
    void reconcile();
  });

  chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name !== ALARM_NAME) return;
    void (async () => {
      const settings = await getSettings();
      const tabStateMap = await getTabStateMap();
      const suspendedEntries = await suspendEligibleTabs(settings, tabStateMap);
      if (suspendedEntries.length > 0) {
        await recordSuspensions(suspendedEntries);
      }
    })();
  });

  chrome.commands.onCommand.addListener((command) => {
    if (command === 'open_dashboard') {
      void chrome.runtime.openOptionsPage();
      return;
    }

    if (command === 'suspend_inactive_tabs') {
      void (async () => {
        const settings = await getSettings();
        const state = await getTabStateMap();
        const suspendedEntries = await suspendEligibleTabs(settings, state);
        if (suspendedEntries.length > 0) {
          await recordSuspensions(suspendedEntries);
        }
      })();
    }
  });

  chrome.action.setTitle({ title: `${EXTENSION_NAME} performance controls` }).catch(() => undefined);
});
