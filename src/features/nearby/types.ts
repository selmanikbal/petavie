export type NearbyPlaceCategory = 'veterinary' | 'pet_shop' | 'pet_grooming';

export type NearbyPlace = {
  id: string;
  name: string;
  category: NearbyPlaceCategory;
  latitude: number;
  longitude: number;
  address: string | null;
  distanceMeters: number;
};

export type GeoPoint = {
  latitude: number;
  longitude: number;
};
