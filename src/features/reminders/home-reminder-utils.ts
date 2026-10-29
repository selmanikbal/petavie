import { listReminderDatesInRange } from '@/features/reminders/calendar-utils';
import { isOccurrenceDone, isReminderActive } from '@/features/reminders/utils';
import type { Reminder } from '@/types/database';
import { fromISODate, toISODate } from '@/utils/date';

export type UpcomingReminderItem = {
  reminder: Reminder;
  occurrenceAt: Date;
  /** `YYYY-MM-DD` of this occurrence. */
  occurrenceDate: string;
};

function stripTime(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function combineDateAndRemindTime(isoDate: string, remindAt: string): Date | null {
  const date = fromISODate(isoDate);
  if (!date) return null;

  const time = new Date(remindAt);
  if (Number.isNaN(time.getTime())) return null;

  date.setHours(time.getHours(), time.getMinutes(), 0, 0);
  return date;
}

/** Occurrence ISO dates for a reminder inside an inclusive calendar window. */
function listOccurrenceDatesInWindow(
  reminder: Reminder,
  windowStart: Date,
  windowEnd: Date,
): string[] {
  const dates = listReminderDatesInRange(reminder, windowStart, windowEnd);
  if (dates.length > 0) return dates;

  // Fallback for legacy once rows where range_start may be missing or out of sync.
  if (reminder.schedule_mode !== 'once') return [];

  const remindAt = new Date(reminder.remind_at);
  if (Number.isNaN(remindAt.getTime())) return [];

  const day = stripTime(remindAt);
  if (day < windowStart || day > windowEnd) return [];

  return [toISODate(day)];
}

export function daysUntilOccurrence(from: Date, occurrence: Date): number {
  const start = stripTime(from);
  const target = stripTime(occurrence);
  return Math.round((target.getTime() - start.getTime()) / 86_400_000);
}

export function formatUpcomingDayLabel(daysUntil: number): string {
  if (daysUntil === 0) return 'Bugün';
  if (daysUntil === 1) return 'Yarın';
  return `${daysUntil} gün sonra`;
}

export function formatOccurrenceTime(date: Date): string {
  return `${`${date.getHours()}`.padStart(2, '0')}:${`${date.getMinutes()}`.padStart(2, '0')}`;
}

/** Active reminders with every occurrence within the next `dayCount` calendar days. */
export function getUpcomingReminders(
  reminders: Reminder[],
  dayCount: number,
  petId?: string | null,
): UpcomingReminderItem[] {
  const today = stripTime(new Date());
  const windowEnd = new Date(today);
  windowEnd.setDate(windowEnd.getDate() + dayCount - 1);

  const items: UpcomingReminderItem[] = [];

  for (const reminder of reminders) {
    if (!isReminderActive(reminder)) continue;
    if (petId && reminder.pet_id !== petId) continue;

    const dates = listOccurrenceDatesInWindow(reminder, today, windowEnd);

    for (const iso of dates) {
      if (isOccurrenceDone(reminder, iso)) continue;
      const occurrenceAt = combineDateAndRemindTime(iso, reminder.remind_at);
      if (!occurrenceAt) continue;
      items.push({ reminder, occurrenceAt, occurrenceDate: iso });
    }
  }

  return items.sort((a, b) => a.occurrenceAt.getTime() - b.occurrenceAt.getTime());
}
