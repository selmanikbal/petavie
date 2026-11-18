import { Alert, Linking, Platform, Share } from 'react-native';

import {
  APP_STORE_REVIEW_URL,
  APP_STORE_URL,
  PLAY_STORE_NATIVE_URL,
  PLAY_STORE_URL,
  PRIVACY_POLICY_URL,
  SUPPORT_EMAIL,
} from '@/constants/app-links';

async function openFirstAvailable(urls: string[]): Promise<boolean> {
  for (const url of urls) {
    try {
      await Linking.openURL(url);
      return true;
    } catch {
      // Try the next URL (e.g. no store app on the device).
    }
  }
  return false;
}

/** Opens this app's store page so the user can leave a rating. */
export async function openStoreReview(): Promise<void> {
  const urls =
    Platform.OS === 'ios'
      ? [APP_STORE_REVIEW_URL, APP_STORE_URL]
      : [PLAY_STORE_NATIVE_URL, PLAY_STORE_URL];
  const opened = await openFirstAvailable(urls);
  if (!opened) {
    Alert.alert('Mağaza açılamadı', 'Lütfen daha sonra tekrar dene.');
  }
}

export async function shareApp(): Promise<void> {
  const message =
    'Evcil dostlarının aşı, ilaç ve bakım hatırlatmalarını Petavie ile tek yerden takip et.\n\n' +
    `App Store: ${APP_STORE_URL}\n` +
    `Google Play: ${PLAY_STORE_URL}`;
  try {
    await Share.share({ message });
  } catch {
    // Share sheet dismissed or unavailable; nothing to do.
  }
}

export async function sendFeedback(): Promise<void> {
  const subject = encodeURIComponent('Petavie geri bildirim');
  const opened = await openFirstAvailable([`mailto:${SUPPORT_EMAIL}?subject=${subject}`]);
  if (!opened) {
    Alert.alert('E-posta uygulaması bulunamadı', `Bize ${SUPPORT_EMAIL} adresinden ulaşabilirsin.`);
  }
}

export async function openPrivacyPolicy(): Promise<void> {
  const opened = await openFirstAvailable([PRIVACY_POLICY_URL]);
  if (!opened) {
    Alert.alert('Sayfa açılamadı', 'Lütfen daha sonra tekrar dene.');
  }
}
