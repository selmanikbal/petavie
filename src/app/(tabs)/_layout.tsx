import { Tabs } from 'expo-router';

import { AppTabBar } from '@/components/navigation/app-tab-bar';

/**
 * Main app shell. Health lives inside a pet's detail screen (Phase 3), so the
 * tab bar stays at four destinations.
 */
export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <AppTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
          height: 'auto',
        },
        tabBarHideOnKeyboard: true,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Ana Sayfa',
        }}
      />
      <Tabs.Screen
        name="pets"
        options={{
          title: 'Dostlarım',
        }}
      />
      <Tabs.Screen
        name="reminders"
        options={{
          title: 'Hatırlatma',
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: 'Rehber',
        }}
      />
    </Tabs>
  );
}
