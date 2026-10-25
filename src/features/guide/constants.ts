import type { AnimalCare } from '@/features/guide/types';

export const ALL_ANIMAL_CATEGORIES = 'all';

export const CARE_SECTION_LABELS: Record<keyof AnimalCare, string> = {
  nutrition: 'Beslenme',
  grooming: 'Bakım',
  exercise: 'Egzersiz',
  habitat: 'Yaşam alanı',
};

export const CARE_SECTION_ORDER = [
  'nutrition',
  'grooming',
  'exercise',
  'habitat',
] as const satisfies readonly (keyof AnimalCare)[];
