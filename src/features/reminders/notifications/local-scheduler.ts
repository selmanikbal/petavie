import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import {
  REMINDER_NOTIFICATION_CHANNEL_ID,
  REMINDER_NOTIFICATION_SOUND,
} from '@/features/reminders/notifications/constants';
import {
  generateOccurrences,
  parseNotificationIds,
} from '@/features/reminders/schedule-utils';
import type { Reminder } from '@/types/database';
import { fromISODate } from '@/utils/date';

let isConfigured = false;

export function configureLocalNotifications(): void {
  if (isConfigured) return;

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  isConfigured = true;
}

export async function ensureNotificationPermissions(): Promise<boolean> {
  if (Platform.OS === 'web') return false;

  configureLocalNotifications();

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(REMINDER_NOTIFICATION_CHANNEL_ID, {
      name: 'Hatırlatmalar',
      importance: Notifications.AndroidImportance.HIGH,
      sound: REMINDER_NOTIFICATION_SOUND,
    });
  }

  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;

  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted;
}

export async function scheduleLocalReminderNotifications(
  reminder: Pick<
    Reminder,
    | 'id'
    | 'title'
    | 'notes'
    | 'remind_at'
    | 'schedule_mode'
    | 'recurrence'
    | 'range_start'
    | 'range_end'
  >,
): Promise<string[]> {
  if (Platform.OS === 'web') return [];

  const granted = await ensureNotificationPermissions();
  if (!granted) return [];

  const remindAt = new Date(reminder.remind_at);
  if (Number.isNaN(remindAt.getTime())) return [];

  const remindTime = `${`${remindAt.getHours()}`.padStart(2, '0')}:${`${remindAt.getMinutes()}`.padStart(2, '0')}`;
  const rangeStart = fromISODate(reminder.range_start);
  if (!rangeStart) return [];

  const rangeEnd = reminder.range_end ? fromISODate(reminder.range_end) : null;
  const occurrences = generateOccurrences({
    scheduleMode: reminder.schedule_mode,
    recurrence: reminder.recurrence,
    rangeStart,
    rangeEnd,
    remindTime,
  });

  const ids: string[] = [];

  for (const date of occurrences) {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: reminder.title,
        body: reminder.notes ?? 'Hatırlatma zamanı geldi.',
        data: { reminderId: reminder.id },
        sound: REMINDER_NOTIFICATION_SOUND,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date,
      },
    });
    ids.push(id);
  }

  return ids;
}

export async function cancelLocalReminderNotification(
  notificationId: string | null | undefined,
): Promise<void> {
  if (!notificationId || Platform.OS === 'web') return;
  await Notifications.cancelScheduledNotificationAsync(notificationId);
}

export async function cancelReminderNotifications(
  reminder: Pick<Reminder, 'notification_id' | 'notification_ids'>,
): Promise<void> {
  const ids = new Set(parseNotificationIds(reminder.notification_ids));
  if (reminder.notification_id) ids.add(reminder.notification_id);

  await Promise.all([...ids].map((id) => cancelLocalReminderNotification(id)));
}
