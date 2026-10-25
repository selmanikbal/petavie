import { ScreenHeader } from '@/components/navigation/screen-header';
import { Screen, type ScreenProps } from '@/components/ui/screen';

type StackScreenProps = Omit<ScreenProps, 'keyboardVerticalOffset'> & {
  title: string;
  /** Stack başlığını gizle — yalnızca özel header kullanan ekranlar için. */
  hideHeader?: boolean;
};

/**
 * Stack altındaki form/detay ekranları: geri butonu, başlık, güvenli alan.
 */
export function StackScreen({
  title,
  hideHeader = false,
  children,
  edges = ['top', 'bottom'],
  ...props
}: StackScreenProps) {
  return (
    <Screen {...props} edges={edges}>
      {!hideHeader ? <ScreenHeader title={title} /> : null}
      {children}
    </Screen>
  );
}
