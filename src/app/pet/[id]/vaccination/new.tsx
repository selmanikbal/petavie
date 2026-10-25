import { useLocalSearchParams, useRouter } from 'expo-router';

import { StackScreen } from '@/components/ui/stack-screen';
import { VaccinationForm } from '@/features/health/components/vaccination-form';
import { petScreenTitles } from '@/features/pets/navigation';
import { useCreateVaccination } from '@/features/health/hooks/use-vaccination-mutations';
import { toUserFacingError } from '@/utils/errors';

export default function NewVaccinationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const petId = id ?? '';

  const router = useRouter();
  const createVaccination = useCreateVaccination(petId);

  return (
    <StackScreen title={petScreenTitles.vaccinationNew} scrollable>
      <VaccinationForm
        submitLabel="Kaydet"
        isSubmitting={createVaccination.isPending}
        errorMessage={
          createVaccination.isError ? toUserFacingError(createVaccination.error).message : undefined
        }
        onSubmit={(values) =>
          createVaccination.mutate(values, {
            onSuccess: () => router.back(),
          })
        }
      />
    </StackScreen>
  );
}
