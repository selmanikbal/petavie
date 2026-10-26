import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { Avatar } from '@/components/ui/avatar';
import { pickPetAvatarUri } from '@/features/pets/photos/prepare';
import { toUserFacingError } from '@/utils/errors';

type PetAvatarDraftProps = {
  name?: string;
  value: string | null;
  onChange: (uri: string | null) => void;
};

/** Avatar picker for the create-pet form — stores a local uri until the pet is saved. */
export function PetAvatarDraft({ name, value, onChange }: PetAvatarDraftProps) {
  const [isPicking, setIsPicking] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handlePress() {
    if (isPicking) return;

    setErrorMessage(null);
    setIsPicking(true);
    try {
      const uri = await pickPetAvatarUri();
      if (uri) onChange(uri);
    } catch (error) {
      setErrorMessage(toUserFacingError(error).message);
    } finally {
      setIsPicking(false);
    }
  }

  return (
    <View className="items-center gap-2">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={value ? 'Fotoğrafı değiştir' : 'Fotoğraf ekle'}
        onPress={() => void handlePress()}
        disabled={isPicking}
        className="relative h-[7.75rem] w-[7.75rem] items-center justify-center">
        <Avatar uri={value} name={name || 'D'} size="lg" />
        <View className="absolute bottom-1 right-1 h-10 w-10 items-center justify-center rounded-full border-2 border-surface bg-brand-solid shadow-sm">
          {isPicking ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Ionicons name="camera" size={18} color="#fff" />
          )}
        </View>
      </Pressable>
      <Text className="text-sm text-ink-500">
        {isPicking ? 'Seçiliyor…' : value ? 'Fotoğrafı değiştir' : 'Fotoğraf ekle (isteğe bağlı)'}
      </Text>
      {errorMessage ? <Text className="text-sm text-danger-500">{errorMessage}</Text> : null}
    </View>
  );
}
