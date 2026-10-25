import { Stack } from 'expo-router';

export default function ReminderLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="new" />
      <Stack.Screen name="[id]/edit" />
    </Stack>
  );
}
