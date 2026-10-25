import type { VaccinationBackend } from '@/features/health/vaccination-types';
import {
  createId,
  readPets,
  readVaccinations,
  writeVaccinations,
} from '@/services/demo/store';
import type { PetVaccination } from '@/types/database';
import { toISODate } from '@/utils/date';
import { AppError } from '@/utils/errors';

async function assertPetOwnedBy(petId: string, ownerId: string) {
  const pets = await readPets();
  const pet = pets.find((row) => row.id === petId);
  if (!pet || pet.owner_id !== ownerId) {
    throw new AppError('Bu dostunu bulamadık.');
  }
}

function toFields(input: Parameters<VaccinationBackend['create']>[2]) {
  return {
    name: input.name,
    administered_at: toISODate(input.administeredAt),
    next_due_at: input.nextDueAt ? toISODate(input.nextDueAt) : null,
    clinic_name: input.clinicName,
    note: input.note,
  };
}

export const localVaccinationBackend: VaccinationBackend = {
  async list(petId) {
    const rows = await readVaccinations();
    return rows
      .filter((row) => row.pet_id === petId)
      .sort((a, b) => b.administered_at.localeCompare(a.administered_at));
  },

  async get(vaccinationId) {
    const rows = await readVaccinations();
    return rows.find((row) => row.id === vaccinationId) ?? null;
  },

  async create(petId, ownerId, input) {
    await assertPetOwnedBy(petId, ownerId);

    const rows = await readVaccinations();
    const now = new Date().toISOString();
    const record: PetVaccination = {
      id: createId(),
      pet_id: petId,
      ...toFields(input),
      created_at: now,
      updated_at: now,
    };

    await writeVaccinations([...rows, record]);
    return record;
  },

  async update(vaccinationId, ownerId, input) {
    const rows = await readVaccinations();
    const existing = rows.find((row) => row.id === vaccinationId);
    if (!existing) throw new AppError('Bu aşı kaydını bulamadık.');

    await assertPetOwnedBy(existing.pet_id, ownerId);

    const updated: PetVaccination = {
      ...existing,
      ...toFields(input),
      updated_at: new Date().toISOString(),
    };

    await writeVaccinations(rows.map((row) => (row.id === vaccinationId ? updated : row)));
    return updated;
  },

  async remove(vaccinationId, ownerId) {
    const rows = await readVaccinations();
    const existing = rows.find((row) => row.id === vaccinationId);
    if (!existing) throw new AppError('Bu aşı kaydını bulamadık.');

    await assertPetOwnedBy(existing.pet_id, ownerId);
    await writeVaccinations(rows.filter((row) => row.id !== vaccinationId));
  },
};
