import { useMutation, useQueryClient } from '@tanstack/react-query';

import { AnalyticsEvents } from '@/constants/analytics';
import { LOCAL_OWNER_ID } from '@/constants/owner';
import { reminderKeys } from '@/features/reminders/hooks/use-reminders';
import type { ReminderInput } from '@/features/reminders/schemas';
import {
  completeReminderOccurrence,
  createReminder,
  deleteReminder,
  updateReminder,
} from '@/features/reminders/service';
import { analytics } from '@/services/analytics';

export function useCreateReminder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ReminderInput) => createReminder(LOCAL_OWNER_ID, input),
    onSuccess: () => {
      analytics.track(AnalyticsEvents.reminderCreated);
      queryClient.invalidateQueries({ queryKey: reminderKeys.lists() });
    },
  });
}

export function useUpdateReminder(reminderId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ReminderInput) =>
      updateReminder(reminderId, LOCAL_OWNER_ID, input),
    onSuccess: (record) => {
      queryClient.setQueryData(reminderKeys.detail(reminderId), record);
      queryClient.invalidateQueries({ queryKey: reminderKeys.lists() });
    },
  });
}

export function useCompleteReminder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reminderId, occurrenceDate }: { reminderId: string; occurrenceDate: string }) =>
      completeReminderOccurrence(reminderId, LOCAL_OWNER_ID, occurrenceDate),
    onSuccess: (record) => {
      analytics.track(AnalyticsEvents.reminderCompleted);
      queryClient.setQueryData(reminderKeys.detail(record.id), record);
      queryClient.invalidateQueries({ queryKey: reminderKeys.lists() });
    },
  });
}

export function useDeleteReminder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reminderId: string) => deleteReminder(reminderId, LOCAL_OWNER_ID),
    onSuccess: (_result, reminderId) => {
      queryClient.removeQueries({ queryKey: reminderKeys.detail(reminderId) });
      queryClient.invalidateQueries({ queryKey: reminderKeys.lists() });
    },
  });
}
