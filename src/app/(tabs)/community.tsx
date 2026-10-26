import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppTopBar } from '@/components/ui/app-top-bar';
import { CARD_CLASS } from '@/components/ui/card';
import { FilterChips } from '@/components/ui/filter-chips';
import { SearchField } from '@/components/ui/search-field';
import { EmptyState } from '@/components/ui/state-views';
import { useThemeColors, tabBarScrollInset } from '@/constants/theme';
import { AnimalGuideCard } from '@/features/guide/components/animal-guide-card';
import { ALL_ANIMAL_CATEGORIES, GUIDE_IMAGE_CREDIT } from '@/features/guide/constants';
import { getGuideMeta, listGuideAnimals, listGuideCategories } from '@/features/guide/service';
import { filterGuideAnimals } from '@/features/guide/utils';

export default function CommunityScreen() {
  const colors = useThemeColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const animals = listGuideAnimals();
  const meta = getGuideMeta();
  const [category, setCategory] = useState(ALL_ANIMAL_CATEGORIES);
  const [query, setQuery] = useState('');

  const filterOptions = useMemo(
    () => [
      { id: ALL_ANIMAL_CATEGORIES, label: 'Tümü' },
      ...listGuideCategories().map((label) => ({ id: label, label })),
    ],
    [],
  );

  const visibleAnimals = useMemo(
    () => filterGuideAnimals(animals, category, query),
    [animals, category, query],
  );
  const hasQuery = query.trim().length > 0;

  return (
    <SafeAreaView className="flex-1 bg-surface-canvas" edges={['top']}>
      <View className="w-full max-w-[560px] flex-1 self-center px-4 pt-6">
        <AppTopBar title="Rehber" />
        <View className="mb-4 gap-1">
          <Text accessibilityRole="header" className="text-3xl font-bold text-ink-900">
            Rehber
          </Text>
          <Text className="text-base text-ink-500">
            {animals.length} hayvan türü için bakım, ipucu ve sık sorulanlar.
          </Text>
        </View>

        <View className="gap-3 pb-4">
          <SearchField
            value={query}
            onChangeText={setQuery}
            placeholder="Hayvan ara"
            accessibilityLabel="Hayvan ara"
          />
          <FilterChips options={filterOptions} value={category} onChange={setCategory} />
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: tabBarScrollInset(insets.bottom) }}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}>
          <View className="gap-3">
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Genel bilgiler, tüm türler için bakım önerileri ve sık sorulanlar"
              onPress={() => router.push('/guide/general')}
              className={`${CARD_CLASS} flex-row items-center gap-3 active:opacity-90`}>
              <View className="h-16 w-16 items-center justify-center rounded-2xl bg-brand-100">
                <Ionicons name="book" size={22} color={colors.brand600} />
              </View>
              <View className="min-w-0 flex-1 gap-0.5">
                <Text className="text-base font-semibold text-ink-900">Genel bilgiler</Text>
                <Text className="text-sm text-ink-500" numberOfLines={1}>
                  Tüm türler · bakım önerileri ve SSS
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.ink500} />
            </Pressable>

            {visibleAnimals.length === 0 ? (
              <EmptyState
                title={hasQuery ? 'Eşleşen tür yok' : 'Bu grupta tür yok'}
                description={
                  hasQuery
                    ? 'Aramayı veya kategoriyi değiştirip tekrar dene.'
                    : 'Başka bir kategori seçip tekrar dene.'
                }
              />
            ) : (
              visibleAnimals.map((animal) => (
                <AnimalGuideCard
                  key={animal.id}
                  animal={animal}
                  onPress={() => router.push(`/guide/${animal.id}`)}
                />
              ))
            )}
          </View>

          <Text className="mt-5 text-sm leading-5 text-ink-500">{meta.disclaimer}</Text>
          <Text className="mt-2 text-xs leading-4 text-ink-500">{GUIDE_IMAGE_CREDIT}</Text>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
