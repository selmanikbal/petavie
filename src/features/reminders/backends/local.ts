import { syncReminderNotifications } from '@/features/reminders/notifications/local-scheduler';
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

/** Reschedules the notification window, then returns the stored row. */
async function syncAndReload(record: Reminder): Promise<Reminder> {
  try {
    await syncReminderNotifications({ requestPermission: true });
  } catch {
    // Saving the reminder must not fail because notifications could not be scheduled.
    return record;
  }
  const rows = await readReminders();
  return rows.find((row) => row.id === record.id) ?? record;
}

async function syncQuietly(): Promise<void> {
  try {
    await syncReminderNotifications({ requestPermission: false });
  } catch {
    // Ignore — the window is rebuilt again on next app launch.
  }
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
    return syncAndReload(record);
  },

  async update(reminderId, ownerId, input) {
    const rows = await readReminders();
    const existing = rows.find((row) => row.id === reminderId);
    if (!existing) throw new AppError('Bu hatırlatmayı bulamadık.');
    if (existing.owner_id !== ownerId) throw new AppError('Bu hatırlatmayı düzenleme yetkin yok.');
    if (existing.completed_at) throw new AppError('Tamamlanan hatırlatma düzenlenemez.');

    await assertPetOwnedBy(input.petId, ownerId);

    const updated: Reminder = {
      ...existing,
      ...toFields(input),
      notification_id: null,
      notification_ids: null,
      updated_at: new Date().toISOString(),
    };

    await writeReminders(rows.map((row) => (row.id === reminderId ? updated : row)));
    return syncAndReload(updated);
  },

  async complete(reminderId, ownerId) {
    const rows = await readReminders();
    const existing = rows.find((row) => row.id === reminderId);
    if (!existing) throw new AppError('Bu hatırlatmayı bulamadık.');
    if (existing.owner_id !== ownerId) throw new AppError('Bu hatırlatmayı tamamlama yetkin yok.');

    const updated: Reminder = {
      ...existing,
      completed_at: new Date().toISOString(),
      notification_id: null,
      notification_ids: null,
      updated_at: new Date().toISOString(),
    };

    await writeReminders(rows.map((row) => (row.id === reminderId ? updated : row)));
    await syncQuietly();
    return updated;
  },

  async remove(reminderId, ownerId) {
    const rows = await readReminders();
    const existing = rows.find((row) => row.id === reminderId);
    if (!existing) throw new AppError('Bu hatırlatmayı bulamadık.');
    if (existing.owner_id !== ownerId) throw new AppError('Bu hatırlatmayı silme yetkin yok.');

    await writeReminders(rows.filter((row) => row.id !== reminderId));
    await syncQuietly();
  },
};
