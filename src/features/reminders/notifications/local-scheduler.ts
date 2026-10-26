import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import {
  REMINDER_NOTIFICATION_CHANNEL_ID,
  REMINDER_NOTIFICATION_SOUND,
} from '@/features/reminders/notifications/constants';
import {
  generateOccurrences,
  parseNotificationIds,
  serializeNotificationIds,
} from '@/features/reminders/schedule-utils';
import { readReminders, writeReminders } from '@/services/demo/store';
import type { Reminder } from '@/types/database';
import { fromISODate } from '@/utils/date';

/**
 * iOS keeps at most 64 pending local notifications per app and silently drops
 * the rest. We schedule only the soonest occurrences across ALL reminders and
 * top the window up on every app launch and every reminder change.
 */
export const MAX_PENDING_NOTIFICATIONS = 60;

let isConfigured = false;
let channelReady: Promise<void> | null = null;
let syncChain: Promise<void> = Promise.resolve();

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

/** Android: the channel decides the sound, so it must exist before scheduling. */
export function ensureReminderChannel(): Promise<void> {
  if (Platform.OS !== 'android') return Promise.resolve();

  channelReady ??= Notifications.setNotificationChannelAsync(REMINDER_NOTIFICATION_CHANNEL_ID, {
    name: 'Hatırlatmalar',
    importance: Notifications.AndroidImportance.HIGH,
    sound: REMINDER_NOTIFICATION_SOUND,
  })
    .then(() => undefined)
    .catch((error: unknown) => {
      channelReady = null;
      throw error;
    });

  return channelReady;
}

export async function ensureNotificationPermissions(
  options: { request?: boolean } = {},
): Promise<boolean> {
  if (Platform.OS === 'web') return false;

  configureLocalNotifications();
  await ensureReminderChannel();

  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  if (options.request === false) return false;

  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted;
}

function toRemindTime(remindAtIso: string): string | null {
  const remindAt = new Date(remindAtIso);
  if (Number.isNaN(remindAt.getTime())) return null;
  return `${`${remindAt.getHours()}`.padStart(2, '0')}:${`${remindAt.getMinutes()}`.padStart(2, '0')}`;
}

function upcomingOccurrences(reminder: Reminder): Date[] {
  if (reminder.completed_at) return [];

  const remindTime = toRemindTime(reminder.remind_at);
  const rangeStart = fromISODate(reminder.range_start);
  if (!remindTime || !rangeStart) return [];

  const rangeEnd = reminder.range_end ? fromISODate(reminder.range_end) : null;
  return generateOccurrences({
    scheduleMode: reminder.schedule_mode,
    recurrence: reminder.recurrence,
    rangeStart,
    rangeEnd,
    remindTime,
  });
}

async function runSync(requestPermission: boolean): Promise<void> {
  if (Platform.OS === 'web') return;

  const reminders = await readReminders();
  const active = reminders.filter((row) => !row.completed_at);

  // All pending notifications in this app belong to reminders, so start clean.
  await Notifications.cancelAllScheduledNotificationsAsync();

  const granted =
    active.length > 0 && (await ensureNotificationPermissions({ request: requestPermission }));

  const idsByReminder = new Map<string, string[]>();

  if (granted) {
    const queue = active
      .flatMap((reminder) => upcomingOccurrences(reminder).map((date) => ({ reminder, date })))
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, MAX_PENDING_NOTIFICATIONS);

    for (const { reminder, date } of queue) {
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
          channelId: REMINDER_NOTIFICATION_CHANNEL_ID,
        },
      });
      idsByReminder.set(reminder.id, [...(idsByReminder.get(reminder.id) ?? []), id]);
    }
  }

  // Re-read so we never overwrite a change made while scheduling.
  const latest = await readReminders();
  let changed = false;
  const next = latest.map((row) => {
    const notificationIds = serializeNotificationIds(idsByReminder.get(row.id) ?? []);
    if (row.notification_ids === notificationIds && row.notification_id === null) return row;
    changed = true;
    return { ...row, notification_ids: notificationIds, notification_id: null };
  });
  if (changed) await writeReminders(next);
}

/**
 * Rebuilds the pending notification window from stored reminders.
 * Calls are serialized so concurrent changes cannot double-schedule.
 */
export function syncReminderNotifications(
  options: { requestPermission?: boolean } = {},
): Promise<void> {
  const run = syncChain.then(() => runSync(options.requestPermission ?? true));
  syncChain = run.catch(() => undefined);
  return run;
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
