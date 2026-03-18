import type { Settings } from '@/shared/types/settings';

// All hosts that were ever in DEFAULT_PROTECTED_HOSTS (before it was emptied).
// Stripping them ensures existing users have zero protected sites by default.
const LEGACY_PROTECTED_HOSTS = new Set([
  'docs.google.com',
  'drive.google.com',
  'mail.google.com',
  'calendar.google.com',
  'meet.google.com',
  'figma.com',
  'app.slack.com',
  'discord.com',
  'teams.microsoft.com',
  'notion.so',
  'linear.app',
  'miro.com',
  'web.whatsapp.com',
  'airtable.com',
  'github.com',
  'stripe.com',
  'paypal.com',
]);

export function migrateProtectedHosts(settings: Settings): Settings {
  const protectedHosts = settings.protectedHosts.filter(
    (host) => !LEGACY_PROTECTED_HOSTS.has(host),
  );

  if (protectedHosts.length === settings.protectedHosts.length) {
    return settings;
  }

  return {
    ...settings,
    protectedHosts,
  };
}

export function clearProtectedHosts(settings: Settings): Settings {
  if (settings.protectedHosts.length === 0) {
    return settings;
  }

  return {
    ...settings,
    protectedHosts: [],
  };
}
