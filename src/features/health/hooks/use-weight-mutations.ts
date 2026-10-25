import { useMutation, useQueryClient } from '@tanstack/react-query';

import { AnalyticsEvents } from '@/constants/analytics';
import { LOCAL_OWNER_ID } from '@/constants/owner';
import { petWeightKeys } from '@/features/health/hooks/use-pet-weights';
import type { PetWeightInput } from '@/features/health/schemas';
import { createPetWeight, deletePetWeight } from '@/features/health/service';
import { petKeys } from '@/features/pets/hooks/use-pets';
import { analytics } from '@/services/analytics';

export function useCreatePetWeight(petId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: PetWeightInput) =>
      createPetWeight(petId, LOCAL_OWNER_ID, input),
    onSuccess: () => {
      analytics.track(AnalyticsEvents.weightAdded);
      queryClient.invalidateQueries({ queryKey: petWeightKeys.list(petId) });
      queryClient.invalidateQueries({ queryKey: petKeys.detail(petId) });
      queryClient.invalidateQueries({ queryKey: petKeys.lists() });
    },
  });
}

export function useDeletePetWeight(petId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (weightId: string) => deletePetWeight(weightId, LOCAL_OWNER_ID),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: petWeightKeys.list(petId) });
      queryClient.invalidateQueries({ queryKey: petKeys.detail(petId) });
      queryClient.invalidateQueries({ queryKey: petKeys.lists() });
    },
  });
}
