import { useQuery } from '@tanstack/react-query';

import { getCurrentLocation } from '@/features/location/service';

export const locationKeys = {
  current: ['current-location'] as const,
};

export function useCurrentLocation(enabled = true) {
  return useQuery({
    queryKey: locationKeys.current,
    queryFn: getCurrentLocation,
    enabled,
    staleTime: 10 * 60 * 1000,
    retry: 1,
  });
}
