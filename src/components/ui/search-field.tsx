import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';

import { CONTROL_CLASS, controlBorderClass } from '@/components/forms/field-shell';
import { useThemeColors } from '@/constants/theme';

type SearchFieldProps = {
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  accessibilityLabel?: string;
};

export function SearchField({
  value,
  onChangeText,
  placeholder = 'Ara',
  accessibilityLabel = 'Ara',
}: SearchFieldProps) {
  const colors = useThemeColors();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View
      className={`${CONTROL_CLASS} flex-row items-center gap-2 ${controlBorderClass(
        false,
        isFocused,
      )}`}>
      <Ionicons name="search" size={18} color={colors.ink500} />
      <TextInput
        accessibilityLabel={accessibilityLabel}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        placeholderTextColor={colors.placeholder}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        clearButtonMode="never"
        className="flex-1 text-base text-ink-900"
      />
      {value ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Aramayı temizle"
          onPress={() => onChangeText('')}
          hitSlop={8}>
          <Ionicons name="close-circle" size={18} color={colors.ink500} />
        </Pressable>
      ) : null}
    </View>
  );
}
