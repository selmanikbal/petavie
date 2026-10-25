import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { Text, View } from 'react-native';

import { BrandColors } from '@/constants/theme';

type AvatarSize = 'sm' | 'md' | 'lg';

const sizeClass: Record<AvatarSize, string> = {
  sm: 'h-11 w-11',
  md: 'h-16 w-16',
  lg: 'h-28 w-28',
};

const textClass: Record<AvatarSize, string> = {
  sm: 'text-base',
  md: 'text-xl',
  lg: 'text-3xl',
};

const iconSize: Record<AvatarSize, number> = { sm: 20, md: 28, lg: 48 };

type AvatarProps = {
  uri?: string | null;
  /** Falls back to the first letter when there is no photo. */
  name?: string | null;
  size?: AvatarSize;
  /** Shown when there is neither a photo nor a name. */
  fallbackIcon?: keyof typeof Ionicons.glyphMap;
};

export function Avatar({ uri, name, size = 'md', fallbackIcon = 'paw' }: AvatarProps) {
  const initial = name?.trim().charAt(0).toUpperCase();

  return (
    <View
      className={`${sizeClass[size]} items-center justify-center overflow-hidden rounded-full bg-brand-100`}>
      {uri ? (
        <Image
          source={{ uri }}
          style={{ width: '100%', height: '100%' }}
          contentFit="cover"
          // Keeps list scrolling smooth on repeat visits.
          cachePolicy="memory-disk"
          transition={150}
          accessibilityLabel={name ? `${name} fotoğrafı` : 'Profil fotoğrafı'}
        />
      ) : initial ? (
        <Text className={`${textClass[size]} font-bold text-brand-600`}>{initial}</Text>
      ) : (
        <Ionicons name={fallbackIcon} size={iconSize[size]} color={BrandColors.brand600} />
      )}
    </View>
  );
}
