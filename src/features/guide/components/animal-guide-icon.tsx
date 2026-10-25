import { Text, View } from 'react-native';

import { getAnimalGuideEmoji } from '@/features/guide/animal-icons';

type AnimalGuideIconProps = {
  animalId: string;
  animalName: string;
};

export function AnimalGuideIcon({ animalId, animalName }: AnimalGuideIconProps) {
  const emoji = getAnimalGuideEmoji(animalId);

  return (
    <View
      accessibilityLabel={`${animalName} simgesi`}
      className="h-16 w-16 items-center justify-center rounded-2xl bg-surface-tint">
      <Text className="text-[34px] leading-[38px]" accessibilityElementsHidden importantForAccessibility="no">
        {emoji}
      </Text>
    </View>
  );
}
