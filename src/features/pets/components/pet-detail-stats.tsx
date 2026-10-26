import Ionicons from '@expo/vector-icons/Ionicons';
import { Text, View } from 'react-native';

import { useThemeColors } from '@/constants/theme';
import { GENDER_LABELS, SPECIES_LABELS } from '@/features/pets/schemas';
import { formatPetAgeDetailed, formatPetWeight } from '@/features/pets/utils';
import type { Pet } from '@/types/database';

type PetDetailStatsProps = {
  pet: Pet;
};

function StatCard({
  icon,
  label,
  value,
  hint,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  hint?: string;
}) {
  const colors = useThemeColors();
  return (
    <View className="min-h-[112px] flex-1 rounded-2xl border border-surface-sunken bg-surface p-4">
      <View className="mb-3 h-9 w-9 items-center justify-center rounded-xl bg-brand-50">
        <Ionicons name={icon} size={18} color={colors.brand600} />
      </View>
      <Text className="text-xs text-ink-500">{label}</Text>
      <Text className="text-lg font-bold text-ink-900">{value}</Text>
      {hint ? <Text className="mt-1 text-xs text-ink-500">{hint}</Text> : null}
    </View>
  );
}

export function PetDetailStats({ pet }: PetDetailStatsProps) {
  return (
    <View className="gap-3">
      <View className="flex-row gap-3">
        <StatCard
          icon="scale-outline"
          label="Ağırlık"
          value={formatPetWeight(pet.weight_kg) ?? '—'}
          hint="Güncel kayıt"
        />
        <StatCard
          icon="calendar-outline"
          label="Yaş"
          value={formatPetAgeDetailed(pet.birth_date) ?? '—'}
        />
      </View>
      <View className="flex-row gap-3">
        <StatCard icon="male-female-outline" label="Cinsiyet" value={GENDER_LABELS[pet.gender]} />
        <StatCard icon="paw-outline" label="Tür" value={SPECIES_LABELS[pet.species]} />
      </View>
    </View>
  );
}
