import { useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

import { ErrorState } from '@/components/ui/state-views';
import { BrandColors } from '@/constants/theme';
import { ReminderCompactCard } from '@/features/reminders/components/reminder-compact-card';
import { getUpcomingReminders } from '@/features/reminders/home-reminder-utils';
import { useCompleteReminder } from '@/features/reminders/hooks/use-reminder-mutations';
import { useReminders } from '@/features/reminders/hooks/use-reminders';
import { toUserFacingError } from '@/utils/errors';

const UPCOMING_DAY_COUNT = 3;

type HomeReminderListProps = {
  filterPetId?: string | null;
  emptyLabel?: string;
};

export function HomeReminderList({ filterPetId, emptyLabel }: HomeReminderListProps) {
  const reminders = useReminders();
  const completeReminder = useCompleteReminder();
  const [completingId, setCompletingId] = useState<string | null>(null);

  if (reminders.isPending) {
    return (
      <View className="items-center gap-2 py-6">
        <ActivityIndicator color={BrandColors.brand500} />
        <Text className="text-sm text-ink-500">Hatırlatmalar yükleniyor…</Text>
      </View>
    );
  }

  if (reminders.isError) {
    return (
      <ErrorState
        description={toUserFacingError(reminders.error).message}
        onRetry={() => void reminders.refetch()}
      />
    );
  }

  const items = getUpcomingReminders(reminders.data ?? [], UPCOMING_DAY_COUNT, filterPetId);

  if (items.length === 0) {
    return (
      <Text className="text-sm text-ink-500">
        {emptyLabel ?? 'Önümüzdeki 3 gün için hatırlatma yok.'}
      </Text>
    );
  }

  return (
    <View className="gap-2">
      {items.map(({ reminder, occurrenceAt }) => (
        <ReminderCompactCard
          key={`${reminder.id}-${occurrenceAt.toISOString()}`}
          reminder={reminder}
          occurrenceAt={occurrenceAt}
          completing={completingId === reminder.id && completeReminder.isPending}
          onComplete={() => {
            setCompletingId(reminder.id);
            completeReminder.mutate(reminder.id, {
              onSettled: () => setCompletingId(null),
            });
          }}
        />
      ))}
    </View>
  );
}
