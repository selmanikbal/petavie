import type { GeoPoint } from '@/features/nearby/types';

const EARTH_RADIUS_METERS = 6_371_000;

export function haversineDistanceMeters(a: GeoPoint, b: GeoPoint): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

  return 2 * EARTH_RADIUS_METERS * Math.asin(Math.sqrt(h));
}

export function formatDistanceMeters(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

export function buildAddressFromTags(tags: Record<string, string> | undefined): string | null {
  if (!tags) return null;

  const street = [tags['addr:street'], tags['addr:housenumber']].filter(Boolean).join(' ');
  const district = tags['addr:suburb'] ?? tags['addr:district'] ?? tags['addr:neighbourhood'];
  const city = tags['addr:city'] ?? tags['addr:town'] ?? tags['addr:province'];
  const parts = [street, district, city].filter(Boolean);

  return parts.length > 0 ? parts.join(', ') : null;
}
