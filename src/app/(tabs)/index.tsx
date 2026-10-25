import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Text, View } from 'react-native';

import { AppTopBar } from '@/components/ui/app-top-bar';
import { FilterChips } from '@/components/ui/filter-chips';
import { Screen } from '@/components/ui/screen';
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/state-views';
import { NearbyPlacesSection } from '@/features/nearby/components/nearby-places-section';
import { SPECIES_LABELS } from '@/features/pets/schemas';
import { usePets } from '@/features/pets/hooks/use-pets';
import { HomeReminderList } from '@/features/reminders/components/home-reminder-list';
import { toUserFacingError } from '@/utils/errors';

export default function HomeScreen() {
  const router = useRouter();
  const pets = usePets();
  const hasPets = (pets.data?.length ?? 0) > 0;
  const petsById = useMemo(
    () => new Map((pets.data ?? []).map((pet) => [pet.id, pet])),
    [pets.data],
  );

  const [filterPetId, setFilterPetId] = useState<string | null>(null);

  const filterOptions = useMemo(
    () =>
      (pets.data ?? []).map((pet) => ({
        id: pet.id,
        label: pet.name,
      })),
    [pets.data],
  );

  const selectedPetId = filterPetId ?? filterOptions[0]?.id ?? null;
  const selectedPet = selectedPetId ? petsById.get(selectedPetId) : undefined;

  return (
    <Screen scrollable tabBarInset>
      <AppTopBar title="Ana Sayfa" />

      <View className="mb-5 gap-1">
        <Text accessibilityRole="header" className="text-3xl font-bold text-ink-900">
          Merhaba
        </Text>
        <Text className="text-base text-ink-500">
          Yakındaki yerler ve dostlarının hatırlatmaları burada.
        </Text>
      </View>

      <View className="gap-8">
        <NearbyPlacesSection />

        {pets.isPending ? (
          <LoadingState label="Dostların yükleniyor…" />
        ) : pets.isError ? (
          <ErrorState
            description={toUserFacingError(pets.error).message}
            onRetry={() => void pets.refetch()}
          />
        ) : hasPets ? (
          <View className="gap-5">
            <FilterChips
              options={filterOptions}
              value={selectedPetId ?? ''}
              onChange={setFilterPetId}
            />

            <View className="gap-0.5">
              <Text className="text-lg font-bold text-ink-900">Yaklaşan Hatırlatmalar</Text>
              {selectedPet ? (
                <Text className="text-sm text-ink-500">
                  {selectedPet.name} · {SPECIES_LABELS[selectedPet.species]} · önümüzdeki 3 gün
                </Text>
              ) : null}
            </View>

            <HomeReminderList
              filterPetId={selectedPetId}
              emptyLabel={
                selectedPet
                  ? `${selectedPet.name} için önümüzdeki 3 günde hatırlatma yok.`
                  : 'Önümüzdeki 3 gün için hatırlatma yok.'
              }
            />
          </View>
        ) : (
          <EmptyState
            title="Henüz bir evcil hayvan eklemedin"
            description="İlk dostunu ekle; sağlık kayıtları, aşılar ve hatırlatmalar otomatik olarak burada toplansın."
            actionLabel="Dostumu ekle"
            onAction={() => router.push('/pet/new')}
          />
        )}
      </View>
    </Screen>
  );
}
