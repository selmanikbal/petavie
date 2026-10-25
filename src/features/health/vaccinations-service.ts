import { localVaccinationBackend } from '@/features/health/backends/vaccinations-local';
import type { VaccinationInput } from '@/features/health/vaccination-schemas';
import type { PetVaccination } from '@/types/database';

const backend = localVaccinationBackend;

export function listVaccinations(petId: string): Promise<PetVaccination[]> {
  return backend.list(petId);
}

export function getVaccination(vaccinationId: string): Promise<PetVaccination | null> {
  return backend.get(vaccinationId);
}

export function createVaccination(
  petId: string,
  ownerId: string,
  input: VaccinationInput,
): Promise<PetVaccination> {
  return backend.create(petId, ownerId, input);
}

export function updateVaccination(
  vaccinationId: string,
  ownerId: string,
  input: VaccinationInput,
): Promise<PetVaccination> {
  return backend.update(vaccinationId, ownerId, input);
}

export function deleteVaccination(vaccinationId: string, ownerId: string): Promise<void> {
  return backend.remove(vaccinationId, ownerId);
}
