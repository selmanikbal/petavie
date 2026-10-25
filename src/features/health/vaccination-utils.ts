import type { VaccinationFormValues } from '@/features/health/vaccination-schemas';
import type { PetVaccination } from '@/types/database';
import { coerceDate, fromISODate } from '@/utils/date';

export function toVaccinationFormValues(vaccination: PetVaccination): VaccinationFormValues {
  const administeredAt = fromISODate(vaccination.administered_at);
  const nextDueAt = vaccination.next_due_at ? fromISODate(vaccination.next_due_at) : null;

  return {
    name: vaccination.name,
    administeredAt: administeredAt ? coerceDate(administeredAt) : null,
    nextDueAt: nextDueAt ? coerceDate(nextDueAt) : null,
    clinicName: vaccination.clinic_name ?? '',
    note: vaccination.note ?? '',
  };
}
