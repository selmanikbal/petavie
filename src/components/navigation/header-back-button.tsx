import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { Platform, Pressable, Text } from 'react-native';

import { useThemeColors } from '@/constants/theme';

type HeaderBackButtonProps = {
  label?: string;
  /** Dairesel ikon butonu — stack ekran başlıklarında kullanılır. */
  iconOnly?: boolean;
};

export function HeaderBackButton({
  label = 'Geri',
  iconOnly = false,
}: HeaderBackButtonProps) {
  const colors = useThemeColors();
  const router = useRouter();

  function handlePress() {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/(tabs)');
  }

  if (iconOnly) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        onPress={handlePress}
        hitSlop={8}
        className="h-10 w-10 items-center justify-center rounded-full bg-surface-tint active:opacity-80">
        <Ionicons name="chevron-back" size={20} color={colors.ink900} />
      </Pressable>
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={handlePress}
      hitSlop={8}
      className="flex-row items-center py-1 pr-2"
      style={{ marginLeft: Platform.OS === 'ios' ? -8 : 0 }}>
      <Ionicons
        name={Platform.OS === 'ios' ? 'chevron-back' : 'arrow-back'}
        size={24}
        color={colors.ink900}
      />
      {Platform.OS === 'ios' ? <Text className="text-base text-ink-900">{label}</Text> : null}
    </Pressable>
  );
}
