import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, Text, View } from 'react-native';
import type { EdgeInsets } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useThemeColors, TabBarLayout } from '@/constants/theme';

type TabRoute = { key: string; name: string; params?: object };

type AppTabBarProps = {
  state: { index: number; routes: TabRoute[] };
  descriptors: Record<
    string,
    {
      options: {
        title?: string;
        tabBarAccessibilityLabel?: string;
        tabBarButtonTestID?: string;
      };
    }
  >;
  emitter: {
    emit: (event: {
      type: 'tabPress' | 'tabLongPress';
      target: string;
      canPreventDefault?: boolean;
    }) => unknown;
  };
  navigateToTab: (routeKey: string) => void;
  insets: EdgeInsets;
};

const TAB_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  index: 'home-outline',
  pets: 'paw-outline',
  reminders: 'notifications-outline',
  community: 'book-outline',
};

const TAB_ICONS_FOCUSED: Record<string, keyof typeof Ionicons.glyphMap> = {
  index: 'home',
  pets: 'paw',
  reminders: 'notifications',
  community: 'book',
};

/** Floating tab bar: inset from screen edges, rounded pill, teal active indicator. */
export function AppTabBar({ state, descriptors, emitter, navigateToTab }: AppTabBarProps) {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const bottomPad = Math.max(insets.bottom, 8) + TabBarLayout.bottomGap;

  return (
    <View
      pointerEvents="box-none"
      style={{
        paddingHorizontal: TabBarLayout.horizontalGap,
        paddingBottom: bottomPad,
      }}>
      <View
        pointerEvents="auto"
        className="h-16 flex-row items-center rounded-2xl border border-surface-sunken bg-surface px-1 shadow-sm">
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const label = options.title ?? route.name;
          const iconColor = isFocused ? colors.brand500 : colors.ink500;
          const iconName = isFocused
            ? (TAB_ICONS_FOCUSED[route.name] ?? 'ellipse')
            : (TAB_ICONS[route.name] ?? 'ellipse-outline');

          const onPress = () => {
            const event = emitter.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            }) as { defaultPrevented?: boolean };

            if (!isFocused && !event.defaultPrevented) {
              navigateToTab(route.key);
            }
          };

          const onLongPress = () => {
            emitter.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel ?? label}
              testID={options.tabBarButtonTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              className="flex-1 items-center gap-0.5 active:opacity-70">
              <View
                className={`h-9 w-9 items-center justify-center rounded-full ${
                  isFocused ? 'bg-brand-100' : ''
                }`}>
                <Ionicons name={iconName} size={22} color={iconColor} />
              </View>
              <Text
                className={`text-[11px] ${
                  isFocused ? 'font-semibold text-brand-500' : 'font-medium text-ink-500'
                }`}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
