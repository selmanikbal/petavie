import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';

import { DateField } from '@/components/forms/date-field';
import { TextField } from '@/components/forms/text-field';
import { Button } from '@/components/ui/button';
import { InlineMessage } from '@/components/ui/state-views';
import {
  petWeightSchema,
  type PetWeightFormValues,
  type PetWeightInput,
} from '@/features/health/schemas';
import { coerceDate } from '@/utils/date';

const emptyValues: PetWeightFormValues = {
  weightKg: '',
  recordedAt: coerceDate(new Date()),
  note: '',
};

type PetWeightFormProps = {
  submitLabel: string;
  isSubmitting: boolean;
  errorMessage?: string;
  onSubmit: (values: PetWeightInput) => void;
};

export function PetWeightForm({
  submitLabel,
  isSubmitting,
  errorMessage,
  onSubmit,
}: PetWeightFormProps) {
  const { control, handleSubmit } = useForm<PetWeightFormValues, unknown, PetWeightInput>({
    resolver: zodResolver(petWeightSchema),
    defaultValues: emptyValues,
    mode: 'onTouched',
  });

  return (
    <View className="gap-4">
      {errorMessage ? <InlineMessage tone="error" message={errorMessage} /> : null}

      <Controller
        control={control}
        name="weightKg"
        render={({ field, fieldState }) => (
          <TextField
            testID="pet-weight-value"
            label="Kilo (kg)"
            placeholder="4,5"
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            error={fieldState.error?.message}
            keyboardType="decimal-pad"
          />
        )}
      />

      <Controller
        control={control}
        name="recordedAt"
        render={({ field, fieldState }) => (
          <DateField
            testID="pet-weight-date"
            label="Ölçüm tarihi"
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
        name="note"
        render={({ field, fieldState }) => (
          <TextField
            testID="pet-weight-note"
            label="Not"
            placeholder="Veteriner kontrolü sonrası…"
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
        testID="pet-weight-submit"
        label={submitLabel}
        onPress={handleSubmit(onSubmit)}
        loading={isSubmitting}
      />
    </View>
  );
}
