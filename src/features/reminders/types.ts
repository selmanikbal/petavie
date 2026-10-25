import type { ReminderInput } from '@/features/reminders/schemas';
import type { Reminder } from '@/types/database';

export type ReminderBackend = {
  list(ownerId: string): Promise<Reminder[]>;
  get(reminderId: string): Promise<Reminder | null>;
  create(ownerId: string, input: ReminderInput): Promise<Reminder>;
  update(reminderId: string, ownerId: string, input: ReminderInput): Promise<Reminder>;
  complete(reminderId: string, ownerId: string): Promise<Reminder>;
  remove(reminderId: string, ownerId: string): Promise<void>;
};
