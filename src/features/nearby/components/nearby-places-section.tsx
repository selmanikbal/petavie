import Ionicons from '@expo/vector-icons/Ionicons';
import { Platform, Pressable, Text, View } from 'react-native';

import { useThemeColors } from '@/constants/theme';
import {
  NEARBY_CATEGORIES,
  NEARBY_CATEGORY_ICONS,
  NEARBY_CATEGORY_LABELS,
} from '@/features/nearby/constants';
import { searchCategoryInMaps } from '@/features/nearby/service';

const MAPS_APP_NAME = Platform.OS === 'ios' ? 'Apple Haritalar' : 'Google Haritalar';

/** Home-screen shortcuts that search nearby pet places in the phone's maps app. */
export function NearbyPlacesSection() {
  const colors = useThemeColors();

  return (
    <View className="gap-3">
      <View className="gap-0.5">
        <Text className="text-lg font-bold text-ink-900">Yakınımdaki Yerler</Text>
        <Text className="text-sm text-ink-500">{MAPS_APP_NAME}'da yakınındakiler açılır</Text>
      </View>

      <View className="flex-row gap-2">
        {NEARBY_CATEGORIES.map((category) => (
          <Pressable
            key={category}
            accessibilityRole="button"
            accessibilityLabel={`${NEARBY_CATEGORY_LABELS[category]} haritada ara`}
            onPress={() => searchCategoryInMaps(category)}
            className="flex-1 items-center gap-2 rounded-2xl border border-surface-sunken bg-surface px-2 py-4 active:opacity-80">
            <View className="h-10 w-10 items-center justify-center rounded-xl bg-brand-50">
              <Ionicons name={NEARBY_CATEGORY_ICONS[category]} size={20} color={colors.brand600} />
            </View>
            <Text className="text-sm font-semibold text-ink-900">
              {NEARBY_CATEGORY_LABELS[category]}
            </Text>
            <View className="flex-row items-center gap-1">
              <Ionicons name="map-outline" size={12} color={colors.ink500} />
              <Text className="text-xs text-ink-500">Haritada gör</Text>
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
