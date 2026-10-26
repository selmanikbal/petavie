import { useColorScheme } from 'react-native';

/**
 * Colors for APIs that cannot take a className
 * (icons, ActivityIndicator, placeholders, native pickers).
 *
 * Keep these in sync with the CSS variables in `src/global.css`; that file is
 * the source of truth for styling inside components.
 */
export const LightColors = {
  brand500: '#14b8a6',
  brand600: '#0d9488',
  brand100: '#ccfbf1',
  ink500: '#64748b',
  ink900: '#0f172a',
  surface: '#ffffff',
  surfaceCanvas: '#f8fafc',
  surfaceTint: '#ccfbf1',
  surfaceSunken: '#e2e8f0',
  placeholder: '#94a3b8',
  white: '#ffffff',
  success500: '#10b981',
  danger500: '#ef4444',
};

export type ThemeColors = typeof LightColors;

export const DarkColors: ThemeColors = {
  brand500: '#14b8a6',
  brand600: '#2dd4bf',
  brand100: '#134e4a',
  ink500: '#94a3b8',
  ink900: '#f1f5f9',
  surface: '#1e293b',
  surfaceCanvas: '#0f172a',
  surfaceTint: '#134e4a',
  surfaceSunken: '#334155',
  placeholder: '#64748b',
  white: '#ffffff',
  success500: '#10b981',
  danger500: '#f87171',
};

/** Theme-aware colors; re-renders when the system or in-app theme changes. */
export function useThemeColors(): ThemeColors {
  return useColorScheme() === 'dark' ? DarkColors : LightColors;
}

/** Active scheme for native pickers (`themeVariant`) and other platform APIs. */
export function useThemeScheme(): 'light' | 'dark' {
  return useColorScheme() === 'dark' ? 'dark' : 'light';
}

/** @deprecated Light palette only — use `useThemeColors()` inside components. */
export const BrandColors = LightColors;

/** Floating tab bar layout — keep in sync with `AppTabBar`. */
export const TabBarLayout = {
  height: 64,
  bottomGap: 12,
  horizontalGap: 16,
  scrollBuffer: 12,
} as const;

export function tabBarScrollInset(safeAreaBottom: number): number {
  return (
    TabBarLayout.height +
    TabBarLayout.bottomGap +
    TabBarLayout.scrollBuffer +
    safeAreaBottom
  );
}
