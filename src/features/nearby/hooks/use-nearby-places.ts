import { useQuery } from '@tanstack/react-query';

import { useCurrentLocation } from '@/features/location/hooks/use-current-location';
import { listNearbyPlaces } from '@/features/nearby/service';
import type { NearbyPlaceCategory } from '@/features/nearby/types';

export const nearbyKeys = {
  list: (category: NearbyPlaceCategory, lat: number, lon: number) =>
    ['nearby-places', category, lat, lon] as const,
};

export function useNearbyPlaces(category: NearbyPlaceCategory) {
  const location = useCurrentLocation();

  const places = useQuery({
    queryKey: location.data
      ? nearbyKeys.list(category, location.data.latitude, location.data.longitude)
      : ['nearby-places', category, 'pending'],
    queryFn: () => listNearbyPlaces(location.data!, category),
    enabled: Boolean(location.data),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  return { location, places };
}
