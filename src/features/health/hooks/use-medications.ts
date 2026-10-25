import { useQuery } from '@tanstack/react-query';

import { getMedication, listMedications } from '@/features/health/medications-service';

export const medicationKeys = {
  all: ['medications'] as const,
  lists: () => [...medicationKeys.all, 'list'] as const,
  list: (petId: string) => [...medicationKeys.lists(), petId] as const,
  detail: (medicationId: string) => [...medicationKeys.all, 'detail', medicationId] as const,
};

export function useMedications(petId: string) {
  return useQuery({
    queryKey: medicationKeys.list(petId),
    queryFn: () => listMedications(petId),
    enabled: petId.length > 0,
  });
}

export function useMedication(medicationId: string) {
  return useQuery({
    queryKey: medicationKeys.detail(medicationId),
    queryFn: () => getMedication(medicationId),
    enabled: medicationId.length > 0,
  });
}
