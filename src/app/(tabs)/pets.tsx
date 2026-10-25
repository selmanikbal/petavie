import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';

import { AppTopBar } from '@/components/ui/app-top-bar';
import { PrimaryActionButton } from '@/components/ui/primary-action-button';
import { PromoBanner } from '@/components/ui/promo-banner';
import { Screen } from '@/components/ui/screen';
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/state-views';
import { PetList } from '@/features/pets/components/pet-list';
import { usePets } from '@/features/pets/hooks/use-pets';
import { toUserFacingError } from '@/utils/errors';

export default function PetsScreen() {
  const router = useRouter();
  const pets = usePets();
  const rows = pets.data ?? [];
  const hasPets = rows.length > 0;
  const count = rows.length;

  return (
    <Screen scrollable={hasPets} tabBarInset>
      <AppTopBar title="Pets" />

      <View className="mb-5 flex-row items-start justify-between gap-4">
        <View className="flex-1 gap-1">
          <View className="flex-row items-center gap-2">
            <Text accessibilityRole="header" className="text-3xl font-bold text-ink-900">
              Dostlarım
            </Text>
            {hasPets ? (
              <View className="rounded-full bg-brand-100 px-2.5 py-0.5">
                <Text className="text-sm font-bold text-brand-600">{count}</Text>
              </View>
            ) : null}
          </View>
          <Text className="text-base text-ink-500">
            {hasPets
              ? `${count} evcil hayvan kayıtlı`
              : 'Henüz kayıtlı evcil hayvan yok.'}
          </Text>
        </View>
        {hasPets ? (
          <PrimaryActionButton
            testID="pet-add"
            label="Yeni Dost"
            compact
            onPress={() => router.push('/pet/new')}
          />
        ) : null}
      </View>

      {pets.isPending ? (
        <LoadingState label="Dostların yükleniyor…" />
      ) : pets.isError ? (
        <ErrorState
          description={toUserFacingError(pets.error).message}
          onRetry={() => void pets.refetch()}
        />
      ) : hasPets ? (
        <View className="gap-4">
          <PetList pets={rows} />
          <PromoBanner
            title="Bakım Takvimini Senkronize Et"
            description="Hatırlatmalarını takvimde bir arada gör."
            onPress={() => router.push('/(tabs)/reminders')}
          />
        </View>
      ) : (
        <View className="min-h-[320px] flex-1 gap-4">
          <EmptyState
            title="Liste henüz boş"
            description="İlk dostunu ekle; bilgileri, fotoğrafı ve sağlık kayıtları burada toplanır."
            actionLabel="Dostumu ekle"
            onAction={() => router.push('/pet/new')}
          />
        </View>
      )}
    </Screen>
  );
}
