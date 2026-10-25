import { Stack } from 'expo-router';

/**
 * Pet screens live outside the tabs so the tab bar gets out of the way while
 * you are looking at or editing one pet. `[id]` is its own stack so detail and
 * edit share a back button without a second header from this navigator.
 */
export default function PetLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="new" />
      <Stack.Screen name="[id]" />
    </Stack>
  );
}
