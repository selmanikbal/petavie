import type { ReminderInput } from '@/features/reminders/schemas';
import type { Reminder } from '@/types/database';

export type ReminderBackend = {
  list(ownerId: string): Promise<Reminder[]>;
  get(reminderId: string): Promise<Reminder | null>;
  create(ownerId: string, input: ReminderInput): Promise<Reminder>;
  update(reminderId: string, ownerId: string, input: ReminderInput): Promise<Reminder>;
  complete(reminderId: string, ownerId: string): Promise<Reminder>;
  /** Marks one occurrence done; a one-off reminder (or a series' last occurrence) completes it. */
  completeOccurrence(reminderId: string, ownerId: string, occurrenceDate: string): Promise<Reminder>;
  remove(reminderId: string, ownerId: string): Promise<void>;
};
