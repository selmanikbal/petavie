import Ionicons from '@expo/vector-icons/Ionicons';
import { ActivityIndicator, Pressable, Text } from 'react-native';

import { useThemeColors } from '@/constants/theme';

type PrimaryActionButtonProps = {
  label: string;
  onPress: () => void;
  loading?: boolean;
  testID?: string;
  compact?: boolean;
};

export function PrimaryActionButton({
  label,
  onPress,
  loading = false,
  testID,
  compact = false,
}: PrimaryActionButtonProps) {
  const colors = useThemeColors();
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      disabled={loading}
      onPress={onPress}
      className={`flex-row items-center justify-center gap-1.5 rounded-xl bg-brand-500 active:bg-brand-solid ${
        compact ? 'px-4 py-2.5' : 'px-5 py-3.5'
      } ${loading ? 'opacity-70' : ''}`}>
      {loading ? (
        <ActivityIndicator color={colors.white} />
      ) : (
        <>
          <Ionicons name="add" size={18} color={colors.white} />
          <Text className={`font-semibold text-white ${compact ? 'text-sm' : 'text-base'}`}>
            {label}
          </Text>
        </>
      )}
    </Pressable>
  );
}
