import type { VaccinationInput } from '@/features/health/vaccination-schemas';
import type { PetVaccination } from '@/types/database';

export type VaccinationBackend = {
  list(petId: string): Promise<PetVaccination[]>;
  get(vaccinationId: string): Promise<PetVaccination | null>;
  create(petId: string, ownerId: string, input: VaccinationInput): Promise<PetVaccination>;
  update(vaccinationId: string, ownerId: string, input: VaccinationInput): Promise<PetVaccination>;
  remove(vaccinationId: string, ownerId: string): Promise<void>;
};
