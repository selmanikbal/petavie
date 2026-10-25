import Ionicons from '@expo/vector-icons/Ionicons';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { Avatar } from '@/components/ui/avatar';
import { usePetAvatarUpload } from '@/features/pets/hooks/use-pet-avatar-upload';
import type { Pet } from '@/types/database';

type PetAvatarPickerProps = {
  pet: Pet;
};

export function PetAvatarPicker({ pet }: PetAvatarPickerProps) {
  const { pickAndUpload, isPending, errorMessage } = usePetAvatarUpload(pet.id);

  return (
    <View className="items-center gap-2">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={pet.avatar_url ? 'Fotoğrafı değiştir' : 'Fotoğraf ekle'}
        accessibilityHint="Galeriden seç veya kamera ile çek"
        onPress={() => void pickAndUpload()}
        disabled={isPending}
        className="relative h-[7.75rem] w-[7.75rem] items-center justify-center">
        <Avatar uri={pet.avatar_url} name={pet.name} size="lg" />
        <View className="absolute bottom-1 right-1 h-10 w-10 items-center justify-center rounded-full border-2 border-surface bg-brand-600 shadow-sm">
          {isPending ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Ionicons name="camera" size={18} color="#fff" />
          )}
        </View>
      </Pressable>
      <Text className="text-sm text-ink-500">
        {isPending ? 'Yükleniyor…' : pet.avatar_url ? 'Fotoğrafı değiştir' : 'Fotoğraf ekle'}
      </Text>
      {errorMessage ? <Text className="text-sm text-danger-500">{errorMessage}</Text> : null}
    </View>
  );
}
