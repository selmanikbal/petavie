import type { Reminder, ReminderRecurrence } from '@/types/database';
import { fromISODate, toISODate } from '@/utils/date';

export type CalendarCell = {
  iso: string;
  day: number;
  inMonth: boolean;
  isToday: boolean;
};

function stripTime(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function advanceDate(date: Date, recurrence: ReminderRecurrence): void {
  if (recurrence === 'daily') {
    date.setDate(date.getDate() + 1);
    return;
  }

  if (recurrence === 'weekly') {
    date.setDate(date.getDate() + 7);
    return;
  }

  date.setMonth(date.getMonth() + 1);
}

/** Lists ISO dates a reminder falls on within an inclusive view range. */
export function listReminderDatesInRange(
  reminder: Pick<
    Reminder,
    'schedule_mode' | 'recurrence' | 'range_start' | 'range_end' | 'remind_at'
  >,
  viewStart: Date,
  viewEnd: Date,
): string[] {
  const start = stripTime(viewStart);
  const end = stripTime(viewEnd);

  if (reminder.schedule_mode === 'once') {
    const iso = reminder.range_start;
    const date = fromISODate(iso);
    if (!date) return [];
    const day = stripTime(date);
    return day >= start && day <= end ? [iso] : [];
  }

  const seriesStart = fromISODate(reminder.range_start);
  const seriesEnd = reminder.range_end ? fromISODate(reminder.range_end) : null;
  if (!seriesStart || !seriesEnd || !reminder.recurrence) return [];

  const dates: string[] = [];
  const last = stripTime(seriesEnd) < end ? stripTime(seriesEnd) : end;
  let current = stripTime(seriesStart);

  while (current < start && current <= seriesEnd) {
    advanceDate(current, reminder.recurrence);
  }

  while (current <= last && current <= seriesEnd && dates.length < 100) {
    if (current >= start) {
      dates.push(toISODate(current));
    }
    advanceDate(current, reminder.recurrence);
  }

  return dates;
}

export function reminderOccursOnDate(reminder: Reminder, isoDate: string): boolean {
  const date = fromISODate(isoDate);
  if (!date) return false;
  return listReminderDatesInRange(reminder, date, date).includes(isoDate);
}

export function buildReminderDateIndex(
  reminders: Reminder[],
  viewStart: Date,
  viewEnd: Date,
): Map<string, Reminder[]> {
  const index = new Map<string, Reminder[]>();

  for (const reminder of reminders) {
    for (const iso of listReminderDatesInRange(reminder, viewStart, viewEnd)) {
      const existing = index.get(iso) ?? [];
      existing.push(reminder);
      index.set(iso, existing);
    }
  }

  return index;
}

export function buildCalendarGrid(year: number, month: number): CalendarCell[] {
  const first = new Date(year, month, 1);
  const todayIso = toISODate(new Date());
  const mondayOffset = (first.getDay() + 6) % 7;
  const gridStart = new Date(year, month, 1 - mondayOffset);
  const cells: CalendarCell[] = [];

  for (let index = 0; index < 42; index += 1) {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + index);
    const iso = toISODate(date);

    cells.push({
      iso,
      day: date.getDate(),
      inMonth: date.getMonth() === month,
      isToday: iso === todayIso,
    });
  }

  return cells;
}

export function getMonthBounds(year: number, month: number): { start: Date; end: Date } {
  return {
    start: new Date(year, month, 1),
    end: new Date(year, month + 1, 0),
  };
}
