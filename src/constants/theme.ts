/**
 * Brand colors for APIs that cannot take a className
 * (tab bar options, ActivityIndicator, status bar, native pickers).
 *
 * Keep these in sync with `tailwind.config.js`; that file is the source of
 * truth for styling inside components.
 */
export const BrandColors = {
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
} as const;

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
