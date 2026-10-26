import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';
import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import '@/global.css';

import { AnalyticsEvents } from '@/constants/analytics';
import { useThemeColors } from '@/constants/theme';
import { NotificationSetup } from '@/features/reminders/components/notification-setup';
import { ThemeSetup } from '@/features/settings/components/theme-setup';
import { analytics } from '@/services/analytics';
import { createQueryClient } from '@/services/query/client';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [queryClient] = useState(() => createQueryClient());
  const colors = useThemeColors();
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    analytics.track(AnalyticsEvents.appOpened);
  }, []);

  useEffect(() => {
    // On a font error, continue with the system font instead of hanging on the splash.
    if (fontsLoaded || fontError) {
      void SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeSetup />
          <StatusBar style="auto" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.surfaceCanvas },
            }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="pet" />
            <Stack.Screen name="guide" />
            <Stack.Screen name="reminder" />
          </Stack>
          {/* After Stack: its effects run last, so a notification tap wins over the index redirect. */}
          <NotificationSetup />
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
