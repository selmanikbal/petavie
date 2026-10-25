import { ActivityIndicator, Pressable, Text } from 'react-native';

import { BrandColors } from '@/constants/theme';

type ButtonVariant = 'primary' | 'secondary' | 'soft' | 'ghost' | 'danger';

type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  accessibilityHint?: string;
  testID?: string;
};

const containerStyles: Record<ButtonVariant, string> = {
  primary: 'bg-brand-500 active:bg-brand-600',
  secondary: 'border border-surface-sunken bg-surface active:bg-surface-canvas',
  soft: 'bg-brand-100 active:opacity-80',
  ghost: 'bg-transparent',
  danger: 'bg-danger-500 active:bg-danger-600',
};

const labelStyles: Record<ButtonVariant, string> = {
  primary: 'text-white',
  secondary: 'text-ink-900',
  soft: 'text-brand-600',
  ghost: 'text-brand-600',
  danger: 'text-white',
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  accessibilityHint,
  testID,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      accessibilityHint={accessibilityHint}
      testID={testID}
      disabled={isDisabled}
      onPress={onPress}
      className={`min-h-[48px] w-full flex-row items-center justify-center rounded-xl px-5 py-3.5 ${
        containerStyles[variant]
      } ${isDisabled ? 'opacity-50' : ''}`}>
      {loading ? (
        <ActivityIndicator
          color={
            variant === 'primary' || variant === 'danger'
              ? BrandColors.white
              : BrandColors.brand600
          }
        />
      ) : (
        <Text className={`text-base font-semibold ${labelStyles[variant]}`}>{label}</Text>
      )}
    </Pressable>
  );
}
