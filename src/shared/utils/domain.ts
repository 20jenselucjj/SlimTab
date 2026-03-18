import type { FeatureKey, WhitelistEntry } from '../types/settings';

export function normalizeHostname(input: string): string {
  return input.trim().toLowerCase().replace(/^\*\./, '');
}

export function hostnameFromUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    return normalizeHostname(parsed.hostname);
  } catch {
    return null;
  }
}

export function matchesPattern(hostname: string, pattern: string): boolean {
  const normalizedHost = normalizeHostname(hostname);
  const normalizedPattern = pattern.trim().toLowerCase();

  if (!normalizedPattern) return false;
  if (normalizedPattern.startsWith('*.')) {
    const root = normalizeHostname(normalizedPattern);
    return normalizedHost === root || normalizedHost.endsWith(`.${root}`);
  }

  const exact = normalizeHostname(normalizedPattern);
  return normalizedHost === exact || normalizedHost.endsWith(`.${exact}`);
}

export function getMatchedFeatures(hostname: string, whitelist: WhitelistEntry[]): Set<FeatureKey> {
  const matched = new Set<FeatureKey>();

  for (const entry of whitelist) {
    if (!matchesPattern(hostname, entry.pattern)) continue;
    for (const feature of entry.features) matched.add(feature);
  }

  return matched;
}

export function isProtectedHost(hostname: string, protectedHosts: string[]): boolean {
  return protectedHosts.some((pattern) => matchesPattern(hostname, pattern));
}
