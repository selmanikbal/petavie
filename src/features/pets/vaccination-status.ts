import type { PetVaccination } from '@/types/database';
import { formatDateTR, fromISODate } from '@/utils/date';

export type VaccinationStatus = {
  tone: 'success' | 'danger';
  label: string;
};

export function getVaccinationStatus(vaccinations: PetVaccination[]): VaccinationStatus | null {
  if (vaccinations.length === 0) return null;

  const now = Date.now();
  const withDue = vaccinations
    .filter((row) => row.next_due_at)
    .map((row) => ({
      row,
      due: fromISODate(row.next_due_at as string),
    }))
    .filter((entry): entry is { row: PetVaccination; due: Date } => entry.due !== null)
    .sort((a, b) => a.due.getTime() - b.due.getTime());

  const overdue = withDue.find((entry) => entry.due.getTime() < now);
  if (overdue) {
    return { tone: 'danger', label: `Geciken aşı: ${overdue.row.name}` };
  }

  const upcoming = withDue.find((entry) => entry.due.getTime() >= now);
  if (upcoming) {
    const days = Math.ceil((upcoming.due.getTime() - now) / 86_400_000);
    if (days <= 14) {
      return { tone: 'danger', label: `Yaklaşan Aşı: ${days} gün sonra` };
    }
  }

  return { tone: 'success', label: 'Aşıları Güncel' };
}

export function getLastVaccinationLabel(vaccinations: PetVaccination[]): string | null {
  if (vaccinations.length === 0) return null;

  const latest = [...vaccinations].sort((a, b) =>
    b.administered_at.localeCompare(a.administered_at),
  )[0];
  const date = fromISODate(latest.administered_at);
  if (!date) return null;

  return `Son aşı: ${formatDateTR(date)} (${latest.name})`;
}
