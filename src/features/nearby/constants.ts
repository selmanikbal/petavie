import type Ionicons from '@expo/vector-icons/Ionicons';

import type { NearbyPlaceCategory } from '@/features/nearby/types';

export const NEARBY_CATEGORIES = [
  'veterinary',
  'pet_shop',
  'pet_grooming',
] as const satisfies readonly NearbyPlaceCategory[];

export const NEARBY_CATEGORY_LABELS: Record<NearbyPlaceCategory, string> = {
  veterinary: 'Veteriner',
  pet_shop: 'Pet Shop',
  pet_grooming: 'Kuaför',
};

export const NEARBY_CATEGORY_ICONS: Record<
  NearbyPlaceCategory,
  keyof typeof Ionicons.glyphMap
> = {
  veterinary: 'medkit-outline',
  pet_shop: 'storefront-outline',
  pet_grooming: 'cut-outline',
};

/** Search words handed to the phone's maps app. */
export const NEARBY_MAPS_SEARCH_QUERY: Record<NearbyPlaceCategory, string> = {
  veterinary: 'veteriner',
  pet_shop: 'pet shop',
  pet_grooming: 'pet kuaför',
};
