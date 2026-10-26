import * as SystemUI from 'expo-system-ui';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';

import { useThemeColors } from '@/constants/theme';
import {
  applyThemePreference,
  loadThemePreference,
} from '@/features/settings/theme-preference';

/** Restores the saved theme and keeps the native root background in sync. */
export function ThemeSetup() {
  const scheme = useColorScheme();
  const colors = useThemeColors();

  useEffect(() => {
    void loadThemePreference().then((preference) => {
      if (preference !== 'system') applyThemePreference(preference);
    });
  }, []);

  useEffect(() => {
    void SystemUI.setBackgroundColorAsync(colors.surfaceCanvas).catch(() => undefined);
  }, [scheme, colors.surfaceCanvas]);

  return null;
}
