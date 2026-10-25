import { ALL_ANIMAL_CATEGORIES } from '@/features/guide/constants';
import type { GuideAnimal } from '@/features/guide/types';

export function filterGuideAnimals(
  animals: GuideAnimal[],
  category: string,
  query = '',
): GuideAnimal[] {
  const normalized = query.trim().toLocaleLowerCase('tr');

  return animals.filter((animal) => {
    if (category !== ALL_ANIMAL_CATEGORIES && animal.category !== category) {
      return false;
    }
    if (!normalized) return true;

    return [animal.name, animal.category, animal.summary].some((value) =>
      value.toLocaleLowerCase('tr').includes(normalized),
    );
  });
}

export function animalGuideSubtitle(animal: GuideAnimal): string {
  return `${animal.category} · ${animal.lifespan} · ${animal.careDifficulty}`;
}
