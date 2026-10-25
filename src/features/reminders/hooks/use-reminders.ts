import { useQuery } from '@tanstack/react-query';

import { LOCAL_OWNER_ID } from '@/constants/owner';
import { getReminder, listReminders } from '@/features/reminders/service';

export const reminderKeys = {
  all: ['reminders'] as const,
  lists: () => [...reminderKeys.all, 'list'] as const,
  list: (ownerId: string) => [...reminderKeys.lists(), ownerId] as const,
  detail: (reminderId: string) => [...reminderKeys.all, 'detail', reminderId] as const,
};

export function useReminders() {
  return useQuery({
    queryKey: reminderKeys.list(LOCAL_OWNER_ID),
    queryFn: () => listReminders(LOCAL_OWNER_ID),
  });
}

export function useReminder(reminderId: string) {
  return useQuery({
    queryKey: reminderKeys.detail(reminderId),
    queryFn: () => getReminder(reminderId),
    enabled: reminderId.length > 0,
  });
}
