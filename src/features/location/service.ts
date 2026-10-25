import * as Location from 'expo-location';

import type { GeoPoint } from '@/features/nearby/types';
import { AppError } from '@/utils/errors';

export async function getCurrentLocation(): Promise<GeoPoint> {
  const permission = await Location.requestForegroundPermissionsAsync();
  if (permission.status !== Location.PermissionStatus.GRANTED) {
    throw new AppError('Yakındaki yerleri göstermek için konum izni gerekli.');
  }

  const position = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });

  return {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
  };
}
