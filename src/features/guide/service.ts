import type {
  GuideAnimal,
  GuideMeta,
  PetGuideDataset,
  SharedGuideArticle,
  SharedGuideFaq,
} from '@/features/guide/types';

import rawDataset from './data/pet-guide.json';

const dataset = rawDataset as PetGuideDataset;

export function getGuideMeta(): GuideMeta {
  return dataset.meta;
}

export function listGuideAnimals(): GuideAnimal[] {
  return dataset.animals;
}

export function listGuideCategories(): string[] {
  const seen = new Set<string>();
  const categories: string[] = [];

  for (const animal of dataset.animals) {
    if (seen.has(animal.category)) continue;
    seen.add(animal.category);
    categories.push(animal.category);
  }

  return categories;
}

export function getGuideAnimal(id: string): GuideAnimal | undefined {
  return dataset.animals.find((animal) => animal.id === id);
}

export function listGeneralCareTips(): SharedGuideArticle[] {
  return dataset.careTips;
}

export function listGeneralFaqs(): SharedGuideFaq[] {
  return dataset.faqs;
}
