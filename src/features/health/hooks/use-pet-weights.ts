import { useQuery } from '@tanstack/react-query';

import { listPetWeights } from '@/features/health/service';

export const petWeightKeys = {
  all: ['pet-weights'] as const,
  lists: () => [...petWeightKeys.all, 'list'] as const,
  list: (petId: string) => [...petWeightKeys.lists(), petId] as const,
};

export function usePetWeights(petId: string) {
  return useQuery({
    queryKey: petWeightKeys.list(petId),
    queryFn: () => listPetWeights(petId),
    enabled: petId.length > 0,
  });
}
