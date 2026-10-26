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

/** Guide photos come from Wikimedia Commons under CC BY / CC BY-SA licences. */
export const GUIDE_IMAGE_CREDIT =
  'Görseller: Wikimedia Commons. CC BY / CC BY-SA lisanslıdır; hakları ilgili fotoğrafçılara aittir.';
