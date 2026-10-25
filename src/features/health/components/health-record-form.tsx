import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';

import { DateField } from '@/components/forms/date-field';
import { TextField } from '@/components/forms/text-field';
import { Button } from '@/components/ui/button';
import { InlineMessage } from '@/components/ui/state-views';
import {
  healthRecordSchema,
  type HealthRecordFormValues,
  type HealthRecordInput,
} from '@/features/health/health-record-schemas';
import { coerceDate } from '@/utils/date';

const emptyValues: HealthRecordFormValues = {
  title: '',
  visitedAt: coerceDate(new Date()),
  description: '',
  clinicName: '',
};

type HealthRecordFormProps = {
  initialValues?: HealthRecordFormValues;
  submitLabel: string;
  isSubmitting: boolean;
  errorMessage?: string;
  onSubmit: (values: HealthRecordInput) => void;
};

export function HealthRecordForm({
  initialValues,
  submitLabel,
  isSubmitting,
  errorMessage,
  onSubmit,
}: HealthRecordFormProps) {
  const { control, handleSubmit } = useForm<HealthRecordFormValues, unknown, HealthRecordInput>({
    resolver: zodResolver(healthRecordSchema),
    defaultValues: initialValues ?? emptyValues,
    mode: 'onTouched',
  });

  return (
    <View className="gap-4">
      {errorMessage ? <InlineMessage tone="error" message={errorMessage} /> : null}

      <Controller
        control={control}
        name="title"
        render={({ field, fieldState }) => (
          <TextField
            testID="health-record-title"
            label="Başlık"
            placeholder="Genel kontrol"
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            error={fieldState.error?.message}
            autoCapitalize="sentences"
          />
        )}
      />

      <Controller
        control={control}
        name="visitedAt"
        render={({ field, fieldState }) => (
          <DateField
            testID="health-record-date"
            label="Tarih"
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            error={fieldState.error?.message}
            maximumDate={new Date()}
          />
        )}
      />

      <Controller
        control={control}
        name="clinicName"
        render={({ field, fieldState }) => (
          <TextField
            testID="health-record-clinic"
            label="Klinik / Veteriner"
            placeholder="Pativet Hayvan Hastanesi"
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            error={fieldState.error?.message}
            hint="İstersen boş bırakabilirsin."
            autoCapitalize="words"
          />
        )}
      />

      <Controller
        control={control}
        name="description"
        render={({ field, fieldState }) => (
          <TextField
            testID="health-record-description"
            label="Açıklama"
            placeholder="Muayene bulguları, öneriler, tedavi notları…"
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            error={fieldState.error?.message}
            autoCapitalize="sentences"
            multiline
          />
        )}
      />

      <Button
        testID="health-record-submit"
        label={submitLabel}
        onPress={handleSubmit(onSubmit)}
        loading={isSubmitting}
      />
    </View>
  );
}
