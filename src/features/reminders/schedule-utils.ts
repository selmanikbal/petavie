import type { ReminderRecurrence, ReminderScheduleMode } from '@/types/database';
import { formatDateTR, fromISODate, toISODate } from '@/utils/date';

export const MAX_SCHEDULED_OCCURRENCES = 60;

export const RECURRENCE_LABELS: Record<ReminderRecurrence, string> = {
  daily: 'Her gün',
  weekly: 'Her hafta',
  monthly: 'Her ay',
};

export function parseNotificationIds(raw: string | null | undefined): string[] {
  if (!raw) return [];

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((value): value is string => typeof value === 'string');
  } catch {
    return [];
  }
}

export function serializeNotificationIds(ids: string[]): string | null {
  return ids.length > 0 ? JSON.stringify(ids) : null;
}

export function combineDateAndTime(date: Date, time: string): Date {
  const [hours, minutes] = time.split(':').map(Number);
  const combined = new Date(date);
  combined.setHours(hours, minutes, 0, 0);
  return combined;
}

/** Builds future reminder instants inside the selected range. */
export function generateOccurrences(input: {
  scheduleMode: ReminderScheduleMode;
  recurrence: ReminderRecurrence | null;
  rangeStart: Date;
  rangeEnd: Date | null;
  remindTime: string;
}): Date[] {
  const [hours, minutes] = input.remindTime.split(':').map(Number);
  const start = new Date(input.rangeStart);
  start.setHours(hours, minutes, 0, 0);

  if (input.scheduleMode === 'once') {
    return start.getTime() > Date.now() ? [start] : [];
  }

  if (!input.recurrence || !input.rangeEnd) return [];

  const end = new Date(input.rangeEnd);
  end.setHours(23, 59, 59, 999);

  const occurrences: Date[] = [];
  let current = new Date(start);

  while (current.getTime() <= end.getTime() && occurrences.length < MAX_SCHEDULED_OCCURRENCES) {
    if (current.getTime() > Date.now()) {
      occurrences.push(new Date(current));
    }

    if (input.recurrence === 'daily') {
      current.setDate(current.getDate() + 1);
    } else if (input.recurrence === 'weekly') {
      current.setDate(current.getDate() + 7);
    } else {
      current.setMonth(current.getMonth() + 1);
    }
  }

  return occurrences;
}

export function formatReminderSchedule(reminder: {
  schedule_mode: ReminderScheduleMode;
  recurrence: ReminderRecurrence | null;
  range_start: string;
  range_end: string | null;
  remind_at: string;
}): string {
  const remindAt = new Date(reminder.remind_at);
  const time = Number.isNaN(remindAt.getTime())
    ? ''
    : `${`${remindAt.getHours()}`.padStart(2, '0')}:${`${remindAt.getMinutes()}`.padStart(2, '0')}`;

  if (reminder.schedule_mode === 'once') {
    const day = fromISODate(reminder.range_start);
    return day ? `${formatDateTR(day)} · ${time}` : `${reminder.range_start} · ${time}`;
  }

  const start = fromISODate(reminder.range_start);
  const end = reminder.range_end ? fromISODate(reminder.range_end) : null;
  const recurrence = reminder.recurrence ? RECURRENCE_LABELS[reminder.recurrence] : 'Tekrarlayan';

  if (start && end) {
    return `${recurrence} · ${formatDateTR(start)} – ${formatDateTR(end)} · ${time}`;
  }

  return `${recurrence} · ${time}`;
}

export function toRangeDate(value: Date): string {
  return toISODate(value);
}
