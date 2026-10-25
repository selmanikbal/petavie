import type { MedicationInput } from '@/features/health/medication-schemas';
import type { PetMedication } from '@/types/database';

export type MedicationBackend = {
  list(petId: string): Promise<PetMedication[]>;
  get(medicationId: string): Promise<PetMedication | null>;
  create(petId: string, ownerId: string, input: MedicationInput): Promise<PetMedication>;
  update(medicationId: string, ownerId: string, input: MedicationInput): Promise<PetMedication>;
  remove(medicationId: string, ownerId: string): Promise<void>;
};
