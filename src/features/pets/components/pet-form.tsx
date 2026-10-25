import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';

import { DateField } from '@/components/forms/date-field';
import { SelectField, type SelectOption } from '@/components/forms/select-field';
import { TextField } from '@/components/forms/text-field';
import { Button } from '@/components/ui/button';
import { InlineMessage } from '@/components/ui/state-views';
import {
  GENDER_LABELS,
  PET_GENDERS,
  PET_SPECIES,
  petSchema,
  SPECIES_LABELS,
  type PetFormValues,
  type PetInput,
} from '@/features/pets/schemas';
import type { PetGender, PetSpecies } from '@/types/database';

const speciesOptions: SelectOption<PetSpecies>[] = PET_SPECIES.map((value) => ({
  value,
  label: SPECIES_LABELS[value],
}));

const genderOptions: SelectOption<PetGender>[] = PET_GENDERS.map((value) => ({
  value,
  label: GENDER_LABELS[value],
}));

const emptyValues: PetFormValues = {
  name: '',
  species: null,
  description: '',
  gender: 'unknown',
  birthDate: null,
  weightKg: '',
};

type PetFormProps = {
  /** Omit to start blank; pass a pet's current values to edit. */
  initialValues?: PetFormValues;
  submitLabel: string;
  isSubmitting: boolean;
  errorMessage?: string;
  onSubmit: (values: PetInput) => void;
};

/** Shared by the create and edit screens so both validate identically. */
export function PetForm({
  initialValues,
  submitLabel,
  isSubmitting,
  errorMessage,
  onSubmit,
}: PetFormProps) {
  const { control, handleSubmit } = useForm<PetFormValues, unknown, PetInput>({
    resolver: zodResolver(petSchema),
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
            testID="pet-name"
            label="Adı"
            placeholder="Luna"
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
        name="species"
        render={({ field, fieldState }) => (
          <SelectField
            testID="pet-species"
            label="Türü"
            placeholder="Tür seç"
            value={field.value}
            options={speciesOptions}
            onChange={field.onChange}
            onBlur={field.onBlur}
            error={fieldState.error?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="description"
        render={({ field, fieldState }) => (
          <TextField
            testID="pet-description"
            label="Açıklama"
            placeholder="Sakin bir British Shorthair, ev ortamına alışkın…"
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            error={fieldState.error?.message}
            autoCapitalize="sentences"
            multiline
          />
        )}
      />

      <Controller
        control={control}
        name="gender"
        render={({ field, fieldState }) => (
          <SelectField
            testID="pet-gender"
            label="Cinsiyeti"
            value={field.value}
            options={genderOptions}
            onChange={field.onChange}
            onBlur={field.onBlur}
            error={fieldState.error?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="birthDate"
        render={({ field, fieldState }) => (
          <DateField
            testID="pet-birth-date"
            label="Doğum tarihi"
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
        name="weightKg"
        render={({ field, fieldState }) => (
          <TextField
            testID="pet-weight"
            label="Kilo (kg)"
            placeholder="4,5"
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            error={fieldState.error?.message}
            hint="İstersen boş bırakabilirsin."
            keyboardType="decimal-pad"
          />
        )}
      />

      <Button
        testID="pet-submit"
        label={submitLabel}
        onPress={handleSubmit(onSubmit)}
        loading={isSubmitting}
      />
    </View>
  );
}
