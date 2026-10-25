import * as FileSystem from 'expo-file-system/legacy';

const AVATAR_DIR = `${FileSystem.documentDirectory ?? ''}pet-avatars/`;

export function isManagedLocalAvatar(uri: string | null | undefined): boolean {
  return Boolean(uri?.startsWith(AVATAR_DIR));
}

export async function saveLocalPetAvatar(petId: string, sourceUri: string): Promise<string> {
  if (!FileSystem.documentDirectory) {
    // Web demo — keep the compressed blob uri for the current session.
    return sourceUri;
  }

  await FileSystem.makeDirectoryAsync(AVATAR_DIR, { intermediates: true });

  const destination = `${AVATAR_DIR}${petId}.jpg`;
  await FileSystem.copyAsync({ from: sourceUri, to: destination });
  return destination;
}

export async function deleteLocalPetAvatar(uri: string | null | undefined): Promise<void> {
  if (!uri || !isManagedLocalAvatar(uri)) return;

  await FileSystem.deleteAsync(uri, { idempotent: true });
}
