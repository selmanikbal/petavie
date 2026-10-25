import { useMutation, useQueryClient } from '@tanstack/react-query';

import { AnalyticsEvents } from '@/constants/analytics';
import { LOCAL_OWNER_ID } from '@/constants/owner';
import { medicationKeys } from '@/features/health/hooks/use-medications';
import type { MedicationInput } from '@/features/health/medication-schemas';
import {
  createMedication,
  deleteMedication,
  updateMedication,
} from '@/features/health/medications-service';
import { analytics } from '@/services/analytics';

export function useCreateMedication(petId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: MedicationInput) =>
      createMedication(petId, LOCAL_OWNER_ID, input),
    onSuccess: () => {
      analytics.track(AnalyticsEvents.medicationCreated);
      queryClient.invalidateQueries({ queryKey: medicationKeys.list(petId) });
    },
  });
}

export function useUpdateMedication(petId: string, medicationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: MedicationInput) =>
      updateMedication(medicationId, LOCAL_OWNER_ID, input),
    onSuccess: (record) => {
      queryClient.setQueryData(medicationKeys.detail(medicationId), record);
      queryClient.invalidateQueries({ queryKey: medicationKeys.list(petId) });
    },
  });
}

export function useDeleteMedication(petId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (medicationId: string) => deleteMedication(medicationId, LOCAL_OWNER_ID),
    onSuccess: (_result, medicationId) => {
      queryClient.removeQueries({ queryKey: medicationKeys.detail(medicationId) });
      queryClient.invalidateQueries({ queryKey: medicationKeys.list(petId) });
    },
  });
}
