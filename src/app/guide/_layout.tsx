import { Stack } from 'expo-router';

export default function GuideLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="general" />
      <Stack.Screen name="[id]" />
    </Stack>
  );
}
