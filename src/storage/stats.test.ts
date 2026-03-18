import { describe, expect, it } from 'vitest';
import { vi } from 'vitest';

vi.mock('#imports', () => ({
  storage: {
    defineItem: () => ({
      getValue: vi.fn(),
      setValue: vi.fn(),
    }),
  },
}));

import { defaultStats } from '../shared/defaults';

import { mergeSuspensionHistory } from './stats';

describe('mergeSuspensionHistory', () => {
  it('records suspended sites and updates saved memory totals', () => {
    const next = mergeSuspensionHistory(defaultStats, [
      {
        hostname: 'example.com',
        estimatedMemorySavedMb: 120,
        suspendedAt: 1,
      },
      {
        hostname: 'news.example.com',
        estimatedMemorySavedMb: 120,
        suspendedAt: 2,
      },
    ]);

    expect(next.tabsSuspended).toBe(2);
    expect(next.estimatedMemorySavedMb).toBe(240);
    expect(next.suspensionHistory).toHaveLength(2);
  });

  it('caps suspension history at 100 entries', () => {
    const entries = Array.from({ length: 110 }, (_, index) => ({
      hostname: `site-${index}.example`,
      estimatedMemorySavedMb: 120,
      suspendedAt: index,
    }));

    const next = mergeSuspensionHistory(defaultStats, entries);

    expect(next.suspensionHistory).toHaveLength(100);
    expect(next.suspensionHistory[0]?.hostname).toBe('site-0.example');
    expect(next.suspensionHistory.at(-1)?.hostname).toBe('site-99.example');
  });
});
