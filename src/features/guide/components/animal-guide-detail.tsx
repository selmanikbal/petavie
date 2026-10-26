import type { ReactNode } from 'react';
import { Text, View } from 'react-native';

import { Accordion } from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';
import { AnimalGuideImage } from '@/features/guide/components/animal-guide-image';
import {
  CARE_SECTION_LABELS,
  CARE_SECTION_ORDER,
  GUIDE_IMAGE_CREDIT,
} from '@/features/guide/constants';
import type { GuideAnimal } from '@/features/guide/types';

type AnimalGuideDetailProps = {
  animal: GuideAnimal;
  disclaimer: string;
};

export function AnimalGuideDetail({ animal, disclaimer }: AnimalGuideDetailProps) {
  return (
    <View className="gap-6">
      <View className="gap-2">
        <AnimalGuideImage animalId={animal.id} animalName={animal.name} size="hero" />
        <Text accessibilityRole="header" className="text-3xl font-bold text-ink-900">
          {animal.name}
        </Text>
        <Text className="text-base text-ink-500">
          {animal.category} · Ömür {animal.lifespan} · Bakım {animal.careDifficulty}
        </Text>
        <Text className="text-base leading-6 text-ink-900">{animal.summary}</Text>
      </View>

      <Section title="Bakım">
        {CARE_SECTION_ORDER.map((key) => (
          <View key={key} className="gap-1">
            <Text className="text-sm font-semibold text-brand-600">
              {CARE_SECTION_LABELS[key]}
            </Text>
            <Text className="text-base leading-6 text-ink-900">{animal.care[key]}</Text>
          </View>
        ))}
      </Section>

      <Section title="Kısa ipuçları">
        {animal.tips.map((tip) => (
          <Text key={tip} className="text-base leading-6 text-ink-900">
            • {tip}
          </Text>
        ))}
      </Section>

      <Section title="Dikkat edilmesi gereken belirtiler">
        {animal.healthWarningSigns.map((sign) => (
          <Text key={sign} className="text-base leading-6 text-danger-500">
            • {sign}
          </Text>
        ))}
        <Text className="pt-1 text-sm leading-5 text-ink-500">{animal.medicalDisclaimer}</Text>
      </Section>

      <Section title="Bakım önerileri">
        <Accordion
          items={animal.careTips.map((tip) => ({
            id: tip.id,
            title: tip.title,
            subtitle: tip.category,
            content: tip.description,
          }))}
        />
      </Section>

      <Section title="Sık sorulanlar">
        <Accordion
          items={animal.faqs.map((faq) => ({
            id: faq.id,
            title: faq.question,
            subtitle: faq.category,
            content: faq.answer,
          }))}
        />
      </Section>

      <Text className="text-sm leading-5 text-ink-500">{disclaimer}</Text>
      <Text className="text-xs leading-4 text-ink-500">{GUIDE_IMAGE_CREDIT}</Text>
    </View>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card className="gap-3">
      <Text className="text-lg font-bold text-ink-900">{title}</Text>
      {children}
    </Card>
  );
}
