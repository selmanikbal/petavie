import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { ErrorState } from '@/components/ui/state-views';
import { useThemeColors } from '@/constants/theme';
import {
  useCompleteReminder,
  useDeleteReminder,
} from '@/features/reminders/hooks/use-reminder-mutations';
import { useReminders } from '@/features/reminders/hooks/use-reminders';
import { ReminderTaskCard } from '@/features/reminders/components/reminder-task-card';
import { listReminderDatesInRange, reminderOccursOnDate } from '@/features/reminders/calendar-utils';
import { isOccurrenceDone, isReminderActive, sortReminders } from '@/features/reminders/utils';
import { formatDateTR, fromISODate, toISODate } from '@/utils/date';
import type { Pet, Reminder } from '@/types/database';
import { toUserFacingError } from '@/utils/errors';

type ReminderListProps = {
  petsById: Map<string, Pet>;
  filterDate?: string;
  filterPetId?: string | null;
  /** Yalnızca tamamlanmamış hatırlatmaları göster. */
  activeOnly?: boolean;
  showDelete?: boolean;
  emptyActiveLabel?: string;
};

/** First occurrence of a series that is not done yet (falls back to today). */
function nextOpenOccurrence(reminder: Reminder): string {
  const start = fromISODate(reminder.range_start);
  const end = reminder.range_end ? fromISODate(reminder.range_end) : start;
  const dates = start && end ? listReminderDatesInRange(reminder, start, end) : [];
  return dates.find((iso) => !isOccurrenceDone(reminder, iso)) ?? toISODate(new Date());
}

export function ReminderList({
  petsById,
  filterDate,
  filterPetId,
  activeOnly = false,
  showDelete = false,
  emptyActiveLabel = 'Yaklaşan hatırlatma yok.',
}: ReminderListProps) {
  const colors = useThemeColors();
  const reminders = useReminders();
  const completeReminder = useCompleteReminder();
  const deleteReminder = useDeleteReminder();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const pendingDelete = deleteId
    ? reminders.data?.find((row) => row.id === deleteId)
    : undefined;

  if (reminders.isPending) {
    return (
      <View className="items-center gap-2 py-8">
        <ActivityIndicator color={colors.brand500} />
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

  // With a calendar day selected, "done" means that day's occurrence is done.
  const isOpen = (row: Reminder) =>
    filterDate ? !isOccurrenceDone(row, filterDate) : isReminderActive(row);

  const allRows = sortReminders(reminders.data ?? []);
  let rows = allRows;

  if (filterDate) {
    rows = rows.filter((row) => reminderOccursOnDate(row, filterDate));
  }
  if (filterPetId) {
    rows = rows.filter((row) => row.pet_id === filterPetId);
  }
  if (activeOnly) {
    rows = rows.filter(isOpen);
  }

  if (allRows.length === 0) {
    return <Text className="text-base text-ink-500">Henüz hatırlatma eklemedin.</Text>;
  }

  if (rows.length === 0 && activeOnly) {
    return <Text className="text-base text-ink-500">{emptyActiveLabel}</Text>;
  }

  if (rows.length === 0 && filterDate) {
    const day = fromISODate(filterDate);
    return (
      <Text className="text-base text-ink-500">
        {day ? `${formatDateTR(day)} için hatırlatma yok.` : 'Bu gün için hatırlatma yok.'}
      </Text>
    );
  }

  return (
    <View className="gap-3">
      {rows.map((row) => (
        <View key={row.id}>
          <ReminderTaskCard
            reminder={row}
            pet={petsById.get(row.pet_id)}
            active={isOpen(row)}
            onComplete={() =>
              completeReminder.mutate({
                reminderId: row.id,
                occurrenceDate: filterDate ?? nextOpenOccurrence(row),
              })
            }
          />
          {showDelete ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Hatırlatmayı sil"
              onPress={() => setDeleteId(row.id)}
              className="mt-1 self-end px-2 py-1">
              <Text className="text-sm text-danger-500">Sil</Text>
            </Pressable>
          ) : null}
        </View>
      ))}

      <ConfirmDialog
        visible={deleteId !== null}
        title="Hatırlatma silinsin mi?"
        description={
          pendingDelete
            ? `"${pendingDelete.title}" kalıcı olarak silinir.`
            : 'Bu hatırlatma kalıcı olarak silinir.'
        }
        confirmLabel="Sil"
        destructive
        loading={deleteReminder.isPending}
        onConfirm={() => {
          if (!deleteId) return;
          deleteReminder.mutate(deleteId, {
            onSuccess: () => setDeleteId(null),
            onError: () => setDeleteId(null),
          });
        }}
        onCancel={() => setDeleteId(null)}
      />
    </View>
  );
}
