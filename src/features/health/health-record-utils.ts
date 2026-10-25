import type { HealthRecordFormValues } from '@/features/health/health-record-schemas';
import type { PetHealthRecord } from '@/types/database';
import { coerceDate, fromISODate } from '@/utils/date';

export function toHealthRecordFormValues(record: PetHealthRecord): HealthRecordFormValues {
  const visitedAt = fromISODate(record.visited_at);

  return {
    title: record.title,
    visitedAt: visitedAt ? coerceDate(visitedAt) : null,
    description: record.description,
    clinicName: record.clinic_name ?? '',
  };
}
