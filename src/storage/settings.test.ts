import { describe, expect, it } from 'vitest';

import { defaultSettings } from '../shared/defaults';

import { clearProtectedHosts, migrateProtectedHosts } from './migrations';

describe('settings migration', () => {
  it('removes all legacy protected hosts from stored settings', () => {
    const migrated = migrateProtectedHosts({
      ...defaultSettings,
      protectedHosts: [
        'mail.google.com',
        'calendar.google.com',
        'docs.google.com',
        'drive.google.com',
        'meet.google.com',
        'figma.com',
        'app.slack.com',
        'discord.com',
        'notion.so',
        'linear.app',
        'github.com',
        'stripe.com',
        'example.com', // user-added, should survive
      ],
    });

    expect(migrated.protectedHosts).toEqual(['example.com']);
  });

  it('returns the same settings object when no legacy hosts exist', () => {
    const settings = {
      ...defaultSettings,
      protectedHosts: ['example.com', 'mybank.com'],
    };

    expect(migrateProtectedHosts(settings)).toBe(settings);
  });

  it('clears all protected hosts so no sites are exempt from suspension', () => {
    const cleared = clearProtectedHosts({
      ...defaultSettings,
      protectedHosts: ['example.com', 'mybank.com'],
    });

    expect(cleared.protectedHosts).toEqual([]);
  });
});
