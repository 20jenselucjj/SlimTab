import { reportSignal } from '../telemetry';

export function trackFormActivity(hostname: string) {
  const markDirty = () => {
    void reportSignal({ hostname, hasDirtyForm: true });
  };

  document.addEventListener('input', markDirty, { passive: true });
  document.addEventListener('change', markDirty, { passive: true });
}
