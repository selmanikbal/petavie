import { Stack } from 'expo-router';

export default function PetIdLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="edit" />
      <Stack.Screen name="weight/new" />
      <Stack.Screen name="health/new" />
      <Stack.Screen name="health/[recordId]/edit" />
      <Stack.Screen name="vaccination/new" />
      <Stack.Screen name="vaccination/[vaccinationId]/edit" />
      <Stack.Screen name="medication/new" />
      <Stack.Screen name="medication/[medicationId]/edit" />
    </Stack>
  );
}
