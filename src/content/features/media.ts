import { reportSignal } from '../telemetry';

export function trackMediaActivity(hostname: string) {
  document.addEventListener(
    'play',
    () => {
      void reportSignal({ hostname, mediaActive: true });
    },
    { capture: true, passive: true },
  );

  document.addEventListener(
    'pause',
    () => {
      void reportSignal({ hostname, mediaActive: false });
    },
    { capture: true, passive: true },
  );
}
