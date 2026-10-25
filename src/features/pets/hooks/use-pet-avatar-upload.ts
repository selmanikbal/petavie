import { useState } from 'react';

import { useUpdatePetAvatar } from '@/features/pets/hooks/use-pet-mutations';
import { pickPetAvatarUri } from '@/features/pets/photos/prepare';
import { toUserFacingError } from '@/utils/errors';

export function usePetAvatarUpload(petId: string) {
  const updateAvatar = useUpdatePetAvatar(petId);
  const [pickerError, setPickerError] = useState<string | null>(null);

  async function pickAndUpload(): Promise<boolean> {
    if (updateAvatar.isPending) return false;

    setPickerError(null);
    try {
      const uri = await pickPetAvatarUri();
      if (!uri) return false;

      await updateAvatar.mutateAsync(uri);
      return true;
    } catch (error) {
      setPickerError(toUserFacingError(error).message);
      return false;
    }
  }

  const errorMessage =
    pickerError ??
    (updateAvatar.isError ? toUserFacingError(updateAvatar.error).message : null);

  return {
    pickAndUpload,
    isPending: updateAvatar.isPending,
    errorMessage,
  };
}
