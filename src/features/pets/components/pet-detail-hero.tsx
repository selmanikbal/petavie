import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { BrandColors } from '@/constants/theme';
import { usePetAvatarUpload } from '@/features/pets/hooks/use-pet-avatar-upload';
import { GENDER_LABELS, SPECIES_LABELS } from '@/features/pets/schemas';
import { formatPetAgeDetailed } from '@/features/pets/utils';
import type { Pet } from '@/types/database';
import { formatDateTR, fromISODate } from '@/utils/date';

type PetDetailHeroProps = {
  pet: Pet;
};

export function PetDetailHero({ pet }: PetDetailHeroProps) {
  const { pickAndUpload, isPending, errorMessage } = usePetAvatarUpload(pet.id);
  const birthDate = fromISODate(pet.birth_date);
  const age = formatPetAgeDetailed(pet.birth_date);
  const breedLabel = pet.description || SPECIES_LABELS[pet.species];

  return (
    <View className="gap-2">
      <View className="overflow-hidden rounded-3xl border border-surface-sunken bg-surface">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={pet.avatar_url ? 'Fotoğrafı değiştir' : 'Fotoğraf ekle'}
          onPress={() => void pickAndUpload()}
          disabled={isPending}
          className="relative h-56 bg-surface-tint active:opacity-95">
          {pet.avatar_url ? (
            <Image
              source={{ uri: pet.avatar_url }}
              style={{ width: '100%', height: '100%' }}
              contentFit="cover"
            />
          ) : (
            <View className="flex-1 items-center justify-center gap-2 px-6">
              <Ionicons name="paw" size={48} color={BrandColors.brand500} />
              <Text className="text-center text-sm font-medium text-ink-500">
                Fotoğraf eklemek için dokun
              </Text>
            </View>
          )}

          <View className="absolute right-3 top-3 rounded-full bg-success-500 px-3 py-1">
            <Text className="text-xs font-semibold text-white">Sağlık Takipte</Text>
          </View>

          <View
            className="absolute bottom-3 right-3 h-11 w-11 items-center justify-center rounded-full border-2 border-surface bg-brand-600 shadow-sm"
            style={{ zIndex: 10 }}>
            {isPending ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons name="camera" size={20} color="#fff" />
            )}
          </View>
        </Pressable>

        <View className="gap-2 border-t border-surface-sunken px-4 pb-4 pt-4">
          <Text accessibilityRole="header" className="text-3xl font-bold text-ink-900">
            {pet.name}
          </Text>
          <View className="self-start rounded-full bg-brand-100 px-3 py-1">
            <Text className="text-xs font-bold uppercase text-brand-700">{breedLabel}</Text>
          </View>
          <View className="flex-row flex-wrap gap-x-2 gap-y-1">
            <Text className="text-sm text-ink-600">{GENDER_LABELS[pet.gender]}</Text>
            {age ? <Text className="text-sm text-ink-600">• {age}</Text> : null}
            <Text className="text-sm text-ink-500">• #{pet.id.slice(0, 8).toUpperCase()}</Text>
          </View>
        </View>

        <View className="flex-row flex-wrap gap-2 border-t border-surface-sunken p-4">
          <InfoChip icon="male-female-outline" label={GENDER_LABELS[pet.gender]} />
          {birthDate ? (
            <InfoChip icon="calendar-outline" label={formatDateTR(birthDate)} />
          ) : null}
          <InfoChip icon="paw-outline" label={SPECIES_LABELS[pet.species]} />
        </View>
      </View>

      {errorMessage ? <Text className="text-center text-sm text-danger-500">{errorMessage}</Text> : null}
    </View>
  );
}

function InfoChip({ icon, label }: { icon: keyof typeof Ionicons.glyphMap; label: string }) {
  return (
    <View className="flex-row items-center gap-1.5 rounded-full bg-surface-tint px-3 py-2">
      <Ionicons name={icon} size={14} color={BrandColors.brand600} />
      <Text className="text-xs font-medium text-ink-700">{label}</Text>
    </View>
  );
}
