import * as FileSystem from 'expo-file-system/legacy';

/**
 * Avatars are stored as paths RELATIVE to the documents directory
 * (`pet-avatars/<file>.jpg`). On iOS the absolute container path can change
 * after an app update or device restore, so absolute paths must never be persisted.
 */
const AVATAR_FOLDER = 'pet-avatars/';

function documentsDir(): string | null {
  return FileSystem.documentDirectory ?? null;
}

/** Returns the stored relative path for any managed avatar uri (old absolute ones too). */
function toRelativeAvatarPath(uri: string | null | undefined): string | null {
  if (!uri) return null;
  if (uri.startsWith(AVATAR_FOLDER)) return uri;

  // Legacy rows saved `file:///…/Documents/pet-avatars/<file>.jpg`.
  const index = uri.lastIndexOf(`/${AVATAR_FOLDER}`);
  return index >= 0 ? uri.slice(index + 1) : null;
}

export function isManagedLocalAvatar(uri: string | null | undefined): boolean {
  return toRelativeAvatarPath(uri) !== null;
}

/** Turns a stored avatar value into a uri the image component can load. */
export function resolvePetAvatarUri(stored: string | null | undefined): string | null {
  if (!stored) return null;

  const relative = toRelativeAvatarPath(stored);
  const dir = documentsDir();
  if (relative && dir) return `${dir}${relative}`;
  return stored;
}

/** Copies the picked image into app storage and returns the value to persist. */
export async function saveLocalPetAvatar(petId: string, sourceUri: string): Promise<string> {
  const dir = documentsDir();
  if (!dir) {
    // Web demo — keep the compressed blob uri for the current session.
    return sourceUri;
  }

  await FileSystem.makeDirectoryAsync(`${dir}${AVATAR_FOLDER}`, { intermediates: true });

  // Unique name per upload so cached images never show the previous photo.
  const relative = `${AVATAR_FOLDER}${petId}-${Date.now()}.jpg`;
  await FileSystem.copyAsync({ from: sourceUri, to: `${dir}${relative}` });
  return relative;
}

export async function deleteLocalPetAvatar(uri: string | null | undefined): Promise<void> {
  const relative = toRelativeAvatarPath(uri);
  const dir = documentsDir();
  if (!relative || !dir) return;

  await FileSystem.deleteAsync(`${dir}${relative}`, { idempotent: true });
}
