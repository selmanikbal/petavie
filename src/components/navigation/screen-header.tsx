import { Text, View } from 'react-native';

import { HeaderBackButton } from '@/components/navigation/header-back-button';

type ScreenHeaderProps = {
  title: string;
};

/** Stack ekranları için geri butonu + başlık. */
export function ScreenHeader({ title }: ScreenHeaderProps) {
  return (
    <View className="mb-5 flex-row items-center gap-2">
      <HeaderBackButton iconOnly />
      <Text
        accessibilityRole="header"
        className="flex-1 text-xl font-semibold text-ink-900"
        numberOfLines={1}>
        {title}
      </Text>
    </View>
  );
}
