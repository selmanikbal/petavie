import { useLocalSearchParams, useRouter } from 'expo-router';

import { StackScreen } from '@/components/ui/stack-screen';
import { MedicationForm } from '@/features/health/components/medication-form';
import { petScreenTitles } from '@/features/pets/navigation';
import { useCreateMedication } from '@/features/health/hooks/use-medication-mutations';
import { toUserFacingError } from '@/utils/errors';

export default function NewMedicationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const petId = id ?? '';

  const router = useRouter();
  const createMedication = useCreateMedication(petId);

  return (
    <StackScreen title={petScreenTitles.medicationNew} scrollable>
      <MedicationForm
        submitLabel="Kaydet"
        isSubmitting={createMedication.isPending}
        errorMessage={
          createMedication.isError ? toUserFacingError(createMedication.error).message : undefined
        }
        onSubmit={(values) =>
          createMedication.mutate(values, {
            onSuccess: () => router.back(),
          })
        }
      />
    </StackScreen>
  );
}
