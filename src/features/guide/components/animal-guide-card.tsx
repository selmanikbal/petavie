import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, Text, View } from 'react-native';

import { CARD_CLASS } from '@/components/ui/card';
import { useThemeColors } from '@/constants/theme';
import { AnimalGuideIcon } from '@/features/guide/components/animal-guide-icon';
import type { GuideAnimal } from '@/features/guide/types';
import { animalGuideSubtitle } from '@/features/guide/utils';

type AnimalGuideCardProps = {
  animal: GuideAnimal;
  onPress: () => void;
};

export function AnimalGuideCard({ animal, onPress }: AnimalGuideCardProps) {
  const colors = useThemeColors();
  const subtitle = animalGuideSubtitle(animal);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${animal.name}, ${subtitle}`}
      onPress={onPress}
      className={`${CARD_CLASS} flex-row items-center gap-3 active:opacity-90`}>
      <AnimalGuideIcon animalId={animal.id} animalName={animal.name} />

      <View className="min-w-0 flex-1 gap-0.5">
        <Text className="text-base font-semibold text-ink-900" numberOfLines={1}>
          {animal.name}
        </Text>
        <Text className="text-sm text-ink-500" numberOfLines={1}>
          {subtitle}
        </Text>
      </View>

      <Ionicons name="chevron-forward" size={18} color={colors.ink500} />
    </Pressable>
  );
}
