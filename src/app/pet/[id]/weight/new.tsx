import { useLocalSearchParams, useRouter } from 'expo-router';

import { StackScreen } from '@/components/ui/stack-screen';
import { PetWeightForm } from '@/features/health/components/pet-weight-form';
import { petScreenTitles } from '@/features/pets/navigation';
import { useCreatePetWeight } from '@/features/health/hooks/use-weight-mutations';
import { toUserFacingError } from '@/utils/errors';

export default function NewPetWeightScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const petId = id ?? '';

  const router = useRouter();
  const createWeight = useCreatePetWeight(petId);

  return (
    <StackScreen title={petScreenTitles.weightNew} scrollable>
      <PetWeightForm
        submitLabel="Kaydet"
        isSubmitting={createWeight.isPending}
        errorMessage={
          createWeight.isError ? toUserFacingError(createWeight.error).message : undefined
        }
        onSubmit={(values) =>
          createWeight.mutate(values, {
            onSuccess: () => router.back(),
          })
        }
      />
    </StackScreen>
  );
}
