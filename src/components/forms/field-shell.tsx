import type { ReactNode } from 'react';
import { Text, View } from 'react-native';

/** Shared look of every form control, so inputs and pickers line up exactly. */
export const CONTROL_CLASS = 'min-h-[48px] rounded-xl border bg-surface px-4';

export function controlBorderClass(hasError: boolean, isActive: boolean): string {
  if (hasError) return 'border-danger-500';
  return isActive ? 'border-brand-500 border-[1.5px]' : 'border-surface-sunken';
}

type FieldShellProps = {
  label: string;
  children: ReactNode;
  error?: string;
  /** Shown only while there is no error, so the row never grows twice. */
  hint?: string;
};

export function FieldShell({ label, children, error, hint }: FieldShellProps) {
  return (
    <View className="w-full gap-1.5">
      <Text className="text-sm font-medium text-ink-700">{label}</Text>
      {children}
      {error ? (
        <Text accessibilityLiveRegion="polite" className="text-sm text-danger-500">
          {error}
        </Text>
      ) : hint ? (
        <Text className="text-sm text-ink-500">{hint}</Text>
      ) : null}
    </View>
  );
}
