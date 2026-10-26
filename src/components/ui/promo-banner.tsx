import Ionicons from '@expo/vector-icons/Ionicons';
import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';

import { useThemeColors } from '@/constants/theme';

type PromoBannerProps = {
  title: string;
  description?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  trailing?: ReactNode;
};

export function PromoBanner({
  title,
  description,
  icon = 'calendar-outline',
  onPress,
  trailing,
}: PromoBannerProps) {
  const colors = useThemeColors();
  const content = (
    <>
      <View className="h-11 w-11 items-center justify-center rounded-xl bg-brand-100">
        <Ionicons name={icon} size={22} color={colors.brand600} />
      </View>
      <View className="flex-1 gap-0.5">
        <Text className="text-base font-semibold text-ink-900">{title}</Text>
        {description ? <Text className="text-sm text-ink-500">{description}</Text> : null}
      </View>
      {trailing}
    </>
  );

  const className =
    'flex-row items-center gap-3 rounded-2xl border border-surface-sunken bg-surface p-4 shadow-sm';

  if (!onPress) {
    return <View className={className}>{content}</View>;
  }

  return (
    <Pressable accessibilityRole="button" onPress={onPress} className={`${className} active:opacity-90`}>
      {content}
    </Pressable>
  );
}
