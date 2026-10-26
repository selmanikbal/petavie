import Ionicons from '@expo/vector-icons/Ionicons';
import { Alert, Pressable, useColorScheme } from 'react-native';

import { useThemeColors } from '@/constants/theme';
import {
  saveThemePreference,
  THEME_PREFERENCE_LABELS,
  type ThemePreference,
} from '@/features/settings/theme-preference';

const OPTIONS: ThemePreference[] = ['system', 'light', 'dark'];

/** Top-bar button: lets the user pick System / Light / Dark. */
export function ThemeToggleButton() {
  const colors = useThemeColors();
  const isDark = useColorScheme() === 'dark';

  function handlePress() {
    Alert.alert(
      'Görünüm',
      'Uygulamanın temasını seç',
      [
        ...OPTIONS.map((option) => ({
          text: THEME_PREFERENCE_LABELS[option],
          onPress: () => {
            void saveThemePreference(option);
          },
        })),
        { text: 'Vazgeç', style: 'cancel' as const },
      ],
      { cancelable: true },
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Görünümü değiştir"
      hitSlop={8}
      onPress={handlePress}
      className="h-10 w-10 items-center justify-center rounded-2xl border border-surface-sunken bg-surface">
      <Ionicons name={isDark ? 'moon' : 'sunny-outline'} size={18} color={colors.ink900} />
    </Pressable>
  );
}
