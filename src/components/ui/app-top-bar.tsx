import Ionicons from '@expo/vector-icons/Ionicons';
import { Text, View } from 'react-native';

import { BrandColors } from '@/constants/theme';

type AppTopBarProps = {
  title: string;
};

export function AppTopBar({ title }: AppTopBarProps) {
  return (
    <View className="mb-5 flex-row items-center justify-between">
      <View className="flex-row items-center gap-2.5">
        <View className="h-10 w-10 items-center justify-center rounded-2xl bg-brand-500">
          <Ionicons name="paw" size={18} color={BrandColors.white} />
        </View>
        <Text className="text-lg font-bold text-ink-900">{title}</Text>
      </View>
    </View>
  );
}
