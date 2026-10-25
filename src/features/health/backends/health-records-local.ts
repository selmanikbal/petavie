import type { HealthRecordBackend } from '@/features/health/health-record-types';
import {
  createId,
  readHealthRecords,
  readPets,
  writeHealthRecords,
} from '@/services/demo/store';
import type { PetHealthRecord } from '@/types/database';
import { toISODate } from '@/utils/date';
import { AppError } from '@/utils/errors';

async function assertPetOwnedBy(petId: string, ownerId: string) {
  const pets = await readPets();
  const pet = pets.find((row) => row.id === petId);
  if (!pet || pet.owner_id !== ownerId) {
    throw new AppError('Bu dostunu bulamadık.');
  }
  return pet;
}

function toFields(input: Parameters<HealthRecordBackend['create']>[2]) {
  return {
    title: input.title,
    visited_at: toISODate(input.visitedAt),
    description: input.description,
    clinic_name: input.clinicName,
  };
}

export const localHealthRecordBackend: HealthRecordBackend = {
  async list(petId) {
    const records = await readHealthRecords();
    return records
      .filter((row) => row.pet_id === petId)
      .sort((a, b) => b.visited_at.localeCompare(a.visited_at));
  },

  async get(recordId) {
    const records = await readHealthRecords();
    return records.find((row) => row.id === recordId) ?? null;
  },

  async create(petId, ownerId, input) {
    await assertPetOwnedBy(petId, ownerId);

    const records = await readHealthRecords();
    const now = new Date().toISOString();

    const record: PetHealthRecord = {
      id: createId(),
      pet_id: petId,
      ...toFields(input),
      created_at: now,
      updated_at: now,
    };

    await writeHealthRecords([...records, record]);
    return record;
  },

  async update(recordId, ownerId, input) {
    const records = await readHealthRecords();
    const existing = records.find((row) => row.id === recordId);
    if (!existing) throw new AppError('Bu sağlık kaydını bulamadık.');

    await assertPetOwnedBy(existing.pet_id, ownerId);

    const updated: PetHealthRecord = {
      ...existing,
      ...toFields(input),
      updated_at: new Date().toISOString(),
    };

    await writeHealthRecords(records.map((row) => (row.id === recordId ? updated : row)));
    return updated;
  },

  async remove(recordId, ownerId) {
    const records = await readHealthRecords();
    const existing = records.find((row) => row.id === recordId);
    if (!existing) throw new AppError('Bu sağlık kaydını bulamadık.');

    await assertPetOwnedBy(existing.pet_id, ownerId);
    await writeHealthRecords(records.filter((row) => row.id !== recordId));
  },
};
