import { useContext, useRef, type ComponentRef } from 'react';
import type { View } from 'react-native';

type ViewInstance = ComponentRef<typeof View>;

import { ScreenScrollContext } from '@/components/ui/screen';

/** Space left above the field so its label stays visible. */
const TOP_GAP = 16;

/**
 * Scrolls the screen to the first invalid field, in on-screen order.
 *
 *   const { fieldRef, scrollToFirstError } = useScrollToFirstError(FIELD_ORDER);
 *   <View ref={fieldRef('title')}>…</View>
 *   handleSubmit(onValid, scrollToFirstError)
 *
 * Works inside a `scrollable` Screen; elsewhere it does nothing.
 */
export function useScrollToFirstError<Name extends string>(order: readonly Name[]) {
  const scrollRef = useContext(ScreenScrollContext);
  const nodes = useRef(new Map<Name, ViewInstance>());

  const fieldRef = (name: Name) => (node: ViewInstance | null) => {
    if (node) nodes.current.set(name, node);
    else nodes.current.delete(name);
  };

  const scrollToFirstError = (errors: Partial<Record<string, unknown>>) => {
    const scrollView = scrollRef?.current;
    const content = scrollView?.getInnerViewRef();
    // Hidden fields (e.g. other schedule mode) are unmounted, so they are skipped.
    const first = order.find((name) => errors[name] && nodes.current.has(name));
    const node = first ? nodes.current.get(first) : undefined;
    if (!scrollView || !content || !node) return;

    node.measureLayout(content, (_x, y) => {
      scrollView.scrollTo({ y: Math.max(0, y - TOP_GAP), animated: true });
    });
  };

  return { fieldRef, scrollToFirstError };
}
