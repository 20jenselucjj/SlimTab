import type { RuntimeResponse } from '@/shared/types/messages';
import { sendRuntimeMessage } from '@/shared/runtime';

export async function reportSignal(input: {
  hostname: string;
  hasDirtyForm?: boolean;
  mediaActive?: boolean;
}) {
  await sendRuntimeMessage<RuntimeResponse>({
    type: 'tab:signal',
    value: {
      hostname: input.hostname,
      lastInteractionAt: Date.now(),
      hasDirtyForm: input.hasDirtyForm ?? false,
      mediaActive: input.mediaActive ?? false,
    },
  });
}

export async function incrementPageStats(input: {
  pagesOptimized?: number;
  scriptsControlled?: number;
  autoplayStops?: number;
  preloadHintsInjected?: number;
}) {
  await sendRuntimeMessage<RuntimeResponse>({
    type: 'stats:increment',
    value: input,
  });
}
