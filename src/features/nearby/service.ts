import AsyncStorage from '@react-native-async-storage/async-storage';
import { Linking, Platform } from 'react-native';

import { fetchNearbyPlacesFromOverpass } from '@/features/nearby/backends/overpass';
import type { GeoPoint, NearbyPlace, NearbyPlacesByCategory } from '@/features/nearby/types';
import { haversineDistanceMeters } from '@/features/nearby/utils';

/**
 * Last successful result is kept on device so the home screen shows places
 * instantly on the next launch instead of waiting for Overpass again.
 */
const CACHE_KEY = 'nearby.cache.v1';
/** Reuse cached results without a request when this close and this fresh. */
const FRESH_DISTANCE_METERS = 500;
const FRESH_AGE_MS = 12 * 60 * 60 * 1000;
/** If the network fails, a nearby older result is better than an error. */
const STALE_DISTANCE_METERS = 3_000;
const STALE_AGE_MS = 7 * 24 * 60 * 60 * 1000;

type NearbyCache = {
  latitude: number;
  longitude: number;
  fetchedAt: number;
  places: NearbyPlacesByCategory;
};

async function readCache(): Promise<NearbyCache | null> {
  try {
    const raw = await AsyncStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as NearbyCache;
    return parsed?.places ? parsed : null;
  } catch {
    return null;
  }
}

async function writeCache(location: GeoPoint, places: NearbyPlacesByCategory): Promise<void> {
  const entry: NearbyCache = { ...location, fetchedAt: Date.now(), places };
  try {
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(entry));
  } catch {
    // Cache is an optimisation only.
  }
}

function isUsable(cache: NearbyCache, location: GeoPoint, maxDistance: number, maxAge: number) {
  return (
    Date.now() - cache.fetchedAt <= maxAge &&
    haversineDistanceMeters(cache, location) <= maxDistance
  );
}

/** Re-measures distances from where the user is now. */
function relativeTo(places: NearbyPlacesByCategory, origin: GeoPoint): NearbyPlacesByCategory {
  const update = (list: NearbyPlace[]) =>
    list
      .map((place) => ({ ...place, distanceMeters: haversineDistanceMeters(origin, place) }))
      .sort((a, b) => a.distanceMeters - b.distanceMeters);

  return {
    veterinary: update(places.veterinary),
    pet_shop: update(places.pet_shop),
    pet_grooming: update(places.pet_grooming),
  };
}

export async function listNearbyPlaces(location: GeoPoint): Promise<NearbyPlacesByCategory> {
  const cache = await readCache();
  if (cache && isUsable(cache, location, FRESH_DISTANCE_METERS, FRESH_AGE_MS)) {
    return relativeTo(cache.places, location);
  }

  try {
    const places = await fetchNearbyPlacesFromOverpass(location);
    await writeCache(location, places);
    return places;
  } catch (error) {
    if (cache && isUsable(cache, location, STALE_DISTANCE_METERS, STALE_AGE_MS)) {
      return relativeTo(cache.places, location);
    }
    throw error;
  }
}

export function openPlaceInMaps(place: NearbyPlace): void {
  const label = encodeURIComponent(place.name);
  const { latitude, longitude } = place;

  const url = Platform.select({
    ios: `maps:0,0?q=${label}@${latitude},${longitude}`,
    android: `geo:${latitude},${longitude}?q=${latitude},${longitude}(${label})`,
    default: `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`,
  });

  if (url) void Linking.openURL(url);
}
