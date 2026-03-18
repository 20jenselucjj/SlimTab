import { defaultSettings } from './defaults';
import { FEATURE_KEYS } from './constants';
import type { FeatureKey, PolicySnapshot, Settings } from './types/settings';
import { getMatchedFeatures, isProtectedHost } from './utils/domain';

export function buildPolicySnapshot(hostname: string, settings: Settings = defaultSettings): PolicySnapshot {
  const exemptions = getMatchedFeatures(hostname, settings.whitelist);
  const recoveryActive = settings.safeMode.recentRecoveries.some(
    (entry) => entry.hostname === hostname && (!entry.disableUntil || entry.disableUntil > Date.now()),
  );
  const protectedHost = recoveryActive || isProtectedHost(hostname, settings.protectedHosts);

  if (recoveryActive) {
    for (const feature of FEATURE_KEYS) exemptions.add(feature);
  }

  return {
    settings,
    hostname,
    exemptions,
    protectedHost,
    recoveryActive,
  };
}

export function isFeatureEnabled(snapshot: PolicySnapshot, feature: FeatureKey): boolean {
  if (snapshot.protectedHost && feature !== 'safeMode') return false;
  if (snapshot.exemptions.has(feature)) return false;

  switch (feature) {
    case 'suspension':
      return snapshot.settings.suspension.level !== 'off';
    case 'ads':
      return snapshot.settings.blocking.adsLevel !== 'off';
    case 'scripts':
      return snapshot.settings.blocking.scriptsLevel !== 'off';
    case 'fonts':
      return snapshot.settings.pageTweaks.fontOptimization !== 'off';
    case 'priority':
      return snapshot.settings.pageTweaks.visibleContentPriority !== 'off';
    case 'preloading':
      return snapshot.settings.pageTweaks.preloading !== 'off';
    case 'autoplay':
      return snapshot.settings.pageTweaks.stopAutoplay !== 'off';
    case 'safeMode':
      return snapshot.settings.safeMode.enabled;
    default:
      return false;
  }
}
