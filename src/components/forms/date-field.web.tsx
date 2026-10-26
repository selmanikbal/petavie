import { createElement } from 'react';
import { View } from 'react-native';

import { CONTROL_CLASS, controlBorderClass, FieldShell } from '@/components/forms/field-shell';
import { APP_LOCALE } from '@/constants/locale';
import { useThemeColors } from '@/constants/theme';
import { fromISODate, toISODate } from '@/utils/date';

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
  testID?: string;
};

/**
 * Native date pickers have no web implementation. The browser's date input
 * keeps the same FieldShell chrome so the form is usable in Expo web.
 */
export function DateField({
  label,
  value,
  onChange,
  onBlur,
  error,
  hint,
  minimumDate,
  maximumDate,
  testID,
}: DateFieldProps) {
  const colors = useThemeColors();
  const iso = value ? toISODate(value) : '';

  return (
    <FieldShell label={label} error={error} hint={hint}>
      <View
        className={`${CONTROL_CLASS} justify-center ${controlBorderClass(Boolean(error), false)}`}>
        {createElement('input', {
          type: 'date',
          lang: APP_LOCALE,
          'aria-label': label,
          'data-testid': testID,
          value: iso,
          max: toISODate(maximumDate ?? new Date()),
          min: minimumDate ? toISODate(minimumDate) : undefined,
          onChange: (event: { currentTarget: { value: string } }) => {
            const next = fromISODate(event.currentTarget.value);
            if (next) onChange(next);
          },
          onBlur,
          style: {
            border: 'none',
            background: 'transparent',
            width: '100%',
            height: 52,
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
