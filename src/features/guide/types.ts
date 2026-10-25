export type AnimalCare = {
  nutrition: string;
  grooming: string;
  exercise: string;
  habitat: string;
};

export type GuideArticle = {
  id: string;
  title: string;
  description: string;
  category: string;
};

export type GuideFaq = {
  id: string;
  question: string;
  answer: string;
  category: string;
};

export type GuideAnimal = {
  id: string;
  name: string;
  category: string;
  lifespan: string;
  careDifficulty: string;
  summary: string;
  care: AnimalCare;
  tips: string[];
  healthWarningSigns: string[];
  medicalDisclaimer: string;
  careTips: GuideArticle[];
  faqs: GuideFaq[];
};

export type SharedGuideArticle = GuideArticle & {
  species: string[];
};

export type SharedGuideFaq = GuideFaq & {
  species: string[];
};

export type GuideMeta = {
  title: string;
  language: string;
  version: string;
  disclaimer: string;
};

export type PetGuideDataset = {
  meta: GuideMeta;
  animals: GuideAnimal[];
  faqs: SharedGuideFaq[];
  careTips: SharedGuideArticle[];
};
