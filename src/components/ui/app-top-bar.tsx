import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { useThemeColors } from '@/constants/theme';

type AppTopBarProps = {
  title: string;
};

export function AppTopBar({ title }: AppTopBarProps) {
  const colors = useThemeColors();
  const router = useRouter();
  return (
    <View className="mb-5 flex-row items-center justify-between">
      <View className="flex-row items-center gap-2.5">
        <View className="h-10 w-10 items-center justify-center rounded-2xl bg-brand-500">
          <Ionicons name="paw" size={18} color={colors.white} />
        </View>
        <Text className="text-lg font-bold text-ink-900">{title}</Text>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Ayarlar"
        hitSlop={8}
        onPress={() => router.push('/settings')}
        className="h-10 w-10 items-center justify-center rounded-2xl border border-surface-sunken bg-surface">
        <Ionicons name="settings-outline" size={18} color={colors.ink900} />
      </Pressable>
    </View>
  );
}
