import { usePreventRemove } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert } from 'react-native';

/**
 * Asks for confirmation before leaving a form with unsaved changes
 * (back button, swipe back, Android hardware back).
 *
 * Returns a wrapper for the submit handler: a submitted form may leave
 * without the prompt. A failed save (new `errorMessage`) re-arms the guard.
 */
export function useUnsavedChangesGuard(isDirty: boolean, errorMessage?: string) {
  const [leaveAllowed, setLeaveAllowed] = useState(false);
  const [lastError, setLastError] = useState(errorMessage);

  // A new save error means the user stays on the form: re-arm the guard.
  if (errorMessage !== lastError) {
    setLastError(errorMessage);
    if (errorMessage) setLeaveAllowed(false);
  }

  const disablePrevention = usePreventRemove(isDirty && !leaveAllowed, ({ repeat }) => {
    Alert.alert(
      'Değişiklikler kaydedilmedi',
      'Çıkarsan girdiğin bilgiler kaybolacak.',
      [
        { text: 'Düzenlemeye devam et', style: 'cancel' },
        {
          text: 'Çık',
          style: 'destructive',
          onPress: () => {
            setLeaveAllowed(true);
            repeat();
          },
        },
      ],
      { cancelable: true },
    );
  });

  return useCallback(
    <T>(submit: (values: T) => void) =>
      (values: T) => {
        setLeaveAllowed(true);
        disablePrevention();
        submit(values);
      },
    [disablePrevention],
  );
}
