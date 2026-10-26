import * as Location from 'expo-location';

import type { GeoPoint } from '@/features/nearby/types';
import { AppError } from '@/utils/errors';

/** A 5 km search does not need GPS precision — cell/Wi-Fi is enough and much faster. */
const RECENT_FIX_MAX_AGE_MS = 15 * 60 * 1000;
const RECENT_FIX_MAX_ACCURACY_METERS = 1_000;
const FRESH_FIX_TIMEOUT_MS = 8_000;

function toPoint(position: Location.LocationObject): GeoPoint {
  return { latitude: position.coords.latitude, longitude: position.coords.longitude };
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('location-timeout')), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error: unknown) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}

export async function getCurrentLocation(): Promise<GeoPoint> {
  const permission = await Location.requestForegroundPermissionsAsync();
  if (permission.status !== Location.PermissionStatus.GRANTED) {
    throw new AppError('Yakındaki yerleri göstermek için konum izni gerekli.');
  }

  // 1) A recent fix the OS already has — returns instantly.
  const recent = await Location.getLastKnownPositionAsync({
    maxAge: RECENT_FIX_MAX_AGE_MS,
    requiredAccuracy: RECENT_FIX_MAX_ACCURACY_METERS,
  }).catch(() => null);
  if (recent) return toPoint(recent);

  // 2) A fresh low-accuracy fix, but never wait forever for it.
  try {
    const fresh = await withTimeout(
      Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Low }),
      FRESH_FIX_TIMEOUT_MS,
    );
    return toPoint(fresh);
  } catch {
    // 3) Any older fix is still good enough for a 5 km radius.
    const fallback = await Location.getLastKnownPositionAsync().catch(() => null);
    if (fallback) return toPoint(fallback);
    throw new AppError('Konumun alınamadı. Konum servislerinin açık olduğundan emin ol.');
  }
}
