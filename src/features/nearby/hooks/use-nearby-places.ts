import { useQuery } from '@tanstack/react-query';

import { useCurrentLocation } from '@/features/location/hooks/use-current-location';
import { listNearbyPlaces } from '@/features/nearby/service';
import type { NearbyPlaceCategory } from '@/features/nearby/types';

/** ~100 m grid so small GPS jitter does not trigger a new search. */
function roundCoord(value: number): number {
  return Math.round(value * 1000) / 1000;
}

export const nearbyKeys = {
  all: (lat: number, lon: number) => ['nearby-places', lat, lon] as const,
};

export function useNearbyPlaces(category: NearbyPlaceCategory) {
  const location = useCurrentLocation();
  const point = location.data
    ? { latitude: roundCoord(location.data.latitude), longitude: roundCoord(location.data.longitude) }
    : null;

  // One query holds every category; `select` picks the active chip without refetching.
  const places = useQuery({
    queryKey: point ? nearbyKeys.all(point.latitude, point.longitude) : ['nearby-places', 'pending'],
    queryFn: () => listNearbyPlaces(location.data!),
    enabled: point !== null,
    select: (all) => all[category],
    staleTime: 30 * 60 * 1000,
    retry: 1,
  });

  return { location, places };
}
