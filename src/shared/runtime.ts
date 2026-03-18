import type { RuntimeRequest, RuntimeResponse } from './types/messages';

const BENIGN_RUNTIME_ERRORS = [
  'Extension context invalidated',
  'Could not establish connection. Receiving end does not exist.',
] as const;

export async function sendRuntimeMessage<T extends RuntimeResponse>(message: RuntimeRequest): Promise<T> {
  if (!chrome.runtime?.id) {
    return {
      ok: false,
      error: 'Extension context invalidated',
    } as T;
  }

  try {
    return await chrome.runtime.sendMessage(message) as T;
  } catch (error) {
    if (
      error instanceof Error
      && BENIGN_RUNTIME_ERRORS.some((messageText) => error.message.includes(messageText))
    ) {
      return {
        ok: false,
        error: error.message,
      } as T;
    }

    throw error;
  }
}
