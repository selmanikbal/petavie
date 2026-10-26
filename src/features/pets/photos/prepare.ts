import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { Alert, Platform } from 'react-native';

import { AppError } from '@/utils/errors';

const MAX_WIDTH = 1024;
const JPEG_QUALITY = 0.8;

function hasMediaAccess(status: ImagePicker.PermissionStatus): boolean {
  // iOS can return the string `limited` for partial photo-library access.
  return (
    status === ImagePicker.PermissionStatus.GRANTED || String(status) === 'limited'
  );
}

async function ensureLibraryPermission(): Promise<void> {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!hasMediaAccess(status)) {
    throw new AppError('Fotoğraf seçmek için galeri izni gerekli.');
  }
}

async function ensureCameraPermission(): Promise<void> {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  if (status !== ImagePicker.PermissionStatus.GRANTED) {
    throw new AppError('Fotoğraf çekmek için kamera izni gerekli.');
  }
}

async function compressForUpload(uri: string): Promise<string> {
  const result = await manipulateAsync(
    uri,
    [{ resize: { width: MAX_WIDTH } }],
    { compress: JPEG_QUALITY, format: SaveFormat.JPEG },
  );
  return result.uri;
}

async function pickFromLibrary(): Promise<string | null> {
  await ensureLibraryPermission();

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 1,
  });

  if (result.canceled || !result.assets[0]?.uri) return null;
  return compressForUpload(result.assets[0].uri);
}

async function pickFromCamera(): Promise<string | null> {
  await ensureCameraPermission();

  const result = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    aspect: [1, 1],
    quality: 1,
  });

  if (result.canceled || !result.assets[0]?.uri) return null;
  return compressForUpload(result.assets[0].uri);
}

async function pickWithSourceDialog(): Promise<string | null> {
  return new Promise((resolve, reject) => {
    Alert.alert('Fotoğraf ekle', 'Kaynağı seç', [
      {
        text: 'Galeri',
        onPress: () => {
          void pickFromLibrary().then(resolve).catch(reject);
        },
      },
      {
        text: 'Kamera',
        onPress: () => {
          void pickFromCamera().then(resolve).catch(reject);
        },
      },
      { text: 'Vazgeç', style: 'cancel', onPress: () => resolve(null) },
    ], {
      // Android: tapping outside closes the dialog without any button press.
      cancelable: true,
      onDismiss: () => resolve(null),
    });
  });
}

/** Asks the user, then returns a compressed local JPEG uri or null if cancelled. */
export function pickPetAvatarUri(): Promise<string | null> {
  if (Platform.OS === 'web') {
    return pickFromLibrary();
  }

  return pickWithSourceDialog();
}
