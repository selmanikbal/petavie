import type { PetWeight } from '@/types/database';

/** Latest measurement wins; ties break on newest `created_at`. */
export function pickLatestPetWeight(weights: PetWeight[]): PetWeight | null {
  if (weights.length === 0) return null;

  return [...weights].sort((a, b) => {
    const byDate = b.recorded_at.localeCompare(a.recorded_at);
    if (byDate !== 0) return byDate;
    return b.created_at.localeCompare(a.created_at);
  })[0];
}

/** Stored weight string, e.g. `4.50` -> `4,5 kg`. */
export function formatWeightKg(weightKg: string | number): string {
  const value = typeof weightKg === 'number' ? weightKg : Number(weightKg);
  if (!Number.isFinite(value)) return '—';
  return `${String(value).replace('.', ',')} kg`;
}
