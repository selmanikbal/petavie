import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, Text, View } from 'react-native';

import { useThemeColors } from '@/constants/theme';
import { NEARBY_CATEGORY_LABELS } from '@/features/nearby/constants';
import { openPlaceInMaps } from '@/features/nearby/service';
import type { NearbyPlace } from '@/features/nearby/types';
import { formatDistanceMeters } from '@/features/nearby/utils';

const CATEGORY_ICONS: Record<
  NearbyPlace['category'],
  keyof typeof Ionicons.glyphMap
> = {
  veterinary: 'medkit-outline',
  pet_shop: 'storefront-outline',
  pet_grooming: 'cut-outline',
};

type NearbyPlaceCardProps = {
  place: NearbyPlace;
};

export function NearbyPlaceCard({ place }: NearbyPlaceCardProps) {
  const colors = useThemeColors();
  const icon = CATEGORY_ICONS[place.category];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${place.name}, ${formatDistanceMeters(place.distanceMeters)}`}
      onPress={() => openPlaceInMaps(place)}
      className="flex-row items-center gap-3 rounded-xl border border-surface-sunken bg-surface px-3 py-2.5 active:opacity-90">
      <View className="h-8 w-8 items-center justify-center rounded-lg bg-brand-100">
        <Ionicons name={icon} size={16} color={colors.brand600} />
      </View>

      <View className="min-w-0 flex-1 gap-0.5">
        <Text className="text-sm font-semibold text-ink-900" numberOfLines={1}>
          {place.name}
        </Text>
        <Text className="text-xs text-ink-500" numberOfLines={1}>
          {NEARBY_CATEGORY_LABELS[place.category]}
          {place.address ? ` · ${place.address}` : ''}
        </Text>
      </View>

      <View className="items-end gap-0.5">
        <Text className="text-xs font-semibold text-brand-600">
          {formatDistanceMeters(place.distanceMeters)}
        </Text>
        <Ionicons name="navigate-outline" size={14} color={colors.ink500} />
      </View>
    </Pressable>
  );
}
