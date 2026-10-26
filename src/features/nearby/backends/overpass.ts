import {
  NEARBY_CATEGORIES,
  NEARBY_CATEGORY_TAGS,
  NEARBY_SEARCH_RADIUS_METERS,
} from '@/features/nearby/constants';
import type {
  GeoPoint,
  NearbyPlace,
  NearbyPlaceCategory,
  NearbyPlacesByCategory,
} from '@/features/nearby/types';
import { buildAddressFromTags, haversineDistanceMeters } from '@/features/nearby/utils';
import { AppError } from '@/utils/errors';

/**
 * Public Overpass instances, tried in order. The main server is often busy, so
 * a slow or failing instance must not keep the user waiting.
 */
const OVERPASS_ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.private.coffee/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
] as const;

/** Per-endpoint wait before moving to the next mirror. */
const REQUEST_TIMEOUT_MS = 8_000;
const MAX_RESULTS_PER_CATEGORY = 20;

type OverpassElement = {
  id: number;
  type: 'node' | 'way' | 'relation';
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
};

type OverpassResponse = {
  elements?: OverpassElement[];
};

const ALL_TAG_PAIRS = NEARBY_CATEGORIES.flatMap((category) =>
  NEARBY_CATEGORY_TAGS[category].map((tag) => {
    const [key, value] = tag.split('=');
    return { category, key, value };
  }),
);

/** One request for every category — switching chips then needs no network. */
function buildQuery({ latitude, longitude }: GeoPoint): string {
  const around = `(around:${NEARBY_SEARCH_RADIUS_METERS},${latitude},${longitude})`;
  const selectors = ALL_TAG_PAIRS.map(({ key, value }) => `nwr["${key}"="${value}"]${around};`).join('');
  return `[out:json][timeout:15];(${selectors});out center qt;`;
}

function categorize(tags: Record<string, string> | undefined): NearbyPlaceCategory | null {
  if (!tags) return null;
  const match = ALL_TAG_PAIRS.find(({ key, value }) => tags[key] === value);
  return match?.category ?? null;
}

function parseElement(element: OverpassElement, origin: GeoPoint): NearbyPlace | null {
  const latitude = element.lat ?? element.center?.lat;
  const longitude = element.lon ?? element.center?.lon;
  const name = element.tags?.name?.trim();
  const category = categorize(element.tags);

  if (latitude === undefined || longitude === undefined || !name || !category) return null;

  return {
    id: `${element.type}/${element.id}`,
    name,
    category,
    latitude,
    longitude,
    address: buildAddressFromTags(element.tags),
    distanceMeters: haversineDistanceMeters(origin, { latitude, longitude }),
  };
}

export function groupPlacesByCategory(places: NearbyPlace[]): NearbyPlacesByCategory {
  const grouped: NearbyPlacesByCategory = { veterinary: [], pet_shop: [], pet_grooming: [] };

  for (const category of NEARBY_CATEGORIES) {
    const seen = new Set<string>();
    grouped[category] = places
      .filter((place) => place.category === category)
      .sort((a, b) => a.distanceMeters - b.distanceMeters)
      .filter((place) => {
        const key = place.name.toLocaleLowerCase('tr');
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .slice(0, MAX_RESULTS_PER_CATEGORY);
  }

  return grouped;
}

async function postWithTimeout(endpoint: string, body: string): Promise<OverpassResponse> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        // Overpass asks clients to identify themselves.
        'User-Agent': 'Petavie/1.0 (com.petavie.app)',
      },
      body,
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`Overpass ${response.status}`);
    return (await response.json()) as OverpassResponse;
  } finally {
    clearTimeout(timer);
  }
}

export async function fetchNearbyPlacesFromOverpass(
  location: GeoPoint,
): Promise<NearbyPlacesByCategory> {
  const body = `data=${encodeURIComponent(buildQuery(location))}`;

  for (const endpoint of OVERPASS_ENDPOINTS) {
    try {
      const payload = await postWithTimeout(endpoint, body);
      const places = (payload.elements ?? [])
        .map((element) => parseElement(element, location))
        .filter((place): place is NearbyPlace => place !== null);
      return groupPlacesByCategory(places);
    } catch {
      // Busy, timed out or offline — try the next mirror.
    }
  }

  throw new AppError('Yakındaki yerler yüklenemedi. Lütfen tekrar dene.');
}
