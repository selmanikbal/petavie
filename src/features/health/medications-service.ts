import { localMedicationBackend } from '@/features/health/backends/medications-local';
import type { MedicationInput } from '@/features/health/medication-schemas';
import type { PetMedication } from '@/types/database';

const backend = localMedicationBackend;

export function listMedications(petId: string): Promise<PetMedication[]> {
  return backend.list(petId);
}

export function getMedication(medicationId: string): Promise<PetMedication | null> {
  return backend.get(medicationId);
}

export function createMedication(
  petId: string,
  ownerId: string,
  input: MedicationInput,
): Promise<PetMedication> {
  return backend.create(petId, ownerId, input);
}

export function updateMedication(
  medicationId: string,
  ownerId: string,
  input: MedicationInput,
): Promise<PetMedication> {
  return backend.update(medicationId, ownerId, input);
}

export function deleteMedication(medicationId: string, ownerId: string): Promise<void> {
  return backend.remove(medicationId, ownerId);
}
