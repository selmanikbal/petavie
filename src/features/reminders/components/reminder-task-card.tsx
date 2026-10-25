import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { CARD_CLASS } from '@/components/ui/card';
import { BrandColors } from '@/constants/theme';
import { SPECIES_LABELS } from '@/features/pets/schemas';
import { REMINDER_TYPE_LABELS } from '@/features/reminders/schemas';
import type { Pet, Reminder } from '@/types/database';

const TYPE_ICONS: Record<Reminder['type'], keyof typeof Ionicons.glyphMap> = {
  vaccination: 'medkit-outline',
  medication: 'medical-outline',
  vet: 'business-outline',
  grooming: 'cut-outline',
  other: 'notifications-outline',
};

type ReminderTaskCardProps = {
  reminder: Reminder;
  pet?: Pet;
  active: boolean;
  onComplete: () => void;
};

function formatReminderTime(remindAt: string): string {
  const date = new Date(remindAt);
  if (Number.isNaN(date.getTime())) return '';
  return `${`${date.getHours()}`.padStart(2, '0')}:${`${date.getMinutes()}`.padStart(2, '0')}`;
}

export function ReminderTaskCard({ reminder, pet, active, onComplete }: ReminderTaskCardProps) {
  const router = useRouter();
  const time = formatReminderTime(reminder.remind_at);
  const petLabel = pet ? `${SPECIES_LABELS[pet.species]} (${pet.name})` : 'Dost';
  const icon = TYPE_ICONS[reminder.type];

  return (
    <View className={`${CARD_CLASS} gap-3 ${active ? '' : 'opacity-60'}`}>
      <Pressable
        accessibilityRole="button"
        onPress={() => router.push(`/reminder/${reminder.id}/edit`)}
        className="gap-3 active:opacity-80">
        <View className="flex-row items-start gap-3">
          <View className="h-11 w-11 items-center justify-center rounded-xl bg-brand-100">
            <Ionicons name={icon} size={22} color={BrandColors.brand600} />
          </View>
          <View className="flex-1 gap-1">
            <View className="flex-row items-center justify-between gap-2">
              <View className="rounded-full bg-brand-100 px-2.5 py-0.5">
                <Text className="text-sm font-semibold text-brand-600">{time}</Text>
              </View>
              {active ? (
                <View className="rounded-full bg-brand-100 px-2.5 py-0.5">
                  <Text className="text-xs font-semibold text-brand-600">Bekliyor</Text>
                </View>
              ) : (
                <View className="rounded-full bg-success-50 px-2.5 py-0.5">
                  <Text className="text-xs font-semibold text-success-600">Tamamlandı</Text>
                </View>
              )}
            </View>
            <Text className="text-base font-bold text-ink-900">{reminder.title}</Text>
            <Text className="text-sm text-ink-500">
              {REMINDER_TYPE_LABELS[reminder.type]}
              {reminder.notes ? ` · ${reminder.notes}` : ''}
            </Text>
            <View className="self-start rounded-full border border-surface-sunken bg-surface px-2.5 py-1">
              <Text className="text-xs font-medium text-ink-500">{petLabel}</Text>
            </View>
          </View>
        </View>
      </Pressable>

      {active ? (
        <Pressable
          testID={`reminder-complete-${reminder.id}`}
          accessibilityRole="button"
          accessibilityLabel="Tamamlandı olarak işaretle"
          onPress={onComplete}
          className="items-center rounded-xl bg-brand-500 py-3 active:bg-brand-600">
          <Text className="text-sm font-semibold text-white">Tamamlandı Olarak İşaretle</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
