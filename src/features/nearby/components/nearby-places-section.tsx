import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { FilterChips } from '@/components/ui/filter-chips';
import { useThemeColors } from '@/constants/theme';
import { NEARBY_CATEGORIES, NEARBY_CATEGORY_LABELS } from '@/features/nearby/constants';
import { NearbyPlaceCard } from '@/features/nearby/components/nearby-place-card';
import { useNearbyPlaces } from '@/features/nearby/hooks/use-nearby-places';
import type { NearbyPlaceCategory } from '@/features/nearby/types';
import { toUserFacingError } from '@/utils/errors';

const categoryOptions = NEARBY_CATEGORIES.map((id) => ({
  id,
  label: NEARBY_CATEGORY_LABELS[id],
}));

export function NearbyPlacesSection() {
  const colors = useThemeColors();
  const [category, setCategory] = useState<NearbyPlaceCategory>('veterinary');
  const { location, places } = useNearbyPlaces(category);

  return (
    <View className="gap-3">
      <View className="gap-0.5">
        <Text className="text-lg font-bold text-ink-900">Yakınımdaki Yerler</Text>
        <Text className="text-sm text-ink-500">Konumuna göre 5 km içindeki işletmeler</Text>
      </View>

      <FilterChips
        options={categoryOptions}
        value={category}
        onChange={(id) => setCategory(id as NearbyPlaceCategory)}
      />

      {location.isPending ? (
        <View className="items-center gap-2 py-6">
          <ActivityIndicator color={colors.brand500} />
          <Text className="text-sm text-ink-500">Konumun alınıyor…</Text>
        </View>
      ) : location.isError ? (
        <View className="gap-2 rounded-xl border border-surface-sunken bg-surface px-4 py-3">
          <Text className="text-sm text-ink-500">
            {toUserFacingError(location.error).message}
          </Text>
          <Pressable accessibilityRole="button" onPress={() => void location.refetch()}>
            <Text className="text-sm font-semibold text-brand-600">Tekrar dene</Text>
          </Pressable>
        </View>
      ) : places.isPending ? (
        <View className="items-center gap-2 py-6">
          <ActivityIndicator color={colors.brand500} />
          <Text className="text-sm text-ink-500">Yakındaki yerler aranıyor…</Text>
        </View>
      ) : places.isError ? (
        <View className="gap-2 rounded-xl border border-surface-sunken bg-surface px-4 py-3">
          <Text className="text-sm text-ink-500">
            {toUserFacingError(places.error).message}
          </Text>
          <Pressable accessibilityRole="button" onPress={() => void places.refetch()}>
            <Text className="text-sm font-semibold text-brand-600">Tekrar dene</Text>
          </Pressable>
        </View>
      ) : places.data && places.data.length > 0 ? (
        <View className="gap-2">
          {places.data.map((place) => (
            <NearbyPlaceCard key={place.id} place={place} />
          ))}
        </View>
      ) : (
        <Text className="text-sm text-ink-500">
          Bu kategoride yakınınızda kayıtlı bir işletme bulunamadı.
        </Text>
      )}
    </View>
  );
}
