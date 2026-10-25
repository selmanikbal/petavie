import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { ErrorState } from '@/components/ui/state-views';
import { BrandColors } from '@/constants/theme';
import { useDeleteHealthRecord } from '@/features/health/hooks/use-health-record-mutations';
import { useHealthRecords } from '@/features/health/hooks/use-health-records';
import { formatDateTR, fromISODate } from '@/utils/date';
import { toUserFacingError } from '@/utils/errors';

type HealthRecordSectionProps = {
  petId: string;
};

export function HealthRecordSection({ petId }: HealthRecordSectionProps) {
  const router = useRouter();
  const records = useHealthRecords(petId);
  const deleteRecord = useDeleteHealthRecord(petId);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const pendingDelete = deleteId
    ? records.data?.find((row) => row.id === deleteId)
    : undefined;

  return (
    <Card>
      <Text accessibilityRole="header" className="mb-4 text-lg font-semibold text-ink-900">
        Sağlık kayıtları
      </Text>

      {records.isPending ? (
        <View className="items-center gap-2 py-4">
          <ActivityIndicator color={BrandColors.brand500} />
          <Text className="text-sm text-ink-500">Sağlık kayıtları yükleniyor…</Text>
        </View>
      ) : records.isError ? (
        <ErrorState
          description={toUserFacingError(records.error).message}
          onRetry={() => void records.refetch()}
        />
      ) : records.data && records.data.length > 0 ? (
        <View className="gap-3">
          {records.data.map((row, index) => {
            const visitedAt = fromISODate(row.visited_at);

            return (
              <View key={row.id}>
                {index > 0 ? <View className="mb-3 h-px bg-surface-sunken" /> : null}
                <View className="flex-row items-start gap-3">
                  <Pressable
                    testID={`health-record-row-${row.id}`}
                    accessibilityRole="button"
                    accessibilityLabel={`${row.title}, düzenle`}
                    onPress={() => router.push(`/pet/${petId}/health/${row.id}/edit`)}
                    className="flex-1 gap-0.5 active:opacity-70">
                    <Text className="text-base font-semibold text-ink-900">{row.title}</Text>
                    <Text className="text-sm text-ink-500">
                      {visitedAt ? formatDateTR(visitedAt) : row.visited_at}
                      {row.clinic_name ? ` · ${row.clinic_name}` : ''}
                    </Text>
                    <Text className="text-sm text-ink-500" numberOfLines={2}>
                      {row.description}
                    </Text>
                  </Pressable>
                  <Pressable
                    testID={`health-record-delete-${row.id}`}
                    accessibilityRole="button"
                    accessibilityLabel="Sağlık kaydını sil"
                    onPress={() => setDeleteId(row.id)}
                    hitSlop={8}
                    className="rounded-full p-2 active:bg-surface-sunken">
                    <Ionicons name="trash-outline" size={20} color={BrandColors.ink500} />
                  </Pressable>
                </View>
              </View>
            );
          })}
        </View>
      ) : (
        <Text className="text-base text-ink-500">Henüz sağlık kaydı yok.</Text>
      )}

      <View className="mt-4">
        <Button
          testID="health-record-add"
          label="Sağlık kaydı ekle"
          variant="secondary"
          onPress={() => router.push(`/pet/${petId}/health/new`)}
        />
      </View>

      <ConfirmDialog
        visible={deleteId !== null}
        title="Sağlık kaydı silinsin mi?"
        description={
          pendingDelete
            ? `"${pendingDelete.title}" kaydı kalıcı olarak silinir.`
            : 'Bu kayıt kalıcı olarak silinir.'
        }
        confirmLabel="Sil"
        destructive
        loading={deleteRecord.isPending}
        onConfirm={() => {
          if (!deleteId) return;
          deleteRecord.mutate(deleteId, {
            onSuccess: () => setDeleteId(null),
            onError: () => setDeleteId(null),
          });
        }}
        onCancel={() => setDeleteId(null)}
      />
    </Card>
  );
}
