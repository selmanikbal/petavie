import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { CARD_CLASS } from '@/components/ui/card';
import { useThemeColors } from '@/constants/theme';
import { useVaccinations } from '@/features/health/hooks/use-vaccinations';
import { GENDER_LABELS, SPECIES_LABELS } from '@/features/pets/schemas';
import {
  getLastVaccinationLabel,
  getVaccinationStatus,
} from '@/features/pets/vaccination-status';
import { formatPetAgeDetailed, formatPetWeight } from '@/features/pets/utils';
import type { Pet } from '@/types/database';

type PetCardProps = {
  pet: Pet;
  onPress: () => void;
  testID?: string;
};

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-1 rounded-xl bg-surface-tint px-3 py-2.5">
      <Text className="text-xs text-ink-500">{label}</Text>
      <Text className="text-sm font-bold text-ink-900">{value}</Text>
    </View>
  );
}

export function PetCard({ pet, onPress, testID }: PetCardProps) {
  const colors = useThemeColors();
  const vaccinations = useVaccinations(pet.id);
  const weight = formatPetWeight(pet.weight_kg);
  const age = formatPetAgeDetailed(pet.birth_date);
  const gender = GENDER_LABELS[pet.gender];
  const status = vaccinations.data ? getVaccinationStatus(vaccinations.data) : null;
  const lastVaccine = vaccinations.data ? getLastVaccinationLabel(vaccinations.data) : null;
  const subtitle = pet.description
    ? `${SPECIES_LABELS[pet.species]} • ${pet.description}`
    : SPECIES_LABELS[pet.species];

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={`${pet.name}, ${subtitle}`}
      onPress={onPress}
      className={`${CARD_CLASS} gap-4 active:opacity-95`}>
      <View className="flex-row gap-3">
        <View className="h-24 w-24 overflow-hidden rounded-2xl bg-surface-tint">
          {pet.avatar_url ? (
            <Image
              source={{ uri: pet.avatar_url }}
              style={{ width: '100%', height: '100%' }}
              contentFit="cover"
            />
          ) : (
            <View className="flex-1 items-center justify-center">
              <Ionicons name="paw" size={28} color={colors.brand500} />
            </View>
          )}
        </View>

        <View className="flex-1 gap-2">
          <View className="flex-row items-start justify-between gap-2">
            <View className="flex-1 gap-0.5">
              <Text className="text-xl font-bold text-ink-900" numberOfLines={1}>
                {pet.name}
              </Text>
              <Text className="text-sm text-ink-500" numberOfLines={1}>
                {subtitle}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.ink500} />
          </View>

          {vaccinations.isPending ? (
            <ActivityIndicator size="small" color={colors.brand500} />
          ) : status ? (
            <View
              className={`self-start flex-row items-center gap-1.5 rounded-full px-2.5 py-1 ${
                status.tone === 'success' ? 'bg-success-50' : 'bg-danger-50'
              }`}>
              <View
                className={`h-2 w-2 rounded-full ${
                  status.tone === 'success' ? 'bg-success-500' : 'bg-danger-500'
                }`}
              />
              <Text
                className={`text-xs font-semibold ${
                  status.tone === 'success' ? 'text-success-600' : 'text-danger-500'
                }`}>
                {status.label}
              </Text>
            </View>
          ) : null}
        </View>
      </View>

      <View className="flex-row gap-2">
        {age ? <StatBox label="Yaş" value={age} /> : null}
        {weight ? <StatBox label="Kilo" value={weight} /> : null}
        <StatBox label="Cinsiyet" value={gender} />
      </View>

      {lastVaccine ? (
        <View className="flex-row items-center justify-between gap-3 border-t border-surface-sunken pt-3">
          <View className="flex-1 flex-row items-center gap-2">
            <Ionicons name="calendar-outline" size={16} color={colors.ink500} />
            <Text className="flex-1 text-sm text-ink-500" numberOfLines={1}>
              {lastVaccine}
            </Text>
          </View>
          <Text className="text-sm font-semibold text-brand-600">Detaylar</Text>
        </View>
      ) : null}
    </Pressable>
  );
}
