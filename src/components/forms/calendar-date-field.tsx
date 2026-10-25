import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform, Text, View } from 'react-native';

import { DateField } from '@/components/forms/date-field';
import { controlBorderClass, FieldShell } from '@/components/forms/field-shell';
import { IOS_PICKER_LOCALE } from '@/constants/locale';
import { BrandColors } from '@/constants/theme';
import { coerceDate, formatDateTR } from '@/utils/date';

type CalendarDateFieldProps = {
  label: string;
  value: Date | null;
  onChange: (value: Date) => void;
  onBlur?: () => void;
  error?: string;
  hint?: string;
  minimumDate?: Date;
  maximumDate?: Date;
  testID?: string;
};

/**
 * Reminder dates use a visible month grid on iOS; other platforms fall back to
 * the shared DateField calendar picker.
 */
export function CalendarDateField(props: CalendarDateFieldProps) {
  if (Platform.OS !== 'ios') {
    return <DateField {...props} pickerDisplay="calendar" placeholder="Takvimden seç" />;
  }

  const { label, value, onChange, onBlur, error, hint, minimumDate, maximumDate, testID } =
    props;
  const selected = coerceDate(value, minimumDate ?? new Date());

  return (
    <FieldShell label={label} error={error} hint={hint}>
      <View
        testID={testID}
        className={`overflow-hidden rounded-2xl border bg-surface ${controlBorderClass(
          Boolean(error),
          false,
        )}`}>
        <View className="border-b border-surface-sunken px-4 py-3">
          <Text className="text-sm text-ink-500">Seçilen tarih</Text>
          <Text className="text-base font-semibold text-ink-900">{formatDateTR(selected)}</Text>
        </View>

        <DateTimePicker
          value={selected}
          mode="date"
          display="inline"
          locale={IOS_PICKER_LOCALE}
          themeVariant="light"
          accentColor={BrandColors.brand500}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
          style={{ width: '100%', height: 340 }}
          onValueChange={(_event, next) => {
            onChange(coerceDate(next, selected));
            onBlur?.();
          }}
        />
      </View>
    </FieldShell>
  );
}
