import { useQuery } from '@tanstack/react-query';

import { LOCAL_OWNER_ID } from '@/constants/owner';
import { getPet, listPets } from '@/features/pets/service';

export const petKeys = {
  all: ['pets'] as const,
  lists: () => [...petKeys.all, 'list'] as const,
  list: (ownerId: string) => [...petKeys.lists(), ownerId] as const,
  detail: (petId: string) => [...petKeys.all, 'detail', petId] as const,
};

export function usePets() {
  return useQuery({
    queryKey: petKeys.list(LOCAL_OWNER_ID),
    queryFn: () => listPets(LOCAL_OWNER_ID),
  });
}

export function usePet(petId: string) {
  return useQuery({
    queryKey: petKeys.detail(petId),
    queryFn: () => getPet(petId),
    enabled: petId.length > 0,
  });
}
