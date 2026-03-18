import { describe, expect, it } from 'vitest';

import { defaultSettings } from './defaults';
import { buildPolicySnapshot, isFeatureEnabled } from './policy';

describe('policy resolution', () => {
  it('disables exempted features for whitelisted domains', () => {
    const snapshot = buildPolicySnapshot('bank.example.com', {
      ...defaultSettings,
      whitelist: [
        {
          id: 'bank',
          pattern: 'bank.example.com',
          features: ['ads', 'scripts'],
        },
      ],
    });

    expect(isFeatureEnabled(snapshot, 'ads')).toBe(false);
    expect(isFeatureEnabled(snapshot, 'scripts')).toBe(false);
    expect(isFeatureEnabled(snapshot, 'suspension')).toBe(true);
  });

  it('protects hosts in recovery mode', () => {
    const snapshot = buildPolicySnapshot('docs.google.com', {
      ...defaultSettings,
      safeMode: {
        ...defaultSettings.safeMode,
        recentRecoveries: [{ hostname: 'docs.google.com', disableUntil: Date.now() + 60_000 }],
      },
    });

    expect(snapshot.protectedHost).toBe(true);
    expect(isFeatureEnabled(snapshot, 'autoplay')).toBe(false);
  });

  it('does not protect any host by default — including former protected hosts', () => {
    const formerProtected = [
      'docs.google.com',
      'drive.google.com',
      'mail.google.com',
      'calendar.google.com',
      'meet.google.com',
      'figma.com',
      'app.slack.com',
      'discord.com',
      'notion.so',
      'linear.app',
      'github.com',
      'stripe.com',
    ];

    for (const host of formerProtected) {
      const snapshot = buildPolicySnapshot(host);
      expect(snapshot.protectedHost, `${host} should not be protected`).toBe(false);
      expect(isFeatureEnabled(snapshot, 'suspension'), `${host} suspension should be enabled`).toBe(true);
    }
  });
});
