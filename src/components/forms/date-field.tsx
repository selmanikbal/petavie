import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { Keyboard, Modal, Platform, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CONTROL_CLASS, controlBorderClass, FieldShell } from '@/components/forms/field-shell';
import { Button } from '@/components/ui/button';
import { IOS_PICKER_LOCALE } from '@/constants/locale';
import { useThemeColors, useThemeScheme } from '@/constants/theme';
import { coerceDate, formatDateTR } from '@/utils/date';

type DatePickerDisplay = 'spinner' | 'calendar';

type DateFieldProps = {
  label: string;
  value: Date | null;
  onChange: (value: Date) => void;
  onBlur?: () => void;
  placeholder?: string;
  error?: string;
  hint?: string;
  minimumDate?: Date;
  maximumDate?: Date;
  /** `calendar` opens a month grid; default is the wheel spinner. */
  pickerDisplay?: DatePickerDisplay;
  testID?: string;
};

function defaultPickerDate(
  value: Date | null,
  maximumDate: Date | undefined,
): Date {
  return coerceDate(value, maximumDate ?? new Date());
}

/**
 * Android opens the platform dialog imperatively; iOS has no dialog of its own,
 * so the spinner is hosted in a sheet with an explicit confirm button.
 */
export function DateField({
  label,
  value,
  onChange,
  onBlur,
  placeholder = 'Tarih seç',
  error,
  hint,
  minimumDate,
  maximumDate,
  pickerDisplay = 'spinner',
  testID,
}: DateFieldProps) {
  const colors = useThemeColors();
  const scheme = useThemeScheme();
  const isCalendar = pickerDisplay === 'calendar';
  const iosPickerDisplay = isCalendar ? 'inline' : 'spinner';
  const pickerHeight = isCalendar ? 340 : 216;
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [draft, setDraft] = useState(() => defaultPickerDate(value, maximumDate));
  const insets = useSafeAreaInsets();

  function openAndroidPicker() {
    DateTimePickerAndroid.open({
      value: defaultPickerDate(value, maximumDate),
      mode: 'date',
      display: isCalendar ? 'calendar' : 'default',
      minimumDate,
      maximumDate,
      onValueChange: (_event, selected) => {
        onChange(coerceDate(selected, defaultPickerDate(value, maximumDate)));
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

    setDraft(defaultPickerDate(value, maximumDate));
    setIsSheetOpen(true);
  }

  function closeSheet() {
    setIsSheetOpen(false);
    onBlur?.();
  }

  const displayValue = value ? formatDateTR(coerceDate(value, new Date())) : null;

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
        <Ionicons name="calendar-outline" size={18} color={colors.ink500} />
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
            <View className="mb-2 self-center h-1 w-10 rounded-full bg-surface-sunken" />

            <Text accessibilityRole="header" className="pb-2 text-lg font-semibold text-ink-900">
              {label}
            </Text>

            {/*
              Spinner needs an explicit height, and `themeVariant` + `textColor`
              must match the active app theme — otherwise the wheels render
              light-on-light or dark-on-dark inside the sheet.
            */}
            <View className="w-full items-center" style={{ height: pickerHeight }}>
              <DateTimePicker
                value={draft}
                mode="date"
                display={iosPickerDisplay}
                locale={IOS_PICKER_LOCALE}
                themeVariant={scheme}
                textColor={colors.ink900}
                minimumDate={minimumDate}
                maximumDate={maximumDate}
                style={{ width: '100%', height: pickerHeight }}
                onValueChange={(_event, selected) => {
                  setDraft(coerceDate(selected, draft));
                }}
              />
            </View>

            <Button
              label="Tamam"
              onPress={() => {
                onChange(draft);
                closeSheet();
              }}
            />
          </View>
        </View>
      </Modal>
    </FieldShell>
  );
}
