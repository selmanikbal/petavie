import { ActivityIndicator, Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { BrandColors } from '@/constants/theme';

/**
 * Loading / empty / error states.
 * Every screen renders one of these instead of a blank view.
 */
export function LoadingState({ label = 'Yükleniyor…' }: { label?: string }) {
  return (
    <View className="flex-1 items-center justify-center gap-3" accessibilityRole="progressbar">
      <ActivityIndicator color={BrandColors.brand500} />
      <Text className="text-base text-ink-500">{label}</Text>
    </View>
  );
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <View className="flex-1 items-center justify-center gap-3 px-2">
      <Text className="text-center text-xl font-semibold text-ink-900">{title}</Text>
      <Text className="text-center text-base leading-6 text-ink-500">{description}</Text>
      {actionLabel && onAction ? (
        <View className="mt-2 w-full">
          <Button label={actionLabel} onPress={onAction} />
        </View>
      ) : null}
    </View>
  );
}

export function ErrorState({
  title = 'Bir şeyler ters gitti',
  description,
  onRetry,
}: {
  title?: string;
  description: string;
  onRetry?: () => void;
}) {
  return (
    <View className="flex-1 items-center justify-center gap-3 px-2">
      <Text className="text-center text-xl font-semibold text-ink-900">{title}</Text>
      <Text className="text-center text-base leading-6 text-ink-500">{description}</Text>
      {onRetry ? (
        <View className="mt-2 w-full">
          <Button label="Tekrar dene" variant="secondary" onPress={onRetry} />
        </View>
      ) : null}
    </View>
  );
}

export function InlineMessage({
  tone,
  message,
}: {
  tone: 'error' | 'info' | 'success';
  message: string;
}) {
  const toneClass =
    tone === 'error'
      ? 'bg-danger-50 text-danger-500'
      : tone === 'success'
        ? 'bg-brand-50 text-success-500'
        : 'border border-brand-100 bg-brand-50 text-ink-700';

  return (
    <View className={`w-full rounded-2xl px-4 py-3 ${toneClass}`}>
      <Text accessibilityLiveRegion="polite" className={`text-sm ${toneClass}`}>
        {message}
      </Text>
    </View>
  );
}
