import { useLocalSearchParams, useRouter } from 'expo-router';

import { StackScreen } from '@/components/ui/stack-screen';
import { EmptyState } from '@/components/ui/state-views';
import { AnimalGuideDetail } from '@/features/guide/components/animal-guide-detail';
import { getGuideAnimal, getGuideMeta } from '@/features/guide/service';

export default function GuideAnimalScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const animal = getGuideAnimal(id ?? '');
  const meta = getGuideMeta();

  if (!animal) {
    return (
      <StackScreen title="Tür rehberi" scrollable={false}>
        <EmptyState
          title="Bu türü bulamadık"
          description="Listeye dönüp başka bir hayvan seç."
          actionLabel="Listeye dön"
          onAction={() => router.replace('/(tabs)/community')}
        />
      </StackScreen>
    );
  }

  return (
    <StackScreen title={animal.name} scrollable>
      <AnimalGuideDetail animal={animal} disclaimer={meta.disclaimer} />
    </StackScreen>
  );
}
