import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { BrandColors } from '@/constants/theme';
import {
  daysUntilOccurrence,
  formatOccurrenceTime,
  formatUpcomingDayLabel,
} from '@/features/reminders/home-reminder-utils';
import { REMINDER_TYPE_LABELS } from '@/features/reminders/schemas';
import type { Reminder } from '@/types/database';

const TYPE_ICONS: Record<Reminder['type'], keyof typeof Ionicons.glyphMap> = {
  vaccination: 'medkit-outline',
  medication: 'medical-outline',
  vet: 'business-outline',
  grooming: 'cut-outline',
  other: 'notifications-outline',
};

type ReminderCompactCardProps = {
  reminder: Reminder;
  occurrenceAt: Date;
  onComplete?: () => void;
  completing?: boolean;
};

export function ReminderCompactCard({
  reminder,
  occurrenceAt,
  onComplete,
  completing = false,
}: ReminderCompactCardProps) {
  const router = useRouter();
  const daysUntil = daysUntilOccurrence(new Date(), occurrenceAt);
  const dayLabel = formatUpcomingDayLabel(daysUntil);
  const isTomorrow = daysUntil === 1;
  const time = formatOccurrenceTime(occurrenceAt);
  const icon = TYPE_ICONS[reminder.type];

  return (
    <View className="flex-row items-center gap-2 rounded-xl border border-surface-sunken bg-surface px-3 py-2.5">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${reminder.title}, ${dayLabel} ${time}`}
        onPress={() => router.push(`/reminder/${reminder.id}/edit`)}
        className="min-w-0 flex-1 flex-row items-center gap-3 active:opacity-80">
        <View className="h-8 w-8 items-center justify-center rounded-lg bg-brand-100">
          <Ionicons name={icon} size={16} color={BrandColors.brand600} />
        </View>

        <View className="min-w-0 flex-1 gap-0.5">
          <Text className="text-sm font-semibold text-ink-900" numberOfLines={1}>
            {reminder.title}
          </Text>
          <Text className="text-xs text-ink-500" numberOfLines={1}>
            {REMINDER_TYPE_LABELS[reminder.type]} · {time}
          </Text>
        </View>

        <Text
          className={`shrink-0 text-xs font-semibold ${
            isTomorrow ? 'text-danger-500' : daysUntil === 0 ? 'text-brand-600' : 'text-ink-500'
          }`}>
          {dayLabel}
        </Text>
      </Pressable>

      {onComplete ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Tamamlandı olarak işaretle"
          disabled={completing}
          onPress={onComplete}
          className="h-8 w-8 items-center justify-center rounded-full bg-brand-100 active:bg-brand-200">
          {completing ? (
            <ActivityIndicator size="small" color={BrandColors.brand600} />
          ) : (
            <Ionicons name="checkmark" size={18} color={BrandColors.brand600} />
          )}
        </Pressable>
      ) : null}
    </View>
  );
}
