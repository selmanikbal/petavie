import Ionicons from '@expo/vector-icons/Ionicons';
import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';

import { BrandColors } from '@/constants/theme';

export const CARD_CLASS =
  'w-full rounded-2xl border border-surface-sunken bg-surface p-4 shadow-sm';

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <View className={`${CARD_CLASS} ${className ?? ''}`}>{children}</View>;
}

type ListItemProps = {
  title: string;
  subtitle?: string;
  /** Usually an Avatar. */
  leading?: ReactNode;
  onPress?: () => void;
  testID?: string;
};

/** Tappable row used by settings-style screens. */
export function ListItem({ title, subtitle, leading, onPress, testID }: ListItemProps) {
  const content = (
    <>
      {leading}
      <View className="flex-1 gap-0.5">
        <Text className="text-base font-semibold text-ink-900" numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text className="text-sm text-ink-500" numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {onPress ? (
        <Ionicons name="chevron-forward" size={18} color={BrandColors.ink500} />
      ) : null}
    </>
  );

  const className = `${CARD_CLASS} flex-row items-center gap-4 active:opacity-90`;

  if (!onPress) {
    return <View className={className}>{content}</View>;
  }

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={subtitle ? `${title}, ${subtitle}` : title}
      onPress={onPress}
      className={className}>
      {content}
    </Pressable>
  );
}
