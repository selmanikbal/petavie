import type { AnalyticsEvent } from '@/constants/analytics';
import { isDevelopment } from '@/config/env';

export type AnalyticsProperties = Record<string, string | number | boolean | null>;

/** Dev-only console logger until a real provider is wired. */
export const analytics = {
  track(event: AnalyticsEvent, properties?: AnalyticsProperties) {
    if (isDevelopment) {
      console.log('[analytics] track', event, properties ?? {});
    }
  },
};
