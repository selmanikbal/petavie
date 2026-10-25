import type { NearbyPlaceCategory } from '@/features/nearby/types';

export const NEARBY_SEARCH_RADIUS_METERS = 5_000;

export const NEARBY_CATEGORY_LABELS: Record<NearbyPlaceCategory, string> = {
  veterinary: 'Veteriner',
  pet_shop: 'Pet Shop',
  pet_grooming: 'Kuaför',
};

export const NEARBY_CATEGORIES = [
  'veterinary',
  'pet_shop',
  'pet_grooming',
] as const satisfies readonly NearbyPlaceCategory[];

/** OpenStreetMap tag pairs queried per category. */
export const NEARBY_CATEGORY_TAGS: Record<NearbyPlaceCategory, readonly string[]> = {
  veterinary: ['amenity=veterinary'],
  pet_shop: ['shop=pet'],
  pet_grooming: ['shop=pet_grooming', 'craft=pet_groomer'],
};
