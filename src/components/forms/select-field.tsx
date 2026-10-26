import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CONTROL_CLASS, controlBorderClass, FieldShell } from '@/components/forms/field-shell';
import { useThemeColors } from '@/constants/theme';

export type SelectOption<T extends string> = {
  value: T;
  label: string;
};

type SelectFieldProps<T extends string> = {
  label: string;
  value: T | null;
  options: readonly SelectOption<T>[];
  onChange: (value: T) => void;
  onBlur?: () => void;
  placeholder?: string;
  error?: string;
  hint?: string;
  testID?: string;
};

/**
 * Picker built on a bottom sheet rather than the platform picker: the native
 * ones look and behave differently on each OS and cannot carry our styling.
 */
export function SelectField<T extends string>({
  label,
  value,
  options,
  onChange,
  onBlur,
  placeholder = 'Seç',
  error,
  hint,
  testID,
}: SelectFieldProps<T>) {
  const colors = useThemeColors();
  const [isOpen, setIsOpen] = useState(false);
  const insets = useSafeAreaInsets();

  const selected = options.find((option) => option.value === value);

  function close() {
    setIsOpen(false);
    onBlur?.();
  }

  return (
    <FieldShell label={label} error={error} hint={hint}>
      <Pressable
        testID={testID}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityValue={{ text: selected?.label ?? placeholder }}
        onPress={() => setIsOpen(true)}
        className={`${CONTROL_CLASS} flex-row items-center justify-between ${controlBorderClass(
          Boolean(error),
          isOpen,
        )}`}>
        <Text className={`text-base ${selected ? 'text-ink-900' : 'text-ink-500'}`}>
          {selected?.label ?? placeholder}
        </Text>
        <Ionicons name="chevron-down" size={18} color={colors.ink500} />
      </Pressable>

      <Modal
        visible={isOpen}
        transparent
        animationType="slide"
        onRequestClose={close}
        statusBarTranslucent>
        <View className="flex-1 justify-end bg-black/40">
          {/*
            The backdrop is a sibling rather than the sheet's parent: nesting a
            pressable inside a pressable produces invalid markup and confuses
            screen readers.
          */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Kapat"
            onPress={close}
            className="absolute inset-0"
          />

          <View
            className="rounded-t-3xl bg-surface pt-2"
            style={{ paddingBottom: insets.bottom + 12 }}>
            <View className="mb-2 self-center h-1 w-10 rounded-full bg-surface-sunken" />

            <Text
              accessibilityRole="header"
              className="px-5 pb-2 pt-1 text-lg font-semibold text-ink-900">
              {label}
            </Text>

            <ScrollView className="max-h-96" bounces={false}>
              {options.map((option) => {
                const isSelected = option.value === value;

                return (
                  <Pressable
                    key={option.value}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                    onPress={() => {
                      onChange(option.value);
                      close();
                    }}
                    className="flex-row items-center justify-between px-5 py-4 active:bg-surface-muted">
                    <Text
                      className={`text-base ${
                        isSelected ? 'font-semibold text-brand-600' : 'text-ink-900'
                      }`}>
                      {option.label}
                    </Text>
                    {isSelected ? (
                      <Ionicons name="checkmark" size={20} color={colors.brand600} />
                    ) : null}
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </FieldShell>
  );
}
