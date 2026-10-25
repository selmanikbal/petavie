import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { ErrorState } from '@/components/ui/state-views';
import { BrandColors } from '@/constants/theme';
import { useDeleteMedication } from '@/features/health/hooks/use-medication-mutations';
import { useMedications } from '@/features/health/hooks/use-medications';
import { isMedicationActive } from '@/features/health/medication-utils';
import { formatDateTR, fromISODate } from '@/utils/date';
import { toUserFacingError } from '@/utils/errors';

type MedicationSectionProps = {
  petId: string;
};

export function MedicationSection({ petId }: MedicationSectionProps) {
  const router = useRouter();
  const medications = useMedications(petId);
  const deleteMedication = useDeleteMedication(petId);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const pendingDelete = deleteId
    ? medications.data?.find((row) => row.id === deleteId)
    : undefined;

  return (
    <Card>
      <Text accessibilityRole="header" className="mb-4 text-lg font-semibold text-ink-900">
        İlaçlar
      </Text>

      {medications.isPending ? (
        <View className="items-center gap-2 py-4">
          <ActivityIndicator color={BrandColors.brand500} />
          <Text className="text-sm text-ink-500">İlaç kayıtları yükleniyor…</Text>
        </View>
      ) : medications.isError ? (
        <ErrorState
          description={toUserFacingError(medications.error).message}
          onRetry={() => void medications.refetch()}
        />
      ) : medications.data && medications.data.length > 0 ? (
        <View className="gap-3">
          {medications.data.map((row, index) => {
            const startedAt = fromISODate(row.started_at);
            const endedAt = row.ended_at ? fromISODate(row.ended_at) : null;
            const active = isMedicationActive(row);

            return (
              <View key={row.id}>
                {index > 0 ? <View className="mb-3 h-px bg-surface-sunken" /> : null}
                <View className="flex-row items-start gap-3">
                  <Pressable
                    testID={`medication-row-${row.id}`}
                    accessibilityRole="button"
                    accessibilityLabel={`${row.name}, düzenle`}
                    onPress={() => router.push(`/pet/${petId}/medication/${row.id}/edit`)}
                    className="flex-1 gap-0.5 active:opacity-70">
                    <View className="flex-row items-center gap-2">
                      <Text className="text-base font-semibold text-ink-900">{row.name}</Text>
                      {active ? (
                        <Text className="rounded-full bg-brand-100 px-2 py-0.5 text-xs font-semibold text-brand-600">
                          Devam ediyor
                        </Text>
                      ) : null}
                    </View>
                    <Text className="text-sm text-ink-500">
                      {row.dosage} · {row.frequency}
                    </Text>
                    <Text className="text-sm text-ink-500">
                      {startedAt ? formatDateTR(startedAt) : row.started_at}
                      {' — '}
                      {endedAt ? formatDateTR(endedAt) : 'Devam ediyor'}
                    </Text>
                  </Pressable>
                  <Pressable
                    testID={`medication-delete-${row.id}`}
                    accessibilityRole="button"
                    accessibilityLabel="İlaç kaydını sil"
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
        <Text className="text-base text-ink-500">Henüz ilaç kaydı yok.</Text>
      )}

      <View className="mt-4">
        <Button
          testID="medication-add"
          label="İlaç ekle"
          variant="secondary"
          onPress={() => router.push(`/pet/${petId}/medication/new`)}
        />
      </View>

      <ConfirmDialog
        visible={deleteId !== null}
        title="İlaç kaydı silinsin mi?"
        description={
          pendingDelete
            ? `"${pendingDelete.name}" kaydı kalıcı olarak silinir.`
            : 'Bu kayıt kalıcı olarak silinir.'
        }
        confirmLabel="Sil"
        destructive
        loading={deleteMedication.isPending}
        onConfirm={() => {
          if (!deleteId) return;
          deleteMedication.mutate(deleteId, {
            onSuccess: () => setDeleteId(null),
            onError: () => setDeleteId(null),
          });
        }}
        onCancel={() => setDeleteId(null)}
      />
    </Card>
  );
}
