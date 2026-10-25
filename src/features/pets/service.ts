import { localPetBackend } from '@/features/pets/backends/local';
import type { PetInput } from '@/features/pets/schemas';
import type { Pet } from '@/types/database';

const backend = localPetBackend;

export function listPets(ownerId: string): Promise<Pet[]> {
  return backend.list(ownerId);
}

export function getPet(petId: string): Promise<Pet | null> {
  return backend.get(petId);
}

export function createPet(ownerId: string, input: PetInput): Promise<Pet> {
  return backend.create(ownerId, input);
}

export function updatePet(petId: string, input: PetInput): Promise<Pet> {
  return backend.update(petId, input);
}

export function updatePetAvatar(
  petId: string,
  ownerId: string,
  localImageUri: string,
): Promise<Pet> {
  return backend.updateAvatar(petId, ownerId, localImageUri);
}

export function deletePet(petId: string): Promise<void> {
  return backend.remove(petId);
}
