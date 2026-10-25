import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { StackScreen } from '@/components/ui/stack-screen';
import { InlineMessage } from '@/components/ui/state-views';
import { LOCAL_OWNER_ID } from '@/constants/owner';
import { PetAvatarDraft } from '@/features/pets/components/pet-avatar-draft';
import { PetForm } from '@/features/pets/components/pet-form';
import { useCreatePet } from '@/features/pets/hooks/use-pet-mutations';
import { petKeys } from '@/features/pets/hooks/use-pets';
import { petScreenTitles } from '@/features/pets/navigation';
import { updatePetAvatar } from '@/features/pets/service';
import { toUserFacingError } from '@/utils/errors';

export default function NewPetScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const createPet = useCreatePet();
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState<string | null>(null);

  return (
    <StackScreen title={petScreenTitles.new} scrollable>
      <View className="mb-2">
        <PetAvatarDraft value={avatarUri} onChange={setAvatarUri} />
      </View>

      {avatarError ? <InlineMessage tone="error" message={avatarError} /> : null}

      <PetForm
        submitLabel="Kaydet"
        isSubmitting={createPet.isPending}
        errorMessage={createPet.isError ? toUserFacingError(createPet.error).message : undefined}
        onSubmit={(values) =>
          createPet.mutate(values, {
            onSuccess: async (pet) => {
              if (avatarUri) {
                try {
                  const updated = await updatePetAvatar(pet.id, LOCAL_OWNER_ID, avatarUri);
                  queryClient.setQueryData(petKeys.detail(pet.id), updated);
                  queryClient.invalidateQueries({ queryKey: petKeys.lists() });
                } catch (error) {
                  setAvatarError(toUserFacingError(error).message);
                  router.replace(`/pet/${pet.id}`);
                  return;
                }
              }
              router.replace(`/pet/${pet.id}`);
            },
          })
        }
      />
    </StackScreen>
  );
}
