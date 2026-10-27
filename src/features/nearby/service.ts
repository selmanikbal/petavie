import { Linking, Platform } from 'react-native';

import { NEARBY_MAPS_SEARCH_QUERY } from '@/features/nearby/constants';
import type { NearbyPlaceCategory } from '@/features/nearby/types';

/**
 * Opens Google Maps (Android) / Apple Maps (iOS) searching the category around
 * the user. The maps app finds the location itself and uses the platform's own
 * data — no API key, no quota, no location permission needed in Petavie.
 */
export function searchCategoryInMaps(category: NearbyPlaceCategory): void {
  const query = encodeURIComponent(NEARBY_MAPS_SEARCH_QUERY[category]);

  const url = Platform.select({
    ios: `maps://?q=${query}`,
    android: `geo:0,0?q=${query}`,
    default: `https://www.google.com/maps/search/${query}`,
  });

  if (url) void Linking.openURL(url);
}
