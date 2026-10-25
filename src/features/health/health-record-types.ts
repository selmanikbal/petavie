import type { HealthRecordInput } from '@/features/health/health-record-schemas';
import type { PetHealthRecord } from '@/types/database';

export type HealthRecordBackend = {
  list(petId: string): Promise<PetHealthRecord[]>;
  get(recordId: string): Promise<PetHealthRecord | null>;
  create(petId: string, ownerId: string, input: HealthRecordInput): Promise<PetHealthRecord>;
  update(recordId: string, ownerId: string, input: HealthRecordInput): Promise<PetHealthRecord>;
  remove(recordId: string, ownerId: string): Promise<void>;
};
