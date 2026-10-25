import { syncLocalPetWeightCache } from '@/features/health/sync-pet-weight-cache';
import type { PetWeightBackend } from '@/features/health/types';
import {
  createId,
  readPetWeights,
  readPets,
  writePetWeights,
} from '@/services/demo/store';
import type { PetWeight } from '@/types/database';
import { toISODate } from '@/utils/date';
import { AppError } from '@/utils/errors';

function assertPetOwnedBy(petId: string, ownerId: string) {
  const pets = readPets();
  return pets.then((rows) => {
    const pet = rows.find((row) => row.id === petId);
    if (!pet || pet.owner_id !== ownerId) {
      throw new AppError('Bu dostunu bulamadık.');
    }
    return pet;
  });
}

export const localPetWeightBackend: PetWeightBackend = {
  async list(petId) {
    const weights = await readPetWeights();
    return weights
      .filter((row) => row.pet_id === petId)
      .sort((a, b) => {
        const byDate = b.recorded_at.localeCompare(a.recorded_at);
        if (byDate !== 0) return byDate;
        return b.created_at.localeCompare(a.created_at);
      });
  },

  async create(petId, ownerId, input) {
    await assertPetOwnedBy(petId, ownerId);

    const weights = await readPetWeights();
    const now = new Date().toISOString();

    const entry: PetWeight = {
      id: createId(),
      pet_id: petId,
      weight_kg: input.weightKg.toFixed(2),
      recorded_at: toISODate(input.recordedAt),
      note: input.note,
      created_at: now,
    };

    const next = [...weights, entry];
    await writePetWeights(next);
    await syncLocalPetWeightCache(petId, next.filter((row) => row.pet_id === petId));
    return entry;
  },

  async remove(weightId, ownerId) {
    const weights = await readPetWeights();
    const existing = weights.find((row) => row.id === weightId);
    if (!existing) throw new AppError('Bu kilo kaydını bulamadık.');

    await assertPetOwnedBy(existing.pet_id, ownerId);

    const next = weights.filter((row) => row.id !== weightId);
    await writePetWeights(next);
    await syncLocalPetWeightCache(
      existing.pet_id,
      next.filter((row) => row.pet_id === existing.pet_id),
    );
  },
};
