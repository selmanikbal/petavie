import { pickLatestPetWeight } from '@/features/health/utils';
import { readPets, readPetWeights, writePets } from '@/services/demo/store';
import type { PetWeight } from '@/types/database';

/** Keeps `pets.weight_kg` aligned with the newest history row in demo mode. */
export async function syncLocalPetWeightCache(petId: string, weights?: PetWeight[]): Promise<void> {
  const pets = await readPets();
  const existing = pets.find((pet) => pet.id === petId);
  if (!existing) return;

  const rows = weights ?? (await readPetWeights()).filter((row) => row.pet_id === petId);
  const latest = pickLatestPetWeight(rows);

  const updated = {
    ...existing,
    weight_kg: latest ? latest.weight_kg : null,
    updated_at: new Date().toISOString(),
  };

  await writePets(pets.map((pet) => (pet.id === petId ? updated : pet)));
}
