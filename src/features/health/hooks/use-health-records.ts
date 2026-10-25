import { useQuery } from '@tanstack/react-query';

import { getHealthRecord, listHealthRecords } from '@/features/health/health-records-service';

export const healthRecordKeys = {
  all: ['health-records'] as const,
  lists: () => [...healthRecordKeys.all, 'list'] as const,
  list: (petId: string) => [...healthRecordKeys.lists(), petId] as const,
  detail: (recordId: string) => [...healthRecordKeys.all, 'detail', recordId] as const,
};

export function useHealthRecords(petId: string) {
  return useQuery({
    queryKey: healthRecordKeys.list(petId),
    queryFn: () => listHealthRecords(petId),
    enabled: petId.length > 0,
  });
}

export function useHealthRecord(recordId: string) {
  return useQuery({
    queryKey: healthRecordKeys.detail(recordId),
    queryFn: () => getHealthRecord(recordId),
    enabled: recordId.length > 0,
  });
}
