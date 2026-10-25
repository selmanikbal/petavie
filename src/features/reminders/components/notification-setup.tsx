import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';

import { AnalyticsEvents } from '@/constants/analytics';
import { configureLocalNotifications } from '@/features/reminders/notifications/local-scheduler';
import { analytics } from '@/services/analytics';

/** Wires on-device reminder notifications. Tokens are not sent anywhere. */
export function NotificationSetup() {
  useEffect(() => {
    configureLocalNotifications();

    const receivedSub = Notifications.addNotificationReceivedListener(() => {
      analytics.track(AnalyticsEvents.notificationReceived);
    });

    const responseSub = Notifications.addNotificationResponseReceivedListener(() => {
      analytics.track(AnalyticsEvents.notificationOpened);
    });

    return () => {
      receivedSub.remove();
      responseSub.remove();
    };
  }, []);

  return null;
}
