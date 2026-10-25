import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { ErrorState } from '@/components/ui/state-views';
import { BrandColors } from '@/constants/theme';
import { usePetWeights } from '@/features/health/hooks/use-pet-weights';
import { useDeletePetWeight } from '@/features/health/hooks/use-weight-mutations';
import { formatWeightKg } from '@/features/health/utils';
import { formatDateTR, fromISODate } from '@/utils/date';
import { toUserFacingError } from '@/utils/errors';

type PetWeightSectionProps = {
  petId: string;
};

export function PetWeightSection({ petId }: PetWeightSectionProps) {
  const router = useRouter();
  const weights = usePetWeights(petId);
  const deleteWeight = useDeletePetWeight(petId);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const pendingDelete = deleteId
    ? weights.data?.find((row) => row.id === deleteId)
    : undefined;

  return (
    <Card>
      <Text accessibilityRole="header" className="mb-4 text-lg font-semibold text-ink-900">
        Kilo takibi
      </Text>

      {weights.isPending ? (
        <View className="items-center gap-2 py-4">
          <ActivityIndicator color={BrandColors.brand500} />
          <Text className="text-sm text-ink-500">Kilo kayıtları yükleniyor…</Text>
        </View>
      ) : weights.isError ? (
        <ErrorState
          description={toUserFacingError(weights.error).message}
          onRetry={() => void weights.refetch()}
        />
      ) : weights.data && weights.data.length > 0 ? (
        <View className="gap-3">
          {weights.data.map((row, index) => {
            const recordedAt = fromISODate(row.recorded_at);

            return (
              <View key={row.id}>
                {index > 0 ? <View className="mb-3 h-px bg-surface-sunken" /> : null}
                <View className="flex-row items-start gap-3">
                  <View className="flex-1 gap-0.5">
                    <Text className="text-base font-semibold text-ink-900">
                      {formatWeightKg(row.weight_kg)}
                    </Text>
                    <Text className="text-sm text-ink-500">
                      {recordedAt ? formatDateTR(recordedAt) : row.recorded_at}
                    </Text>
                    {row.note ? (
                      <Text className="text-sm text-ink-500">{row.note}</Text>
                    ) : null}
                  </View>
                  <Pressable
                    testID={`pet-weight-delete-${row.id}`}
                    accessibilityRole="button"
                    accessibilityLabel="Kilo kaydını sil"
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
        <Text className="text-base text-ink-500">Henüz kilo kaydı yok.</Text>
      )}

      <View className="mt-4">
        <Button
          testID="pet-weight-add"
          label="Kilo ekle"
          variant="secondary"
          onPress={() => router.push(`/pet/${petId}/weight/new`)}
        />
      </View>

      <ConfirmDialog
        visible={deleteId !== null}
        title="Kilo kaydı silinsin mi?"
        description={
          pendingDelete
            ? `${formatWeightKg(pendingDelete.weight_kg)} kaydı kalıcı olarak silinir.`
            : 'Bu kayıt kalıcı olarak silinir.'
        }
        confirmLabel="Sil"
        destructive
        loading={deleteWeight.isPending}
        onConfirm={() => {
          if (!deleteId) return;
          deleteWeight.mutate(deleteId, {
            onSuccess: () => setDeleteId(null),
            onError: () => setDeleteId(null),
          });
        }}
        onCancel={() => setDeleteId(null)}
      />
    </Card>
  );
}
