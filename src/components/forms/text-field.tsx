import { useState } from 'react';
import { TextInput, type KeyboardTypeOptions, type TextInputProps } from 'react-native';

import { CONTROL_CLASS, controlBorderClass, FieldShell } from '@/components/forms/field-shell';
import { useThemeColors } from '@/constants/theme';

type TextFieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  error?: string;
  hint?: string;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: TextInputProps['autoCapitalize'];
  autoComplete?: TextInputProps['autoComplete'];
  textContentType?: TextInputProps['textContentType'];
  multiline?: boolean;
  testID?: string;
};

/**
 * Labeled text input with inline validation message.
 * Pair with React Hook Form's Controller — it holds no form state itself.
 */
export function TextField({
  label,
  value,
  onChangeText,
  onBlur,
  placeholder,
  error,
  hint,
  secureTextEntry = false,
  keyboardType,
  autoCapitalize = 'none',
  autoComplete,
  textContentType,
  multiline = false,
  testID,
}: TextFieldProps) {
  const colors = useThemeColors();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <FieldShell label={label} error={error} hint={hint}>
      <TextInput
        testID={testID}
        accessibilityLabel={label}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          setIsFocused(false);
          onBlur?.();
        }}
        placeholder={placeholder}
        placeholderTextColor={colors.placeholder}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoComplete={autoComplete}
        textContentType={textContentType}
        multiline={multiline}
        className={`${CONTROL_CLASS} text-base text-ink-900 ${controlBorderClass(
          Boolean(error),
          isFocused,
        )} ${multiline ? 'min-h-[160px] py-3' : ''}`}
        style={multiline ? { textAlignVertical: 'top' } : undefined}
      />
    </FieldShell>
  );
}
