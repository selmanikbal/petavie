import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { AppState } from 'react-native';

import { AnalyticsEvents } from '@/constants/analytics';
import {
  configureLocalNotifications,
  ensureReminderChannel,
  syncReminderNotifications,
} from '@/features/reminders/notifications/local-scheduler';
import { analytics } from '@/services/analytics';

/** Wires on-device reminder notifications. Tokens are not sent anywhere. */
export function NotificationSetup() {
  useEffect(() => {
    configureLocalNotifications();
    void ensureReminderChannel().catch(() => undefined);

    // Top up the rolling notification window without prompting for permission.
    const refresh = () => {
      void syncReminderNotifications({ requestPermission: false }).catch(() => undefined);
    };
    refresh();

    const appStateSub = AppState.addEventListener('change', (state) => {
      if (state === 'active') refresh();
    });

    const receivedSub = Notifications.addNotificationReceivedListener(() => {
      analytics.track(AnalyticsEvents.notificationReceived);
    });

    // Tapping a reminder notification opens the reminders tab.
    const openReminders = (response: Notifications.NotificationResponse | null) => {
      if (!response?.notification.request.content.data?.reminderId) return;
      router.navigate('/(tabs)/reminders');
    };

    // App was launched from a notification tap (cold start).
    openReminders(Notifications.getLastNotificationResponse());

    const responseSub = Notifications.addNotificationResponseReceivedListener((response) => {
      analytics.track(AnalyticsEvents.notificationOpened);
      openReminders(response);
    });

    return () => {
      appStateSub.remove();
      receivedSub.remove();
      responseSub.remove();
    };
  }, []);

  return null;
}
