import { describe, expect, it } from 'vitest';

import { getMatchedFeatures, matchesPattern } from './domain';

describe('domain matching', () => {
  it('matches exact and wildcard host patterns', () => {
    expect(matchesPattern('app.example.com', '*.example.com')).toBe(true);
    expect(matchesPattern('example.com', '*.example.com')).toBe(true);
    expect(matchesPattern('news.example.com', 'example.com')).toBe(true);
    expect(matchesPattern('example.org', 'example.com')).toBe(false);
  });

  it('collects exempted features for matching whitelist entries', () => {
    const matched = getMatchedFeatures('app.example.com', [
      { id: '1', pattern: '*.example.com', features: ['ads', 'scripts'] },
      { id: '2', pattern: 'billing.example.com', features: ['suspension'] },
    ]);

    expect([...matched]).toEqual(['ads', 'scripts']);
  });
});
