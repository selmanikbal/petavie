import {
  cancelReminderNotifications,
  scheduleLocalReminderNotifications,
} from '@/features/reminders/notifications/local-scheduler';
import { serializeNotificationIds } from '@/features/reminders/schedule-utils';
import type { ReminderInput } from '@/features/reminders/schemas';
import type { ReminderBackend } from '@/features/reminders/types';
import {
  createId,
  readPets,
  readReminders,
  writeReminders,
} from '@/services/demo/store';
import type { Reminder } from '@/types/database';
import { AppError } from '@/utils/errors';

async function assertPetOwnedBy(petId: string, ownerId: string) {
  const pets = await readPets();
  const pet = pets.find((row) => row.id === petId);
  if (!pet || pet.owner_id !== ownerId) {
    throw new AppError('Bu dostunu bulamadık.');
  }
}

function toFields(input: ReminderInput) {
  return {
    pet_id: input.petId,
    type: input.type,
    title: input.title,
    notes: input.notes,
    remind_at: input.remindAt.toISOString(),
    schedule_mode: input.scheduleMode,
    recurrence: input.recurrence,
    range_start: input.rangeStart,
    range_end: input.rangeEnd,
  };
}

async function attachNotification(record: Reminder): Promise<Reminder> {
  const notificationIds = await scheduleLocalReminderNotifications(record);
  if (notificationIds.length === 0) return record;

  const rows = await readReminders();
  const updated: Reminder = {
    ...record,
    notification_ids: serializeNotificationIds(notificationIds),
    notification_id: null,
  };
  await writeReminders(rows.map((row) => (row.id === record.id ? updated : row)));
  return updated;
}

export const localReminderBackend: ReminderBackend = {
  async list(ownerId) {
    const rows = await readReminders();
    return rows.filter((row) => row.owner_id === ownerId);
  },

  async get(reminderId) {
    const rows = await readReminders();
    return rows.find((row) => row.id === reminderId) ?? null;
  },

  async create(ownerId, input) {
    await assertPetOwnedBy(input.petId, ownerId);

    const rows = await readReminders();
    const now = new Date().toISOString();
    const record: Reminder = {
      id: createId(),
      owner_id: ownerId,
      ...toFields(input),
      completed_at: null,
      notification_id: null,
      notification_ids: null,
      created_at: now,
      updated_at: now,
    };

    await writeReminders([...rows, record]);
    return attachNotification(record);
  },

  async update(reminderId, ownerId, input) {
    const rows = await readReminders();
    const existing = rows.find((row) => row.id === reminderId);
    if (!existing) throw new AppError('Bu hatırlatmayı bulamadık.');
    if (existing.owner_id !== ownerId) throw new AppError('Bu hatırlatmayı düzenleme yetkin yok.');
    if (existing.completed_at) throw new AppError('Tamamlanan hatırlatma düzenlenemez.');

    await assertPetOwnedBy(input.petId, ownerId);
    await cancelReminderNotifications(existing);

    const updated: Reminder = {
      ...existing,
      ...toFields(input),
      notification_id: null,
      notification_ids: null,
      updated_at: new Date().toISOString(),
    };

    await writeReminders(rows.map((row) => (row.id === reminderId ? updated : row)));
    return attachNotification(updated);
  },

  async complete(reminderId, ownerId) {
    const rows = await readReminders();
    const existing = rows.find((row) => row.id === reminderId);
    if (!existing) throw new AppError('Bu hatırlatmayı bulamadık.');
    if (existing.owner_id !== ownerId) throw new AppError('Bu hatırlatmayı tamamlama yetkin yok.');

    await cancelReminderNotifications(existing);

    const updated: Reminder = {
      ...existing,
      completed_at: new Date().toISOString(),
      notification_id: null,
      notification_ids: null,
      updated_at: new Date().toISOString(),
    };

    await writeReminders(rows.map((row) => (row.id === reminderId ? updated : row)));
    return updated;
  },

  async remove(reminderId, ownerId) {
    const rows = await readReminders();
    const existing = rows.find((row) => row.id === reminderId);
    if (!existing) throw new AppError('Bu hatırlatmayı bulamadık.');
    if (existing.owner_id !== ownerId) throw new AppError('Bu hatırlatmayı silme yetkin yok.');

    await cancelReminderNotifications(existing);
    await writeReminders(rows.filter((row) => row.id !== reminderId));
  },
};
