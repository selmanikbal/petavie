import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';

import { DateField } from '@/components/forms/date-field';
import { TextField } from '@/components/forms/text-field';
import { Button } from '@/components/ui/button';
import { InlineMessage } from '@/components/ui/state-views';
import {
  vaccinationSchema,
  type VaccinationFormValues,
  type VaccinationInput,
} from '@/features/health/vaccination-schemas';
import { coerceDate } from '@/utils/date';

const emptyValues: VaccinationFormValues = {
  name: '',
  administeredAt: coerceDate(new Date()),
  nextDueAt: null,
  clinicName: '',
  note: '',
};

type VaccinationFormProps = {
  initialValues?: VaccinationFormValues;
  submitLabel: string;
  isSubmitting: boolean;
  errorMessage?: string;
  onSubmit: (values: VaccinationInput) => void;
};

export function VaccinationForm({
  initialValues,
  submitLabel,
  isSubmitting,
  errorMessage,
  onSubmit,
}: VaccinationFormProps) {
  const { control, handleSubmit } = useForm<VaccinationFormValues, unknown, VaccinationInput>({
    resolver: zodResolver(vaccinationSchema),
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
            testID="vaccination-name"
            label="Aşı adı"
            placeholder="Kuduz"
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
        name="administeredAt"
        render={({ field, fieldState }) => (
          <DateField
            testID="vaccination-administered-at"
            label="Uygulama tarihi"
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
        name="nextDueAt"
        render={({ field, fieldState }) => (
          <DateField
            testID="vaccination-next-due-at"
            label="Sonraki doz"
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            error={fieldState.error?.message}
            hint="İstersen boş bırakabilirsin."
          />
        )}
      />

      <Controller
        control={control}
        name="clinicName"
        render={({ field, fieldState }) => (
          <TextField
            testID="vaccination-clinic"
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
        name="note"
        render={({ field, fieldState }) => (
          <TextField
            testID="vaccination-note"
            label="Not"
            placeholder="Lot numarası, hatırlatmalar…"
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
        testID="vaccination-submit"
        label={submitLabel}
        onPress={handleSubmit(onSubmit)}
        loading={isSubmitting}
      />
    </View>
  );
}
