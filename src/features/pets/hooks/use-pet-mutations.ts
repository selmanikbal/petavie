import { useMutation, useQueryClient } from '@tanstack/react-query';

import { AnalyticsEvents } from '@/constants/analytics';
import { LOCAL_OWNER_ID } from '@/constants/owner';
import { petKeys } from '@/features/pets/hooks/use-pets';
import type { PetInput } from '@/features/pets/schemas';
import { createPet, deletePet, updatePet, updatePetAvatar } from '@/features/pets/service';
import { analytics } from '@/services/analytics';

export function useCreatePet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: PetInput) => createPet(LOCAL_OWNER_ID, input),
    onSuccess: (pet) => {
      analytics.track(AnalyticsEvents.petCreated, { species: pet.species });
      queryClient.setQueryData(petKeys.detail(pet.id), pet);
      queryClient.invalidateQueries({ queryKey: petKeys.lists() });
    },
  });
}

export function useUpdatePet(petId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: PetInput) => updatePet(petId, input),
    onSuccess: (pet) => {
      analytics.track(AnalyticsEvents.petUpdated, { species: pet.species });
      queryClient.setQueryData(petKeys.detail(petId), pet);
      queryClient.invalidateQueries({ queryKey: petKeys.lists() });
    },
  });
}

export function useUpdatePetAvatar(petId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (localImageUri: string) =>
      updatePetAvatar(petId, LOCAL_OWNER_ID, localImageUri),
    onSuccess: (pet) => {
      analytics.track(AnalyticsEvents.petAvatarUpdated, { species: pet.species });
      queryClient.setQueryData(petKeys.detail(petId), pet);
      queryClient.invalidateQueries({ queryKey: petKeys.lists() });
    },
  });
}

export function useDeletePet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (petId: string) => deletePet(petId),
    onSuccess: (_result, petId) => {
      analytics.track(AnalyticsEvents.petDeleted);
      queryClient.removeQueries({ queryKey: petKeys.detail(petId) });
      queryClient.invalidateQueries({ queryKey: petKeys.lists() });
    },
  });
}
