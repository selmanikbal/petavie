import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, View, type LayoutChangeEvent } from 'react-native';

import { BrandColors } from '@/constants/theme';
import { getAnimalGuideImageUrl } from '@/features/guide/images';

const LIST_THUMB_WIDTH = 64;

type AnimalGuideImageProps = {
  animalId: string;
  animalName: string;
  size?: 'sm' | 'hero';
};

export function AnimalGuideImage({
  animalId,
  animalName,
  size = 'sm',
}: AnimalGuideImageProps) {
  const uri = getAnimalGuideImageUrl(animalId);
  const [failed, setFailed] = useState(false);
  const [loading, setLoading] = useState(Boolean(uri));
  const [intrinsicSize, setIntrinsicSize] = useState<{ width: number; height: number } | null>(
    null,
  );
  const [heroWidth, setHeroWidth] = useState(0);
  const isHero = size === 'hero';
  const showFallback = !uri || failed;

  useEffect(() => {
    setFailed(false);
    setLoading(Boolean(uri));
    setIntrinsicSize(null);
  }, [animalId, uri]);

  const layoutSize = useMemo(() => {
    if (!intrinsicSize || intrinsicSize.width <= 0) {
      return null;
    }
    const ratio = intrinsicSize.height / intrinsicSize.width;
    if (isHero) {
      if (heroWidth <= 0) {
        return null;
      }
      return { width: heroWidth, height: heroWidth * ratio };
    }
    return { width: LIST_THUMB_WIDTH, height: LIST_THUMB_WIDTH * ratio };
  }, [heroWidth, intrinsicSize, isHero]);

  const onHeroLayout = (event: LayoutChangeEvent) => {
    const nextWidth = event.nativeEvent.layout.width;
    if (nextWidth > 0 && nextWidth !== heroWidth) {
      setHeroWidth(nextWidth);
    }
  };

  return (
    <View
      className={`self-start overflow-hidden rounded-2xl bg-surface-canvas ${
        isHero ? 'w-full' : 'bg-surface-sunken'
      }`}
      onLayout={isHero ? onHeroLayout : undefined}
      style={
        layoutSize
          ? { width: layoutSize.width, height: layoutSize.height }
          : isHero
            ? { width: '100%', minHeight: 120 }
            : { width: LIST_THUMB_WIDTH, minHeight: LIST_THUMB_WIDTH }
      }>
      {!showFallback ? (
        <>
          <Image
            source={{ uri }}
            style={
              layoutSize
                ? { width: layoutSize.width, height: layoutSize.height }
                : { width: '100%', height: '100%' }
            }
            contentFit="fill"
            cachePolicy="disk"
            recyclingKey={`${animalId}-${size}`}
            transition={200}
            accessibilityLabel={`${animalName} görseli`}
            onLoad={(event) => {
              const { width, height } = event.source;
              if (width > 0 && height > 0) {
                setIntrinsicSize({ width, height });
              }
              setLoading(false);
            }}
            onError={() => {
              setFailed(true);
              setLoading(false);
            }}
          />
          {loading ? (
            <View className="absolute inset-0 items-center justify-center bg-surface-canvas">
              <ActivityIndicator size="small" color={BrandColors.brand500} />
            </View>
          ) : null}
        </>
      ) : (
        <View
          className="flex-1 items-center justify-center bg-surface-tint"
          style={isHero ? { minHeight: 120 } : { width: LIST_THUMB_WIDTH, height: LIST_THUMB_WIDTH }}>
          <Ionicons name="paw" size={isHero ? 36 : 22} color={BrandColors.brand500} />
        </View>
      )}
    </View>
  );
}
