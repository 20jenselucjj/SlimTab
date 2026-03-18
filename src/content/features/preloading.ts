import { incrementPageStats, reportSignal } from '../telemetry';

function sameOrigin(href: string) {
  try {
    return new URL(href, window.location.href).origin === window.location.origin;
  } catch {
    return false;
  }
}

export function enableLinkPreloading(hostname: string, mode: 'same-site' | 'all') {
  const seen = new Set<string>();

  document.addEventListener(
    'mouseover',
    (event) => {
      const link = (event.target as HTMLElement | null)?.closest('a[href]') as HTMLAnchorElement | null;
      if (!link?.href || seen.has(link.href)) return;
      if (mode === 'same-site' && !sameOrigin(link.href)) return;

      const hint = document.createElement('link');
      hint.rel = 'prefetch';
      hint.href = link.href;
      hint.as = 'document';
      document.head.append(hint);
      seen.add(link.href);
      void reportSignal({ hostname });
      void incrementPageStats({ preloadHintsInjected: 1 });
    },
    { passive: true },
  );
}
