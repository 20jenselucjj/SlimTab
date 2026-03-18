import { buildPolicySnapshot, isFeatureEnabled } from '@/shared/policy';
import type { RuntimeResponse } from '@/shared/types/messages';
import { sendRuntimeMessage } from '@/shared/runtime';
import { hostnameFromUrl } from '@/shared/utils/domain';

export async function getPagePolicy() {
  const hostname = hostnameFromUrl(window.location.href);
  if (!hostname) {
    return {
      hostname: '',
      policy: null,
      isEnabled: () => false,
    };
  }

  const settingsResponse = await sendRuntimeMessage<RuntimeResponse>({ type: 'settings:get' });
  if (!settingsResponse.ok || !('settings' in settingsResponse)) {
    return {
      hostname,
      policy: null,
      isEnabled: () => false,
    };
  }

  const snapshot = buildPolicySnapshot(hostname, settingsResponse.settings);

  return {
    hostname,
    policy: snapshot,
    isEnabled: (feature: Parameters<typeof isFeatureEnabled>[1]) => isFeatureEnabled(snapshot, feature),
  };
}
