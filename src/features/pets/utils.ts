import { SPECIES_LABELS, type PetFormValues } from '@/features/pets/schemas';
import type { Pet } from '@/types/database';
import { coerceDate, fromISODate } from '@/utils/date';

/** Detailed age label for cards, e.g. `2 Yaş 4 Ay`, `7 Aylık`. */
export function formatPetAgeDetailed(birthDate: string): string | null {
  const born = fromISODate(birthDate);
  if (!born) return null;

  const now = new Date();
  let months =
    (now.getFullYear() - born.getFullYear()) * 12 + (now.getMonth() - born.getMonth());
  if (now.getDate() < born.getDate()) months -= 1;
  if (months < 0) return null;

  if (months < 12) return `${months} Aylık`;

  const years = Math.floor(months / 12);
  const remainder = months % 12;
  if (remainder === 0) return `${years} Yaş`;
  return `${years} Yaş ${remainder} Ay`;
}

/** Compact age label for cards, e.g. `3 yaş`, `5 ay`. */
export function formatPetAgeShort(birthDate: string): string | null {
  const label = formatPetAge(birthDate);
  if (!label) return null;
  return label.replace(' yaşında', ' yaş').replace(' aylık', ' ay').replace(' günlük', ' gün');
}

/** `2 aylık`, `3 yaşında` — whichever unit reads naturally at that age. */
export function formatPetAge(birthDate: string): string | null {
  const born = fromISODate(birthDate);
  if (!born) return null;

  const now = new Date();
  let months = (now.getFullYear() - born.getFullYear()) * 12 + (now.getMonth() - born.getMonth());
  // The current month has not completed yet if the day has not come round.
  if (now.getDate() < born.getDate()) months -= 1;
  if (months < 0) return null;

  if (months < 1) {
    const days = Math.max(0, Math.floor((now.getTime() - born.getTime()) / 86_400_000));
    return `${days} günlük`;
  }
  if (months < 12) return `${months} aylık`;
  return `${Math.floor(months / 12)} yaşında`;
}

/** Stored weight string, e.g. `4.50` -> `4,5 kg`. */
export function formatPetWeight(weightKg: string | null): string | null {
  if (weightKg === null) return null;

  const value = Number(weightKg);
  if (!Number.isFinite(value)) return null;

  return `${String(value).replace('.', ',')} kg`;
}

/** `Kedi · 3 yaşında` for list rows. */
export function formatPetSummary(pet: Pet): string {
  return [SPECIES_LABELS[pet.species], formatPetAge(pet.birth_date)].filter(Boolean).join(' · ');
}

/** Turns a stored row back into the shapes the form controls expect. */
export function toPetFormValues(pet: Pet): PetFormValues {
  const birthDate = fromISODate(pet.birth_date);

  return {
    name: pet.name,
    species: pet.species,
    description: pet.description,
    gender: pet.gender,
    birthDate: birthDate ? coerceDate(birthDate) : null,
    weightKg: pet.weight_kg === null ? '' : String(Number(pet.weight_kg)).replace('.', ','),
  };
}
