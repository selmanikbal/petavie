import type { PetWeightInput } from '@/features/health/schemas';
import type { PetWeight } from '@/types/database';

export type PetWeightBackend = {
  list(petId: string): Promise<PetWeight[]>;
  create(petId: string, ownerId: string, input: PetWeightInput): Promise<PetWeight>;
  remove(weightId: string, ownerId: string): Promise<void>;
};
