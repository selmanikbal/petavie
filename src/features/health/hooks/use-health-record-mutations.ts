import { useMutation, useQueryClient } from '@tanstack/react-query';

import { AnalyticsEvents } from '@/constants/analytics';
import { LOCAL_OWNER_ID } from '@/constants/owner';
import type { HealthRecordInput } from '@/features/health/health-record-schemas';
import { healthRecordKeys } from '@/features/health/hooks/use-health-records';
import {
  createHealthRecord,
  deleteHealthRecord,
  updateHealthRecord,
} from '@/features/health/health-records-service';
import { analytics } from '@/services/analytics';

export function useCreateHealthRecord(petId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: HealthRecordInput) =>
      createHealthRecord(petId, LOCAL_OWNER_ID, input),
    onSuccess: () => {
      analytics.track(AnalyticsEvents.healthRecordCreated);
      queryClient.invalidateQueries({ queryKey: healthRecordKeys.list(petId) });
    },
  });
}

export function useUpdateHealthRecord(petId: string, recordId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: HealthRecordInput) =>
      updateHealthRecord(recordId, LOCAL_OWNER_ID, input),
    onSuccess: (record) => {
      queryClient.setQueryData(healthRecordKeys.detail(recordId), record);
      queryClient.invalidateQueries({ queryKey: healthRecordKeys.list(petId) });
    },
  });
}

export function useDeleteHealthRecord(petId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (recordId: string) => deleteHealthRecord(recordId, LOCAL_OWNER_ID),
    onSuccess: (_result, recordId) => {
      queryClient.removeQueries({ queryKey: healthRecordKeys.detail(recordId) });
      queryClient.invalidateQueries({ queryKey: healthRecordKeys.list(petId) });
    },
  });
}
