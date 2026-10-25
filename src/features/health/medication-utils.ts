import type { MedicationFormValues } from '@/features/health/medication-schemas';
import type { PetMedication } from '@/types/database';
import { coerceDate, fromISODate } from '@/utils/date';

export function toMedicationFormValues(medication: PetMedication): MedicationFormValues {
  const startedAt = fromISODate(medication.started_at);
  const endedAt = medication.ended_at ? fromISODate(medication.ended_at) : null;

  return {
    name: medication.name,
    dosage: medication.dosage,
    frequency: medication.frequency,
    startedAt: startedAt ? coerceDate(startedAt) : null,
    endedAt: endedAt ? coerceDate(endedAt) : null,
    note: medication.note ?? '',
  };
}

export function isMedicationActive(medication: PetMedication): boolean {
  if (!medication.ended_at) return true;
  const endedAt = fromISODate(medication.ended_at);
  if (!endedAt) return true;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return endedAt >= today;
}
