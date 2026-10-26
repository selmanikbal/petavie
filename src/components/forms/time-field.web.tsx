import { createElement } from 'react';
import { View } from 'react-native';

import { CONTROL_CLASS, controlBorderClass, FieldShell } from '@/components/forms/field-shell';
import { useThemeColors } from '@/constants/theme';

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

/** Web uses the browser's native time input inside the shared field chrome. */
export function TimeField({
  label,
  value,
  onChange,
  onBlur,
  error,
  hint,
  testID,
}: TimeFieldProps) {
  const colors = useThemeColors();
  return (
    <FieldShell label={label} error={error} hint={hint}>
      <View
        className={`${CONTROL_CLASS} justify-center ${controlBorderClass(Boolean(error), false)}`}>
        {createElement('input', {
          type: 'time',
          'aria-label': label,
          'data-testid': testID,
          value: value || '09:00',
          onChange: (event: { currentTarget: { value: string } }) => {
            onChange(event.currentTarget.value);
          },
          onBlur,
          style: {
            border: 'none',
            background: 'transparent',
            width: '100%',
            height: 48,
            fontSize: 16,
            color: colors.ink900,
            colorScheme: 'light',
            WebkitAppearance: 'none',
            outline: 'none',
          },
        })}
      </View>
    </FieldShell>
  );
}
