import { localReminderBackend } from '@/features/reminders/backends/local';
import type { ReminderInput } from '@/features/reminders/schemas';
import type { Reminder } from '@/types/database';

const reminderBackend = localReminderBackend;

export function listReminders(ownerId: string): Promise<Reminder[]> {
  return reminderBackend.list(ownerId);
}

export function getReminder(reminderId: string): Promise<Reminder | null> {
  return reminderBackend.get(reminderId);
}

export function createReminder(ownerId: string, input: ReminderInput): Promise<Reminder> {
  return reminderBackend.create(ownerId, input);
}

export function updateReminder(
  reminderId: string,
  ownerId: string,
  input: ReminderInput,
): Promise<Reminder> {
  return reminderBackend.update(reminderId, ownerId, input);
}

export function completeReminder(reminderId: string, ownerId: string): Promise<Reminder> {
  return reminderBackend.complete(reminderId, ownerId);
}

export function completeReminderOccurrence(
  reminderId: string,
  ownerId: string,
  occurrenceDate: string,
): Promise<Reminder> {
  return reminderBackend.completeOccurrence(reminderId, ownerId, occurrenceDate);
}

export function deleteReminder(reminderId: string, ownerId: string): Promise<void> {
  return reminderBackend.remove(reminderId, ownerId);
}
