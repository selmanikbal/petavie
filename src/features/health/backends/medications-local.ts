import type { MedicationBackend } from '@/features/health/medication-types';
import {
  createId,
  readMedications,
  readPets,
  writeMedications,
} from '@/services/demo/store';
import type { PetMedication } from '@/types/database';
import { toISODate } from '@/utils/date';
import { AppError } from '@/utils/errors';

async function assertPetOwnedBy(petId: string, ownerId: string) {
  const pets = await readPets();
  const pet = pets.find((row) => row.id === petId);
  if (!pet || pet.owner_id !== ownerId) {
    throw new AppError('Bu dostunu bulamadık.');
  }
}

function toFields(input: Parameters<MedicationBackend['create']>[2]) {
  return {
    name: input.name,
    dosage: input.dosage,
    frequency: input.frequency,
    started_at: toISODate(input.startedAt),
    ended_at: input.endedAt ? toISODate(input.endedAt) : null,
    note: input.note,
  };
}

export const localMedicationBackend: MedicationBackend = {
  async list(petId) {
    const rows = await readMedications();
    return rows
      .filter((row) => row.pet_id === petId)
      .sort((a, b) => b.started_at.localeCompare(a.started_at));
  },

  async get(medicationId) {
    const rows = await readMedications();
    return rows.find((row) => row.id === medicationId) ?? null;
  },

  async create(petId, ownerId, input) {
    await assertPetOwnedBy(petId, ownerId);

    const rows = await readMedications();
    const now = new Date().toISOString();
    const record: PetMedication = {
      id: createId(),
      pet_id: petId,
      ...toFields(input),
      created_at: now,
      updated_at: now,
    };

    await writeMedications([...rows, record]);
    return record;
  },

  async update(medicationId, ownerId, input) {
    const rows = await readMedications();
    const existing = rows.find((row) => row.id === medicationId);
    if (!existing) throw new AppError('Bu ilaç kaydını bulamadık.');

    await assertPetOwnedBy(existing.pet_id, ownerId);

    const updated: PetMedication = {
      ...existing,
      ...toFields(input),
      updated_at: new Date().toISOString(),
    };

    await writeMedications(rows.map((row) => (row.id === medicationId ? updated : row)));
    return updated;
  },

  async remove(medicationId, ownerId) {
    const rows = await readMedications();
    const existing = rows.find((row) => row.id === medicationId);
    if (!existing) throw new AppError('Bu ilaç kaydını bulamadık.');

    await assertPetOwnedBy(existing.pet_id, ownerId);
    await writeMedications(rows.filter((row) => row.id !== medicationId));
  },
};
