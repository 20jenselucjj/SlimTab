import { incrementPageStats, reportSignal } from '../telemetry';

const COMMON_ALLOW_LIST = [/youtube\.com$/u, /meet\.google\.com$/u, /zoom\.us$/u, /teams\.microsoft\.com$/u, /vimeo\.com$/u];

export function stopAutoplay(hostname: string, mode: 'allow-common' | 'block-all') {
  if (mode === 'allow-common' && COMMON_ALLOW_LIST.some((pattern) => pattern.test(hostname))) {
    return;
  }

  const pauseMedia = (element: HTMLMediaElement) => {
    element.autoplay = false;
    element.muted = true;
    element.pause();
    void reportSignal({ hostname, mediaActive: false });
    void incrementPageStats({ autoplayStops: 1 });
  };

  document.querySelectorAll<HTMLMediaElement>('video, audio').forEach(pauseMedia);

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      mutation.addedNodes.forEach((node) => {
        if (!(node instanceof HTMLMediaElement)) return;
        pauseMedia(node);
      });
    }
  });

  observer.observe(document.documentElement, { childList: true, subtree: true });
}
