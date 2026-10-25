import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets, type Edge } from 'react-native-safe-area-context';

import { tabBarScrollInset } from '@/constants/theme';

export type ScreenProps = {
  children: ReactNode;
  /** Wraps content in a ScrollView. Turn off for FlatList screens. */
  scrollable?: boolean;
  /** Centers content vertically — useful for empty and error states. */
  centered?: boolean;
  /** Drop `top` on screens that sit under a navigation header. */
  edges?: readonly Edge[];
  /**
   * Adds bottom padding for scroll content above the floating tab bar.
   * Use on tab screens only.
   */
  tabBarInset?: boolean;
  /**
   * Only used for non-scrollable screens under a stack header.
   * Scrollable forms rely on `automaticallyAdjustKeyboardInsets` instead.
   */
  keyboardVerticalOffset?: number;
  className?: string;
};

/**
 * Screen shell: safe areas, keyboard avoidance, max content width on
 * tablets/web, consistent horizontal padding. Every screen renders inside this.
 */
export function Screen({
  children,
  scrollable = false,
  centered = false,
  edges = ['top', 'bottom'],
  tabBarInset = false,
  keyboardVerticalOffset = 0,
  className,
}: ScreenProps) {
  const insets = useSafeAreaInsets();
  const bottomInset = tabBarInset ? tabBarScrollInset(insets.bottom) : 0;
  const resolvedEdges = tabBarInset ? (['top'] as const) : edges;

  const content = (
    <View
      className={`w-full max-w-[560px] px-4 ${scrollable ? '' : 'flex-1'} ${
        centered ? 'justify-center' : ''
      }`}
      style={!scrollable && tabBarInset ? { paddingBottom: bottomInset } : undefined}>
      {children}
    </View>
  );

  return (
    <SafeAreaView className={`flex-1 bg-surface-canvas ${className ?? ''}`} edges={resolvedEdges}>
      {scrollable ? (
        <ScrollView
          className="flex-1"
          contentContainerClassName="items-center py-6"
          contentContainerStyle={tabBarInset ? { paddingBottom: bottomInset } : undefined}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          automaticallyAdjustKeyboardInsets={Platform.OS === 'ios'}
          showsVerticalScrollIndicator={false}>
          {content}
        </ScrollView>
      ) : (
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={keyboardVerticalOffset}>
          <View className="flex-1 items-center py-6">{content}</View>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
}
