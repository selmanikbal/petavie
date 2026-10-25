import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';

import { DateField } from '@/components/forms/date-field';
import { TextField } from '@/components/forms/text-field';
import { Button } from '@/components/ui/button';
import { InlineMessage } from '@/components/ui/state-views';
import {
  medicationSchema,
  type MedicationFormValues,
  type MedicationInput,
} from '@/features/health/medication-schemas';
import { coerceDate } from '@/utils/date';

const emptyValues: MedicationFormValues = {
  name: '',
  dosage: '',
  frequency: '',
  startedAt: coerceDate(new Date()),
  endedAt: null,
  note: '',
};

type MedicationFormProps = {
  initialValues?: MedicationFormValues;
  submitLabel: string;
  isSubmitting: boolean;
  errorMessage?: string;
  onSubmit: (values: MedicationInput) => void;
};

export function MedicationForm({
  initialValues,
  submitLabel,
  isSubmitting,
  errorMessage,
  onSubmit,
}: MedicationFormProps) {
  const { control, handleSubmit } = useForm<MedicationFormValues, unknown, MedicationInput>({
    resolver: zodResolver(medicationSchema),
    defaultValues: initialValues ?? emptyValues,
    mode: 'onTouched',
  });

  return (
    <View className="gap-4">
      {errorMessage ? <InlineMessage tone="error" message={errorMessage} /> : null}

      <Controller
        control={control}
        name="name"
        render={({ field, fieldState }) => (
          <TextField
            testID="medication-name"
            label="İlaç adı"
            placeholder="Antibiyotik"
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            error={fieldState.error?.message}
            autoCapitalize="words"
          />
        )}
      />

      <Controller
        control={control}
        name="dosage"
        render={({ field, fieldState }) => (
          <TextField
            testID="medication-dosage"
            label="Doz"
            placeholder="1 tablet"
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            error={fieldState.error?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="frequency"
        render={({ field, fieldState }) => (
          <TextField
            testID="medication-frequency"
            label="Sıklık"
            placeholder="Günde 2 kez"
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            error={fieldState.error?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="startedAt"
        render={({ field, fieldState }) => (
          <DateField
            testID="medication-started-at"
            label="Başlangıç tarihi"
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
        name="endedAt"
        render={({ field, fieldState }) => (
          <DateField
            testID="medication-ended-at"
            label="Bitiş tarihi"
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            error={fieldState.error?.message}
            hint="Devam ediyorsa boş bırak."
          />
        )}
      />

      <Controller
        control={control}
        name="note"
        render={({ field, fieldState }) => (
          <TextField
            testID="medication-note"
            label="Not"
            placeholder="Yemekten sonra ver…"
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

      <Button
        testID="medication-submit"
        label={submitLabel}
        onPress={handleSubmit(onSubmit)}
        loading={isSubmitting}
      />
    </View>
  );
}
