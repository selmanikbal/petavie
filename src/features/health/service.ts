import { localPetWeightBackend } from '@/features/health/backends/local';
import type { PetWeightInput } from '@/features/health/schemas';
import type { PetWeight } from '@/types/database';

const backend = localPetWeightBackend;

export function listPetWeights(petId: string): Promise<PetWeight[]> {
  return backend.list(petId);
}

export function createPetWeight(
  petId: string,
  ownerId: string,
  input: PetWeightInput,
): Promise<PetWeight> {
  return backend.create(petId, ownerId, input);
}

export function deletePetWeight(weightId: string, ownerId: string): Promise<void> {
  return backend.remove(weightId, ownerId);
}
