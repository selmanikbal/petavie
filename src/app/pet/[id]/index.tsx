import Ionicons from '@expo/vector-icons/Ionicons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HeaderBackButton } from '@/components/navigation/header-back-button';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { PromoBanner } from '@/components/ui/promo-banner';
import { EmptyState, ErrorState, InlineMessage, LoadingState } from '@/components/ui/state-views';
import { BrandColors } from '@/constants/theme';
import { HealthRecordSection } from '@/features/health/components/health-record-section';
import { MedicationSection } from '@/features/health/components/medication-section';
import { PetWeightSection } from '@/features/health/components/pet-weight-section';
import { VaccinationSection } from '@/features/health/components/vaccination-section';
import { PetDetailHero } from '@/features/pets/components/pet-detail-hero';
import { PetDetailStats } from '@/features/pets/components/pet-detail-stats';
import { useDeletePet } from '@/features/pets/hooks/use-pet-mutations';
import { usePet } from '@/features/pets/hooks/use-pets';
import { toUserFacingError } from '@/utils/errors';

const TABS = [
  { id: 'health', label: 'Sağlık Geçmişi' },
  { id: 'vaccines', label: 'Aşılar' },
  { id: 'meds', label: 'İlaçlar' },
  { id: 'vet', label: 'Veteriner Notları' },
] as const;

type TabId = (typeof TABS)[number]['id'];

export default function PetDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const petId = id ?? '';
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const pet = usePet(petId);
  const deletePet = useDeletePet();
  const [activeTab, setActiveTab] = useState<TabId>('health');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  if (pet.isPending) {
    return (
      <View className="flex-1 bg-surface-canvas">
        <View className="px-4 pb-3" style={{ paddingTop: insets.top + 8 }}>
          <HeaderBackButton iconOnly />
        </View>
        <LoadingState label="Bilgiler yükleniyor…" />
      </View>
    );
  }

  if (pet.isError) {
    return (
      <View className="flex-1 bg-surface-canvas">
        <View className="px-4 pb-3" style={{ paddingTop: insets.top + 8 }}>
          <HeaderBackButton iconOnly />
        </View>
        <View className="flex-1 px-4">
          <ErrorState
            description={toUserFacingError(pet.error).message}
            onRetry={() => void pet.refetch()}
          />
        </View>
      </View>
    );
  }

  if (!pet.data) {
    return (
      <View className="flex-1 bg-surface-canvas">
        <View className="px-4 pb-3" style={{ paddingTop: insets.top + 8 }}>
          <HeaderBackButton iconOnly />
        </View>
        <View className="flex-1 px-4">
          <EmptyState
            title="Bu dostunu bulamadık"
            description="Kayıt silinmiş olabilir. Listeye dönüp tekrar dene."
            actionLabel="Listeye dön"
            onAction={() => router.replace('/(tabs)/pets')}
          />
        </View>
      </View>
    );
  }

  const data = pet.data;

  return (
    <View className="flex-1 bg-surface-canvas">
      <View
        className="border-b border-surface-sunken bg-surface px-5 pb-3"
        style={{ paddingTop: insets.top + 8 }}>
        <View className="flex-row items-center justify-between">
          <HeaderBackButton iconOnly />

          <View className="flex-row items-center gap-1.5">
            <Ionicons name="checkmark-circle" size={18} color={BrandColors.brand500} />
            <Text className="text-base font-semibold text-ink-900">Dost Profili</Text>
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Düzenle"
            onPress={() => router.push(`/pet/${petId}/edit`)}
            className="rounded-full bg-brand-50 px-3 py-2">
            <Text className="text-sm font-semibold text-brand-600">Düzenle</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-5 px-5 py-5"
        showsVerticalScrollIndicator={false}>
        <PetDetailHero pet={data} />
        <PetDetailStats pet={data} />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-2">
          {TABS.map((tab) => {
            const active = tab.id === activeTab;
            return (
              <Pressable
                key={tab.id}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                onPress={() => setActiveTab(tab.id)}
                className={`rounded-full px-4 py-2 ${
                  active
                    ? 'border border-brand-500 bg-brand-100'
                    : 'border border-surface-sunken bg-surface'
                }`}>
                <Text
                  className={`text-sm ${
                    active ? 'font-semibold text-brand-600' : 'font-medium text-ink-500'
                  }`}>
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {deletePet.isError ? (
          <InlineMessage tone="error" message={toUserFacingError(deletePet.error).message} />
        ) : null}

        {activeTab === 'health' ? (
          <>
            <PetWeightSection petId={petId} />
            <VaccinationSection petId={petId} />
            <HealthRecordSection petId={petId} />
          </>
        ) : null}
        {activeTab === 'vaccines' ? <VaccinationSection petId={petId} /> : null}
        {activeTab === 'meds' ? <MedicationSection petId={petId} /> : null}
        {activeTab === 'vet' ? <HealthRecordSection petId={petId} /> : null}

        <PromoBanner
          title="Beslenme İpucu"
          description="Günlük mama miktarını kilo kayıtlarına göre düzenli takip et."
          icon="bulb-outline"
        />

        <Button
          testID="pet-delete"
          label="Dostu sil"
          variant="danger"
          onPress={() => setIsConfirmOpen(true)}
        />
      </ScrollView>

      <ConfirmDialog
        visible={isConfirmOpen}
        title={`${data.name} silinsin mi?`}
        description="Bu işlem geri alınamaz. Sağlık kayıtları da birlikte silinir."
        confirmLabel="Sil"
        destructive
        loading={deletePet.isPending}
        onConfirm={() =>
          deletePet.mutate(petId, {
            onSuccess: () => {
              setIsConfirmOpen(false);
              router.replace('/(tabs)/pets');
            },
            onError: () => setIsConfirmOpen(false),
          })
        }
        onCancel={() => setIsConfirmOpen(false)}
      />
    </View>
  );
}
