import { fetchNearbyPlacesFromOverpass } from '@/features/nearby/backends/overpass';
import type { GeoPoint, NearbyPlace, NearbyPlaceCategory } from '@/features/nearby/types';
import { Linking, Platform } from 'react-native';

export function listNearbyPlaces(
  location: GeoPoint,
  category: NearbyPlaceCategory,
): Promise<NearbyPlace[]> {
  return fetchNearbyPlacesFromOverpass(location, category);
}

export function openPlaceInMaps(place: NearbyPlace): void {
  const label = encodeURIComponent(place.name);
  const { latitude, longitude } = place;

  const url = Platform.select({
    ios: `maps:0,0?q=${label}@${latitude},${longitude}`,
    android: `geo:${latitude},${longitude}?q=${latitude},${longitude}(${label})`,
    default: `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`,
  });

  if (url) void Linking.openURL(url);
}
