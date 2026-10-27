import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { View } from 'react-native';

import { CalendarDateField } from '@/components/forms/calendar-date-field';
import { SelectField, type SelectOption } from '@/components/forms/select-field';
import { TextField } from '@/components/forms/text-field';
import { TimeField } from '@/components/forms/time-field';
import { useScrollToFirstError } from '@/components/forms/use-scroll-to-first-error';
import { Button } from '@/components/ui/button';
import { InlineMessage } from '@/components/ui/state-views';
import { usePets } from '@/features/pets/hooks/use-pets';
import {
  RECURRENCE_OPTIONS,
  REMINDER_TYPES,
  REMINDER_TYPE_LABELS,
  SCHEDULE_MODE_LABELS,
  SCHEDULE_MODES,
  reminderSchema,
  type ReminderFormValues,
  type ReminderInput,
} from '@/features/reminders/schemas';
import { RECURRENCE_LABELS } from '@/features/reminders/schedule-utils';
import type { ReminderRecurrence, ReminderScheduleMode, ReminderType } from '@/types/database';
import { coerceDate } from '@/utils/date';

const typeOptions: SelectOption<ReminderType>[] = REMINDER_TYPES.map((value) => ({
  value,
  label: REMINDER_TYPE_LABELS[value],
}));

const scheduleModeOptions: SelectOption<ReminderScheduleMode>[] = SCHEDULE_MODES.map((value) => ({
  value,
  label: SCHEDULE_MODE_LABELS[value],
}));

const recurrenceOptions: SelectOption<ReminderRecurrence>[] = RECURRENCE_OPTIONS.map((value) => ({
  value,
  label: RECURRENCE_LABELS[value],
}));

/** On-screen order, used to find the first invalid field. */
const FIELD_ORDER = [
  'petId',
  'type',
  'title',
  'scheduleMode',
  'remindDate',
  'recurrence',
  'rangeStart',
  'rangeEnd',
  'remindTime',
  'notes',
] as const satisfies readonly (keyof ReminderFormValues)[];

const emptyValues: ReminderFormValues = {
  petId: '',
  type: 'other',
  title: '',
  scheduleMode: 'once',
  remindDate: coerceDate(new Date()),
  rangeStart: null,
  rangeEnd: null,
  recurrence: null,
  remindTime: '09:00',
  notes: '',
};

type ReminderFormProps = {
  initialValues?: ReminderFormValues;
  submitLabel: string;
  isSubmitting: boolean;
  errorMessage?: string;
  onSubmit: (values: ReminderInput) => void;
};

export function ReminderForm({
  initialValues,
  submitLabel,
  isSubmitting,
  errorMessage,
  onSubmit,
}: ReminderFormProps) {
  const pets = usePets();
  const petOptions: SelectOption<string>[] = (pets.data ?? []).map((pet) => ({
    value: pet.id,
    label: pet.name,
  }));

  const { control, handleSubmit } = useForm<ReminderFormValues, unknown, ReminderInput>({
    resolver: zodResolver(reminderSchema),
    defaultValues: initialValues ?? emptyValues,
    mode: 'onTouched',
  });

  const { fieldRef, scrollToFirstError } = useScrollToFirstError(FIELD_ORDER);

  const scheduleMode = useWatch({ control, name: 'scheduleMode' });
  const rangeStart = useWatch({ control, name: 'rangeStart' });

  return (
    <View className="gap-4">
      {errorMessage ? <InlineMessage tone="error" message={errorMessage} /> : null}

      <View ref={fieldRef('petId')}>
        <Controller
          control={control}
          name="petId"
          render={({ field, fieldState }) => (
            <SelectField
              testID="reminder-pet"
              label="Dost"
              placeholder="Dost seç"
              value={field.value || null}
              options={petOptions}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={fieldState.error?.message}
            />
          )}
        />
      </View>

      <View ref={fieldRef('type')}>
        <Controller
          control={control}
          name="type"
          render={({ field, fieldState }) => (
            <SelectField
              testID="reminder-type"
              label="Tür"
              value={field.value}
              options={typeOptions}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={fieldState.error?.message}
            />
          )}
        />
      </View>

      <View ref={fieldRef('title')}>
        <Controller
          control={control}
          name="title"
          render={({ field, fieldState }) => (
            <TextField
              testID="reminder-title"
              label="Başlık"
              placeholder="Kuduz aşısı tekrarı"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={fieldState.error?.message}
              autoCapitalize="sentences"
            />
          )}
        />
      </View>

      <View ref={fieldRef('scheduleMode')}>
        <Controller
          control={control}
          name="scheduleMode"
          render={({ field, fieldState }) => (
            <SelectField
              testID="reminder-schedule-mode"
              label="Hatırlatma türü"
              value={field.value}
              options={scheduleModeOptions}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={fieldState.error?.message}
            />
          )}
        />
      </View>

      {scheduleMode === 'once' ? (
        <View ref={fieldRef('remindDate')}>
          <Controller
            control={control}
            name="remindDate"
            render={({ field, fieldState }) => (
              <CalendarDateField
                testID="reminder-date"
                label="Tarih"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={fieldState.error?.message}
                hint="Takvimden bir gün seç."
                minimumDate={new Date()}
              />
            )}
          />
        </View>
      ) : (
        <>
          <View ref={fieldRef('recurrence')}>
            <Controller
              control={control}
              name="recurrence"
              render={({ field, fieldState }) => (
                <SelectField
                  testID="reminder-recurrence"
                  label="Tekrar"
                  placeholder="Tekrar sıklığı seç"
                  value={field.value}
                  options={recurrenceOptions}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  error={fieldState.error?.message}
                />
              )}
            />
          </View>

          <View ref={fieldRef('rangeStart')}>
            <Controller
              control={control}
              name="rangeStart"
              render={({ field, fieldState }) => (
                <CalendarDateField
                  testID="reminder-range-start"
                  label="Başlangıç tarihi"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  error={fieldState.error?.message}
                  hint="Tekrarın başlayacağı gün."
                  minimumDate={new Date()}
                />
              )}
            />
          </View>

          <View ref={fieldRef('rangeEnd')}>
            <Controller
              control={control}
              name="rangeEnd"
              render={({ field, fieldState }) => (
                <CalendarDateField
                  testID="reminder-range-end"
                  label="Bitiş tarihi"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  error={fieldState.error?.message}
                  hint="Tekrarın biteceği gün."
                  minimumDate={rangeStart ?? new Date()}
                />
              )}
            />
          </View>
        </>
      )}

      <View ref={fieldRef('remindTime')}>
        <Controller
          control={control}
          name="remindTime"
          render={({ field, fieldState }) => (
            <TimeField
              testID="reminder-time"
              label="Saat"
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={fieldState.error?.message}
              hint="Saat seçiciden bir zaman belirle."
            />
          )}
        />
      </View>

      <View ref={fieldRef('notes')}>
        <Controller
          control={control}
          name="notes"
          render={({ field, fieldState }) => (
            <TextField
              testID="reminder-notes"
              label="Not"
              placeholder="Veteriner randevusu için…"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={fieldState.error?.message}
              hint="İstersen boş bırakabilirsin."
              autoCapitalize="sentences"
              multiline
            />
          )}
        />
      </View>

      <Button
        testID="reminder-submit"
        label={submitLabel}
        onPress={handleSubmit(onSubmit, scrollToFirstError)}
        loading={isSubmitting}
      />
    </View>
  );
}
