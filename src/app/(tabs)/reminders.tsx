import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

import { AppTopBar } from '@/components/ui/app-top-bar';
import { FilterChips } from '@/components/ui/filter-chips';
import { PrimaryActionButton } from '@/components/ui/primary-action-button';
import { PromoBanner } from '@/components/ui/promo-banner';
import { Screen } from '@/components/ui/screen';
import { EmptyState } from '@/components/ui/state-views';
import { useThemeColors } from '@/constants/theme';
import { SPECIES_LABELS } from '@/features/pets/schemas';
import { usePets } from '@/features/pets/hooks/use-pets';
import { ReminderCalendar } from '@/features/reminders/components/reminder-calendar';
import { ReminderList } from '@/features/reminders/components/reminder-list';
import { useReminders } from '@/features/reminders/hooks/use-reminders';
import { reminderOccursOnDate } from '@/features/reminders/calendar-utils';
import { isReminderActive } from '@/features/reminders/utils';
import { formatDateTR, fromISODate, toISODate } from '@/utils/date';

export default function RemindersScreen() {
  const colors = useThemeColors();
  const router = useRouter();
  const pets = usePets();
  const reminders = useReminders();
  const petsById = new Map((pets.data ?? []).map((pet) => [pet.id, pet]));
  const hasPets = (pets.data?.length ?? 0) > 0;
  const hasReminders = (reminders.data?.length ?? 0) > 0;

  const [selectedDate, setSelectedDate] = useState(() => toISODate(new Date()));
  const [filterPetId, setFilterPetId] = useState<string | null>(null);
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  const selectedDay = fromISODate(selectedDate);
  const filterOptions = useMemo(
    () => [
      { id: 'all', label: 'Tüm Dostlarım' },
      ...(pets.data ?? []).map((pet) => ({
        id: pet.id,
        label: `${pet.name} (${SPECIES_LABELS[pet.species]})`,
      })),
    ],
    [pets.data],
  );

  const dayTasks =
    reminders.data?.filter(
      (row) =>
        reminderOccursOnDate(row, selectedDate) &&
        isReminderActive(row) &&
        (!filterPetId || row.pet_id === filterPetId),
    ) ?? [];

  return (
    <Screen scrollable={hasReminders || !hasPets} tabBarInset>
      <AppTopBar title="Hatırlatmalar" />

      <View className="mb-5 flex-row items-start justify-between gap-4">
        <View className="flex-1">
          <Text accessibilityRole="header" className="text-3xl font-bold text-ink-900">
            Hatırlatmalar
          </Text>
        </View>
        {hasPets ? (
          <PrimaryActionButton
            testID="reminder-add"
            label="Yeni Hatırlatma"
            compact
            onPress={() => router.push('/reminder/new')}
          />
        ) : null}
      </View>

      {!hasPets ? (
        <EmptyState
          title="Önce bir dost ekle"
          description="Hatırlatmalar evcil hayvanlarına bağlıdır. İlk dostunu ekleyerek başla."
          actionLabel="Dost ekle"
          onAction={() => router.push('/pet/new')}
        />
      ) : (
        <View className="gap-5">
          {pets.data && pets.data.length > 1 ? (
            <FilterChips
              options={filterOptions}
              value={filterPetId ?? 'all'}
              onChange={(id) => setFilterPetId(id === 'all' ? null : id)}
            />
          ) : null}

          {reminders.isPending ? (
            <View className="items-center gap-2 rounded-2xl border border-surface-sunken bg-surface py-10">
              <ActivityIndicator color={colors.brand500} />
              <Text className="text-sm text-ink-500">Takvim yükleniyor…</Text>
            </View>
          ) : (
            <ReminderCalendar
              reminders={
                filterPetId
                  ? (reminders.data ?? []).filter((row) => row.pet_id === filterPetId)
                  : (reminders.data ?? [])
              }
              selectedDate={selectedDate}
              onSelectDate={(isoDate) => {
                setSelectedDate(isoDate);
                const date = fromISODate(isoDate);
                if (date) {
                  setVisibleMonth(new Date(date.getFullYear(), date.getMonth(), 1));
                }
              }}
              visibleMonth={visibleMonth}
              onVisibleMonthChange={setVisibleMonth}
            />
          )}

          {!reminders.isPending ? (
            <View className="gap-3">
              <View className="flex-row items-center justify-between gap-3">
                <Text className="flex-1 text-lg font-bold text-ink-900">
                  {selectedDay ? `${formatDateTR(selectedDay)}, Bugün Planlananlar` : 'Seçilen gün'}
                </Text>
                {dayTasks.length > 0 ? (
                  <View className="rounded-full bg-brand-100 px-2.5 py-1">
                    <Text className="text-xs font-bold text-brand-600">
                      {dayTasks.length} Görev
                    </Text>
                  </View>
                ) : null}
              </View>

              <ReminderList
                petsById={petsById}
                filterDate={selectedDate}
                filterPetId={filterPetId}
              />
            </View>
          ) : null}

          <PromoBanner
            title="Parazit Hatırlatıcısı"
            description="Mevsim geçişlerinde parazit uygulamalarını unutma. Düzenli koruma sağlıklı bir yaşam demektir."
            icon="bulb-outline"
          />
        </View>
      )}
    </Screen>
  );
}
