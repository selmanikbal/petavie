import { Text, View } from 'react-native';

import { Accordion } from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';
import type { SharedGuideArticle, SharedGuideFaq } from '@/features/guide/types';

type GeneralGuideDetailProps = {
  careTips: SharedGuideArticle[];
  faqs: SharedGuideFaq[];
  disclaimer: string;
};

export function GeneralGuideDetail({ careTips, faqs, disclaimer }: GeneralGuideDetailProps) {
  return (
    <View className="gap-6">
      <View className="gap-1">
        <Text accessibilityRole="header" className="text-3xl font-bold text-ink-900">
          Genel bilgiler
        </Text>
        <Text className="text-base text-ink-500">
          Tüm evcil hayvanlar için bakım önerileri ve sık sorulanlar.
        </Text>
      </View>

      <Card className="gap-3">
        <Text className="text-lg font-bold text-ink-900">Bakım önerileri</Text>
        <Accordion
          items={careTips.map((tip) => ({
            id: tip.id,
            title: tip.title,
            subtitle: tip.category,
            content: tip.description,
          }))}
        />
      </Card>

      <Card className="gap-3">
        <Text className="text-lg font-bold text-ink-900">Sık sorulanlar</Text>
        <Accordion
          items={faqs.map((faq) => ({
            id: faq.id,
            title: faq.question,
            subtitle: faq.category,
            content: faq.answer,
          }))}
        />
      </Card>

      <Text className="text-sm leading-5 text-ink-500">{disclaimer}</Text>
    </View>
  );
}
