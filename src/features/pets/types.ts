import type { PetInput } from '@/features/pets/schemas';
import type { Pet } from '@/types/database';

/** Contract for the on-device pet storage layer. */
export type PetBackend = {
  list(ownerId: string): Promise<Pet[]>;
  get(petId: string): Promise<Pet | null>;
  create(ownerId: string, input: PetInput): Promise<Pet>;
  update(petId: string, input: PetInput): Promise<Pet>;
  updateAvatar(petId: string, ownerId: string, localImageUri: string): Promise<Pet>;
  remove(petId: string): Promise<void>;
};
