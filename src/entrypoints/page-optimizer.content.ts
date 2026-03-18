import { defineContentScript } from '#imports';

import { stopAutoplay } from '@/content/features/autoplay';
import { optimizeFonts } from '@/content/features/fonts';
import { trackFormActivity } from '@/content/features/forms';
import { trackMediaActivity } from '@/content/features/media';
import { enableLinkPreloading } from '@/content/features/preloading';
import { prioritizeVisibleContent } from '@/content/features/priority';
import { getPagePolicy } from '@/content/policy';

export default defineContentScript({
  matches: ['http://*/*', 'https://*/*'],
  runAt: 'document_idle',
  async main() {
    const { hostname, policy, isEnabled } = await getPagePolicy();
    if (!policy || !hostname) return;

    trackFormActivity(hostname);
    trackMediaActivity(hostname);

    if (isEnabled('fonts')) {
      optimizeFonts(policy.settings.pageTweaks.fontOptimization);
    }

    if (isEnabled('priority')) {
      prioritizeVisibleContent(policy.settings.pageTweaks.visibleContentPriority);
    }

    if (isEnabled('preloading')) {
      enableLinkPreloading(hostname, policy.settings.pageTweaks.preloading);
    }

    if (isEnabled('autoplay')) {
      stopAutoplay(hostname, policy.settings.pageTweaks.stopAutoplay);
    }
  },
});
