import { useQuery } from '@tanstack/react-query';

import { getVaccination, listVaccinations } from '@/features/health/vaccinations-service';

export const vaccinationKeys = {
  all: ['vaccinations'] as const,
  lists: () => [...vaccinationKeys.all, 'list'] as const,
  list: (petId: string) => [...vaccinationKeys.lists(), petId] as const,
  detail: (vaccinationId: string) => [...vaccinationKeys.all, 'detail', vaccinationId] as const,
};

export function useVaccinations(petId: string) {
  return useQuery({
    queryKey: vaccinationKeys.list(petId),
    queryFn: () => listVaccinations(petId),
    enabled: petId.length > 0,
  });
}

export function useVaccination(vaccinationId: string) {
  return useQuery({
    queryKey: vaccinationKeys.detail(vaccinationId),
    queryFn: () => getVaccination(vaccinationId),
    enabled: vaccinationId.length > 0,
  });
}
