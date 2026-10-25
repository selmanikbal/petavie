import { localHealthRecordBackend } from '@/features/health/backends/health-records-local';
import type { HealthRecordInput } from '@/features/health/health-record-schemas';
import type { PetHealthRecord } from '@/types/database';

const backend = localHealthRecordBackend;

export function listHealthRecords(petId: string): Promise<PetHealthRecord[]> {
  return backend.list(petId);
}

export function getHealthRecord(recordId: string): Promise<PetHealthRecord | null> {
  return backend.get(recordId);
}

export function createHealthRecord(
  petId: string,
  ownerId: string,
  input: HealthRecordInput,
): Promise<PetHealthRecord> {
  return backend.create(petId, ownerId, input);
}

export function updateHealthRecord(
  recordId: string,
  ownerId: string,
  input: HealthRecordInput,
): Promise<PetHealthRecord> {
  return backend.update(recordId, ownerId, input);
}

export function deleteHealthRecord(recordId: string, ownerId: string): Promise<void> {
  return backend.remove(recordId, ownerId);
}
