import Ionicons from '@expo/vector-icons/Ionicons';
import { useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';

import { useThemeColors } from '@/constants/theme';
import {
  buildCalendarGrid,
  buildReminderDateIndex,
  getMonthBounds,
} from '@/features/reminders/calendar-utils';
import { isReminderActive } from '@/features/reminders/utils';
import type { Reminder } from '@/types/database';
import { formatMonthYearTR } from '@/utils/date';

const WEEKDAYS_TR = ['Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct', 'Pz'] as const;

type ReminderCalendarProps = {
  reminders: Reminder[];
  selectedDate: string;
  onSelectDate: (isoDate: string) => void;
  visibleMonth: Date;
  onVisibleMonthChange: (month: Date) => void;
};

export function ReminderCalendar({
  reminders,
  selectedDate,
  onSelectDate,
  visibleMonth,
  onVisibleMonthChange,
}: ReminderCalendarProps) {
  const colors = useThemeColors();
  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth();

  const { dateIndex, cells } = useMemo(() => {
    const bounds = getMonthBounds(year, month);
    return {
      dateIndex: buildReminderDateIndex(reminders, bounds.start, bounds.end),
      cells: buildCalendarGrid(year, month),
    };
  }, [reminders, year, month]);

  const shiftMonth = (delta: number) => {
    const next = new Date(visibleMonth);
    next.setMonth(next.getMonth() + delta);
    onVisibleMonthChange(next);
  };

  return (
    <View
      testID="reminder-calendar"
      className="rounded-2xl border border-surface-sunken bg-surface p-4"
      accessibilityRole="adjustable"
      accessibilityLabel="Hatırlatma takvimi">
      <View className="mb-4 flex-row items-center justify-between">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Önceki ay"
          testID="reminder-calendar-prev"
          onPress={() => shiftMonth(-1)}
          hitSlop={8}
          className="rounded-full p-2 active:bg-surface-canvas">
          <Ionicons name="chevron-back" size={20} color={colors.ink900} />
        </Pressable>

        <Text className="text-base font-semibold text-ink-900">
          {formatMonthYearTR(visibleMonth)}
        </Text>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Sonraki ay"
          testID="reminder-calendar-next"
          onPress={() => shiftMonth(1)}
          hitSlop={8}
          className="rounded-full p-2 active:bg-surface-canvas">
          <Ionicons name="chevron-forward" size={20} color={colors.ink900} />
        </Pressable>
      </View>

      <View className="mb-2 flex-row">
        {WEEKDAYS_TR.map((label) => (
          <View key={label} className="flex-1 items-center">
            <Text className="text-xs font-medium text-ink-500">{label}</Text>
          </View>
        ))}
      </View>

      <View className="flex-row flex-wrap">
        {cells.map((cell) => {
          const dayReminders = dateIndex.get(cell.iso) ?? [];
          const hasActive = dayReminders.some(isReminderActive);
          const hasCompleted = dayReminders.some((row) => !isReminderActive(row));
          const isSelected = cell.iso === selectedDate;

          return (
            <Pressable
              key={cell.iso}
              testID={`reminder-day-${cell.iso}`}
              accessibilityRole="button"
              accessibilityLabel={`${cell.day}${dayReminders.length > 0 ? `, ${dayReminders.length} hatırlatma` : ''}`}
              accessibilityState={{ selected: isSelected }}
              onPress={() => onSelectDate(cell.iso)}
              className="aspect-square w-[14.28%] items-center justify-center py-1 active:opacity-70">
              <View
                className={`h-9 w-9 items-center justify-center rounded-full ${
                  isSelected
                    ? 'border border-brand-500 bg-brand-100'
                    : cell.isToday
                      ? 'bg-brand-100'
                      : ''
                }`}>
                <Text
                  className={`text-sm ${
                    isSelected
                      ? 'font-semibold text-brand-600'
                      : cell.inMonth
                        ? 'text-ink-900'
                        : 'text-ink-500/50'
                  }`}>
                  {cell.day}
                </Text>
              </View>

              {dayReminders.length > 0 ? (
                <View className="mt-0.5 flex-row gap-0.5">
                  {hasActive ? (
                    <View className="h-1.5 w-1.5 rounded-full bg-brand-solid" />
                  ) : null}
                  {hasCompleted && !hasActive ? (
                    <View className="h-1.5 w-1.5 rounded-full bg-ink-500" />
                  ) : null}
                  {hasActive && hasCompleted ? (
                    <View className="h-1.5 w-1.5 rounded-full bg-ink-500" />
                  ) : null}
                </View>
              ) : (
                <View className="mt-0.5 h-1.5" />
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
