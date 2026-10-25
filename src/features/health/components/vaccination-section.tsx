import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { ErrorState } from '@/components/ui/state-views';
import { BrandColors } from '@/constants/theme';
import { useDeleteVaccination } from '@/features/health/hooks/use-vaccination-mutations';
import { useVaccinations } from '@/features/health/hooks/use-vaccinations';
import { formatDateTR, fromISODate } from '@/utils/date';
import { toUserFacingError } from '@/utils/errors';

type VaccinationSectionProps = {
  petId: string;
};

export function VaccinationSection({ petId }: VaccinationSectionProps) {
  const router = useRouter();
  const vaccinations = useVaccinations(petId);
  const deleteVaccination = useDeleteVaccination(petId);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const pendingDelete = deleteId
    ? vaccinations.data?.find((row) => row.id === deleteId)
    : undefined;

  return (
    <Card>
      <Text accessibilityRole="header" className="mb-4 text-lg font-semibold text-ink-900">
        Aşılar
      </Text>

      {vaccinations.isPending ? (
        <View className="items-center gap-2 py-4">
          <ActivityIndicator color={BrandColors.brand500} />
          <Text className="text-sm text-ink-500">Aşı kayıtları yükleniyor…</Text>
        </View>
      ) : vaccinations.isError ? (
        <ErrorState
          description={toUserFacingError(vaccinations.error).message}
          onRetry={() => void vaccinations.refetch()}
        />
      ) : vaccinations.data && vaccinations.data.length > 0 ? (
        <View className="gap-3">
          {vaccinations.data.map((row, index) => {
            const administeredAt = fromISODate(row.administered_at);
            const nextDueAt = row.next_due_at ? fromISODate(row.next_due_at) : null;

            return (
              <View key={row.id}>
                {index > 0 ? <View className="mb-3 h-px bg-surface-sunken" /> : null}
                <View className="flex-row items-start gap-3">
                  <Pressable
                    testID={`vaccination-row-${row.id}`}
                    accessibilityRole="button"
                    accessibilityLabel={`${row.name}, düzenle`}
                    onPress={() => router.push(`/pet/${petId}/vaccination/${row.id}/edit`)}
                    className="flex-1 gap-0.5 active:opacity-70">
                    <Text className="text-base font-semibold text-ink-900">{row.name}</Text>
                    <Text className="text-sm text-ink-500">
                      Uygulama: {administeredAt ? formatDateTR(administeredAt) : row.administered_at}
                    </Text>
                    {nextDueAt ? (
                      <Text className="text-sm text-ink-500">
                        Sonraki doz: {formatDateTR(nextDueAt)}
                      </Text>
                    ) : null}
                    {row.clinic_name ? (
                      <Text className="text-sm text-ink-500">{row.clinic_name}</Text>
                    ) : null}
                  </Pressable>
                  <Pressable
                    testID={`vaccination-delete-${row.id}`}
                    accessibilityRole="button"
                    accessibilityLabel="Aşı kaydını sil"
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
        <Text className="text-base text-ink-500">Henüz aşı kaydı yok.</Text>
      )}

      <View className="mt-4">
        <Button
          testID="vaccination-add"
          label="Aşı ekle"
          variant="secondary"
          onPress={() => router.push(`/pet/${petId}/vaccination/new`)}
        />
      </View>

      <ConfirmDialog
        visible={deleteId !== null}
        title="Aşı kaydı silinsin mi?"
        description={
          pendingDelete
            ? `"${pendingDelete.name}" kaydı kalıcı olarak silinir.`
            : 'Bu kayıt kalıcı olarak silinir.'
        }
        confirmLabel="Sil"
        destructive
        loading={deleteVaccination.isPending}
        onConfirm={() => {
          if (!deleteId) return;
          deleteVaccination.mutate(deleteId, {
            onSuccess: () => setDeleteId(null),
            onError: () => setDeleteId(null),
          });
        }}
        onCancel={() => setDeleteId(null)}
      />
    </Card>
  );
}
