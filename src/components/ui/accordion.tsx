import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { BrandColors } from '@/constants/theme';

export type AccordionItem = {
  id: string;
  title: string;
  subtitle?: string;
  content: string;
};

type AccordionProps = {
  items: AccordionItem[];
};

/** Single-open FAQ-style accordion. */
export function Accordion({ items }: AccordionProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <View>
      {items.map((item, index) => {
        const isOpen = item.id === openId;

        return (
          <View
            key={item.id}
            className={index === 0 ? undefined : 'border-t border-surface-sunken'}>
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ expanded: isOpen }}
              accessibilityLabel={item.subtitle ? `${item.title}, ${item.subtitle}` : item.title}
              onPress={() => setOpenId(isOpen ? null : item.id)}
              className="flex-row items-start gap-3 py-3 active:opacity-80">
              <View className="min-w-0 flex-1 gap-0.5">
                <Text className="text-base font-semibold text-ink-900">{item.title}</Text>
                {item.subtitle ? (
                  <Text className="text-xs font-medium text-brand-600">{item.subtitle}</Text>
                ) : null}
              </View>
              <Ionicons
                name={isOpen ? 'chevron-up' : 'chevron-down'}
                size={18}
                color={BrandColors.ink500}
              />
            </Pressable>

            {isOpen ? (
              <Text className="pb-3 text-base leading-6 text-ink-900">{item.content}</Text>
            ) : null}
          </View>
        );
      })}
    </View>
  );
}
