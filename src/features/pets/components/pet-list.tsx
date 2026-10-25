import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { PetCard } from '@/features/pets/components/pet-card';
import type { Pet } from '@/types/database';

export function PetList({ pets }: { pets: Pet[] }) {
  const router = useRouter();

  return (
    <View className="gap-3">
      {pets.map((pet) => (
        <PetCard
          key={pet.id}
          testID={`pet-row-${pet.id}`}
          pet={pet}
          onPress={() => router.push(`/pet/${pet.id}`)}
        />
      ))}
    </View>
  );
}
