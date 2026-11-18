import { useFocusEffect } from 'expo-router';
import { useCallback, useRef } from 'react';
import { BackHandler, Platform, ToastAndroid } from 'react-native';

const EXIT_WINDOW_MS = 2000;

/**
 * Android: on the home screen the first back press shows a hint and only a
 * second press within 2 seconds closes the app.
 */
export function useDoubleBackToExit() {
  const lastPressRef = useRef(0);

  useFocusEffect(
    useCallback(() => {
      if (Platform.OS !== 'android') return undefined;

      const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
        const now = Date.now();
        if (now - lastPressRef.current < EXIT_WINDOW_MS) {
          return false; // default behaviour: leave the app
        }
        lastPressRef.current = now;
        ToastAndroid.show('Çıkmak için tekrar geri tuşuna bas', ToastAndroid.SHORT);
        return true;
      });

      return () => subscription.remove();
    }, []),
  );
}
