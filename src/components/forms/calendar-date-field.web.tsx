import { DateField } from '@/components/forms/date-field.web';

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

/** Web uses the browser's native date picker, which is already calendar-based. */
export function CalendarDateField(props: CalendarDateFieldProps) {
  return <DateField {...props} hint={props.hint ?? 'Takvimden seç.'} />;
}
