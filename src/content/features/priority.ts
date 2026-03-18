import { incrementPageStats } from '../telemetry';

const PRIORITY_SELECTOR = 'img, iframe, video';

function isOffscreen(element: Element) {
  const rect = element.getBoundingClientRect();
  return rect.top > window.innerHeight * 1.25;
}

function deferElement(element: Element, aggressive: boolean) {
  if (element instanceof HTMLImageElement) {
    if (!element.loading) element.loading = aggressive ? 'lazy' : 'eager';
    if (aggressive) element.decoding = 'async';
  }

  if (element instanceof HTMLIFrameElement) {
    element.loading = 'lazy';
    if (aggressive && element.src) {
      element.dataset.slimtabSrc = element.src;
      element.src = 'about:blank';
    }
  }
}

export function prioritizeVisibleContent(level: 'low' | 'medium' | 'high') {
  const aggressive = level === 'high';
  let optimized = 0;

  document.querySelectorAll(PRIORITY_SELECTOR).forEach((element) => {
    if (isOffscreen(element)) {
      deferElement(element, aggressive);
      optimized += 1;
    }
  });

  if (optimized > 0) {
    void incrementPageStats({ pagesOptimized: optimized });
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const element = entry.target;
        if (element instanceof HTMLIFrameElement && element.dataset.slimtabSrc) {
          element.src = element.dataset.slimtabSrc;
          delete element.dataset.slimtabSrc;
        }
        observer.unobserve(element);
      }
    },
    { rootMargin: '240px' },
  );

  document.querySelectorAll(PRIORITY_SELECTOR).forEach((element) => {
    observer.observe(element);
  });
}
