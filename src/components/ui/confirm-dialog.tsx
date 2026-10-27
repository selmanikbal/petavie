import { Modal, Text, View } from 'react-native';

import { Button } from '@/components/ui/button';

type ConfirmDialogProps = {
  visible: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Use for irreversible actions such as deleting a pet. */
  destructive?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  testID?: string;
};

/**
 * Blocking confirmation for actions that cannot be undone.
 * Built on Modal instead of Alert so the copy and buttons match the app.
 */
export function ConfirmDialog({
  visible,
  title,
  description,
  confirmLabel = 'Onayla',
  cancelLabel = 'Vazgeç',
  destructive = false,
  loading = false,
  onConfirm,
  onCancel,
  testID,
}: ConfirmDialogProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
      statusBarTranslucent
      navigationBarTranslucent>
      {/* The backdrop is not tappable on purpose: the choice must be explicit. */}
      <View className="flex-1 items-center justify-center bg-black/40 px-6">
        <View
          testID={testID}
          className="w-full max-w-[420px] gap-2 rounded-3xl bg-surface p-6">
          <Text accessibilityRole="header" className="text-xl font-bold text-ink-900">
            {title}
          </Text>
          <Text className="text-base leading-6 text-ink-500">{description}</Text>

          <View className="mt-4 gap-2">
            <Button
              testID="confirm-dialog-confirm"
              label={confirmLabel}
              variant={destructive ? 'danger' : 'primary'}
              loading={loading}
              onPress={onConfirm}
            />
            <Button
              testID="confirm-dialog-cancel"
              label={cancelLabel}
              variant="ghost"
              disabled={loading}
              onPress={onCancel}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}
