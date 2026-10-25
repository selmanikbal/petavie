import { useMutation, useQueryClient } from '@tanstack/react-query';

import { AnalyticsEvents } from '@/constants/analytics';
import { LOCAL_OWNER_ID } from '@/constants/owner';
import { vaccinationKeys } from '@/features/health/hooks/use-vaccinations';
import type { VaccinationInput } from '@/features/health/vaccination-schemas';
import {
  createVaccination,
  deleteVaccination,
  updateVaccination,
} from '@/features/health/vaccinations-service';
import { analytics } from '@/services/analytics';

export function useCreateVaccination(petId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: VaccinationInput) =>
      createVaccination(petId, LOCAL_OWNER_ID, input),
    onSuccess: () => {
      analytics.track(AnalyticsEvents.vaccinationCreated);
      queryClient.invalidateQueries({ queryKey: vaccinationKeys.list(petId) });
    },
  });
}

export function useUpdateVaccination(petId: string, vaccinationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: VaccinationInput) =>
      updateVaccination(vaccinationId, LOCAL_OWNER_ID, input),
    onSuccess: (record) => {
      queryClient.setQueryData(vaccinationKeys.detail(vaccinationId), record);
      queryClient.invalidateQueries({ queryKey: vaccinationKeys.list(petId) });
    },
  });
}

export function useDeleteVaccination(petId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vaccinationId: string) => deleteVaccination(vaccinationId, LOCAL_OWNER_ID),
    onSuccess: (_result, vaccinationId) => {
      queryClient.removeQueries({ queryKey: vaccinationKeys.detail(vaccinationId) });
      queryClient.invalidateQueries({ queryKey: vaccinationKeys.list(petId) });
    },
  });
}
