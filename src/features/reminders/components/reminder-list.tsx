import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { ErrorState } from '@/components/ui/state-views';
import { BrandColors } from '@/constants/theme';
import {
  useCompleteReminder,
  useDeleteReminder,
} from '@/features/reminders/hooks/use-reminder-mutations';
import { useReminders } from '@/features/reminders/hooks/use-reminders';
import { ReminderTaskCard } from '@/features/reminders/components/reminder-task-card';
import { reminderOccursOnDate } from '@/features/reminders/calendar-utils';
import { isReminderActive, sortReminders } from '@/features/reminders/utils';
import { formatDateTR, fromISODate } from '@/utils/date';
import type { Pet } from '@/types/database';
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

export function ReminderList({
  petsById,
  filterDate,
  filterPetId,
  activeOnly = false,
  showDelete = false,
  emptyActiveLabel = 'Yaklaşan hatırlatma yok.',
}: ReminderListProps) {
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

  const allRows = sortReminders(reminders.data ?? []);
  let rows = allRows;

  if (filterDate) {
    rows = rows.filter((row) => reminderOccursOnDate(row, filterDate));
  }
  if (filterPetId) {
    rows = rows.filter((row) => row.pet_id === filterPetId);
  }
  if (activeOnly) {
    rows = rows.filter(isReminderActive);
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
            active={isReminderActive(row)}
            onComplete={() => completeReminder.mutate(row.id)}
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
