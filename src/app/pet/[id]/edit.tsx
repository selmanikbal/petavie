import { useLocalSearchParams, useRouter } from 'expo-router';
import { View } from 'react-native';

import { StackScreen } from '@/components/ui/stack-screen';
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/state-views';
import { PetAvatarPicker } from '@/features/pets/components/pet-avatar-picker';
import { PetForm } from '@/features/pets/components/pet-form';
import { useUpdatePet } from '@/features/pets/hooks/use-pet-mutations';
import { usePet } from '@/features/pets/hooks/use-pets';
import { petScreenTitles } from '@/features/pets/navigation';
import { toPetFormValues } from '@/features/pets/utils';
import { toUserFacingError } from '@/utils/errors';

export default function EditPetScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const petId = id ?? '';

  const router = useRouter();
  const pet = usePet(petId);
  const updatePet = useUpdatePet(petId);

  if (pet.isPending) {
    return (
      <StackScreen title={petScreenTitles.edit}>
        <LoadingState label="Bilgiler yükleniyor…" />
      </StackScreen>
    );
  }

  if (pet.isError) {
    return (
      <StackScreen title={petScreenTitles.edit}>
        <ErrorState
          description={toUserFacingError(pet.error).message}
          onRetry={() => void pet.refetch()}
        />
      </StackScreen>
    );
  }

  if (!pet.data) {
    return (
      <StackScreen title={petScreenTitles.edit}>
        <EmptyState
          title="Bu dostunu bulamadık"
          description="Kayıt silinmiş olabilir. Listeye dönüp tekrar dene."
          actionLabel="Listeye dön"
          onAction={() => router.replace('/(tabs)/pets')}
        />
      </StackScreen>
    );
  }

  return (
    <StackScreen title={petScreenTitles.edit} scrollable>
      <View className="mb-4">
        <PetAvatarPicker pet={pet.data} />
      </View>
      <PetForm
        initialValues={toPetFormValues(pet.data)}
        submitLabel="Değişiklikleri kaydet"
        isSubmitting={updatePet.isPending}
        errorMessage={updatePet.isError ? toUserFacingError(updatePet.error).message : undefined}
        onSubmit={(values) =>
          updatePet.mutate(values, {
            onSuccess: () => router.back(),
          })
        }
      />
    </StackScreen>
  );
}
