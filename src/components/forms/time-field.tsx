import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { Keyboard, Modal, Platform, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CONTROL_CLASS, controlBorderClass, FieldShell } from '@/components/forms/field-shell';
import { Button } from '@/components/ui/button';
import { IOS_PICKER_LOCALE } from '@/constants/locale';
import { BrandColors } from '@/constants/theme';

type TimeFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  error?: string;
  hint?: string;
  testID?: string;
};

const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;

function parseTimeValue(value: string, fallback = '09:00'): Date {
  const match = TIME_PATTERN.exec(value) ?? TIME_PATTERN.exec(fallback);
  const hours = match ? Number(match[1]) : 9;
  const minutes = match ? Number(match[2]) : 0;
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
}

function formatTimeValue(date: Date): string {
  return `${`${date.getHours()}`.padStart(2, '0')}:${`${date.getMinutes()}`.padStart(2, '0')}`;
}

export function TimeField({
  label,
  value,
  onChange,
  onBlur,
  placeholder = 'Saat seç',
  error,
  hint,
  testID,
}: TimeFieldProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [draft, setDraft] = useState(() => parseTimeValue(value));
  const insets = useSafeAreaInsets();
  const displayValue = TIME_PATTERN.test(value) ? value : null;

  function openAndroidPicker() {
    DateTimePickerAndroid.open({
      value: parseTimeValue(value),
      mode: 'time',
      is24Hour: true,
      onValueChange: (_event, selected) => {
        onChange(formatTimeValue(selected));
        onBlur?.();
      },
      onDismiss: () => onBlur?.(),
    });
  }

  function open() {
    Keyboard.dismiss();

    if (Platform.OS === 'android') {
      openAndroidPicker();
      return;
    }

    setDraft(parseTimeValue(value));
    setIsSheetOpen(true);
  }

  function closeSheet() {
    setIsSheetOpen(false);
    onBlur?.();
  }

  return (
    <FieldShell label={label} error={error} hint={hint}>
      <Pressable
        testID={testID}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityValue={{ text: displayValue ?? placeholder }}
        onPress={open}
        className={`${CONTROL_CLASS} flex-row items-center justify-between ${controlBorderClass(
          Boolean(error),
          isSheetOpen,
        )}`}>
        <Text className={`text-base ${displayValue ? 'text-ink-900' : 'text-ink-500'}`}>
          {displayValue ?? placeholder}
        </Text>
        <Ionicons name="time-outline" size={18} color={BrandColors.ink500} />
      </Pressable>

      <Modal
        visible={isSheetOpen}
        transparent
        animationType="slide"
        onRequestClose={closeSheet}
        statusBarTranslucent>
        <View className="flex-1 justify-end bg-black/40">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Kapat"
            onPress={closeSheet}
            className="absolute inset-0"
          />

          <View
            className="rounded-t-3xl bg-surface px-5 pt-2"
            style={{ paddingBottom: insets.bottom + 12 }}>
            <View className="mb-2 h-1 w-10 self-center rounded-full bg-surface-sunken" />

            <Text accessibilityRole="header" className="pb-2 text-lg font-semibold text-ink-900">
              {label}
            </Text>

            <View className="w-full items-center" style={{ height: 216 }}>
              <DateTimePicker
                value={draft}
                mode="time"
                display="spinner"
                locale={IOS_PICKER_LOCALE}
                themeVariant="light"
                textColor={BrandColors.ink900}
                is24Hour
                style={{ width: '100%', height: 216 }}
                onChange={(_event, selected) => {
                  if (selected) setDraft(selected);
                }}
              />
            </View>

            <Button
              label="Tamam"
              onPress={() => {
                onChange(formatTimeValue(draft));
                closeSheet();
              }}
            />
          </View>
        </View>
      </Modal>
    </FieldShell>
  );
}
