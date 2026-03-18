import { afterEach, describe, expect, it, vi } from 'vitest';

import { sendRuntimeMessage } from './runtime';

describe('sendRuntimeMessage', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns an error response when the extension context is invalidated', async () => {
    vi.stubGlobal('chrome', {
      runtime: {
        sendMessage: vi.fn(),
      },
    });

    const response = await sendRuntimeMessage({ type: 'settings:get' });

    expect(response).toEqual({
      ok: false,
      error: 'Extension context invalidated',
    });
  });

  it('swallows benign runtime messaging errors', async () => {
    vi.stubGlobal('chrome', {
      runtime: {
        id: 'runtime-id',
        sendMessage: vi.fn().mockRejectedValue(new Error('Extension context invalidated.')),
      },
    });

    const response = await sendRuntimeMessage({ type: 'stats:get' });

    expect(response).toEqual({
      ok: false,
      error: 'Extension context invalidated.',
    });
  });
});
