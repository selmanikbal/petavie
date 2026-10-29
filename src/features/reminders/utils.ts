import type { ReminderFormValues } from '@/features/reminders/schemas';
import { formatReminderSchedule } from '@/features/reminders/schedule-utils';
import type { Reminder } from '@/types/database';
import { coerceDate, fromISODate } from '@/utils/date';

export function toReminderFormValues(reminder: Reminder): ReminderFormValues {
  const remindAt = new Date(reminder.remind_at);
  const hours = `${remindAt.getHours()}`.padStart(2, '0');
  const minutes = `${remindAt.getMinutes()}`.padStart(2, '0');
  const remindTime = `${hours}:${minutes}`;

  if (reminder.schedule_mode === 'recurring') {
    return {
      petId: reminder.pet_id,
      type: reminder.type,
      title: reminder.title,
      scheduleMode: 'recurring',
      remindDate: null,
      rangeStart: coerceDate(fromISODate(reminder.range_start) ?? remindAt),
      rangeEnd: reminder.range_end ? coerceDate(fromISODate(reminder.range_end)) : null,
      recurrence: reminder.recurrence,
      remindTime,
      notes: reminder.notes ?? '',
    };
  }

  return {
    petId: reminder.pet_id,
    type: reminder.type,
    title: reminder.title,
    scheduleMode: 'once',
    remindDate: coerceDate(fromISODate(reminder.range_start) ?? remindAt),
    rangeStart: null,
    rangeEnd: null,
    recurrence: null,
    remindTime,
    notes: reminder.notes ?? '',
  };
}

export function formatReminderDateTime(reminder: Reminder): string {
  return formatReminderSchedule(reminder);
}

export function isReminderActive(reminder: Reminder): boolean {
  return reminder.completed_at === null;
}

/** Dates (`YYYY-MM-DD`) of a recurring reminder that were already marked done. */
export function getCompletedOccurrences(reminder: Pick<Reminder, 'completed_occurrences'>): string[] {
  return Array.isArray(reminder.completed_occurrences) ? reminder.completed_occurrences : [];
}

/** Whether the occurrence on `isoDate` is done (or the whole reminder is). */
export function isOccurrenceDone(reminder: Reminder, isoDate: string): boolean {
  if (reminder.completed_at !== null) return true;
  return getCompletedOccurrences(reminder).includes(isoDate);
}

export function sortReminders(rows: Reminder[]): Reminder[] {
  return [...rows].sort((a, b) => {
    const aDone = a.completed_at !== null;
    const bDone = b.completed_at !== null;
    if (aDone !== bDone) return aDone ? 1 : -1;
    return a.remind_at.localeCompare(b.remind_at);
  });
}
