import {
  NEARBY_CATEGORY_TAGS,
  NEARBY_SEARCH_RADIUS_METERS,
} from '@/features/nearby/constants';
import type { GeoPoint, NearbyPlace, NearbyPlaceCategory } from '@/features/nearby/types';
import {
  buildAddressFromTags,
  haversineDistanceMeters,
} from '@/features/nearby/utils';
import { AppError } from '@/utils/errors';

const OVERPASS_ENDPOINT = 'https://overpass-api.de/api/interpreter';
const MAX_RESULTS = 20;

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

function buildQuery(location: GeoPoint, category: NearbyPlaceCategory): string {
  const radius = NEARBY_SEARCH_RADIUS_METERS;
  const { latitude, longitude } = location;
  const tagFilters = NEARBY_CATEGORY_TAGS[category];

  const selectors = tagFilters
    .map((tag) => {
      const [key, value] = tag.split('=');
      return `
        node["${key}"="${value}"](around:${radius},${latitude},${longitude});
        way["${key}"="${value}"](around:${radius},${latitude},${longitude});
      `;
    })
    .join('');

  return `[out:json][timeout:25];(${selectors});out center;`;
}

function parseElement(
  element: OverpassElement,
  category: NearbyPlaceCategory,
  origin: GeoPoint,
): NearbyPlace | null {
  const latitude = element.lat ?? element.center?.lat;
  const longitude = element.lon ?? element.center?.lon;
  const name = element.tags?.name?.trim();

  if (latitude === undefined || longitude === undefined || !name) return null;

  const point = { latitude, longitude };

  return {
    id: `${element.type}/${element.id}`,
    name,
    category,
    latitude,
    longitude,
    address: buildAddressFromTags(element.tags),
    distanceMeters: haversineDistanceMeters(origin, point),
  };
}

export async function fetchNearbyPlacesFromOverpass(
  location: GeoPoint,
  category: NearbyPlaceCategory,
): Promise<NearbyPlace[]> {
  const response = await fetch(OVERPASS_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `data=${encodeURIComponent(buildQuery(location, category))}`,
  });

  if (!response.ok) {
    throw new AppError('Yakındaki yerler yüklenemedi. Lütfen tekrar dene.');
  }

  const payload = (await response.json()) as OverpassResponse;
  const seen = new Set<string>();

  const places =
    payload.elements
      ?.map((element) => parseElement(element, category, location))
      .filter((place): place is NearbyPlace => place !== null)
      .filter((place) => {
        const key = place.name.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .sort((a, b) => a.distanceMeters - b.distanceMeters)
      .slice(0, MAX_RESULTS) ?? [];

  return places;
}
