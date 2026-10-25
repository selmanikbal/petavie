import { useLocalSearchParams, useRouter } from 'expo-router';

import { StackScreen } from '@/components/ui/stack-screen';
import { HealthRecordForm } from '@/features/health/components/health-record-form';
import { petScreenTitles } from '@/features/pets/navigation';
import { useCreateHealthRecord } from '@/features/health/hooks/use-health-record-mutations';
import { toUserFacingError } from '@/utils/errors';

export default function NewHealthRecordScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const petId = id ?? '';

  const router = useRouter();
  const createRecord = useCreateHealthRecord(petId);

  return (
    <StackScreen title={petScreenTitles.healthNew} scrollable>
      <HealthRecordForm
        submitLabel="Kaydet"
        isSubmitting={createRecord.isPending}
        errorMessage={
          createRecord.isError ? toUserFacingError(createRecord.error).message : undefined
        }
        onSubmit={(values) =>
          createRecord.mutate(values, {
            onSuccess: () => router.back(),
          })
        }
      />
    </StackScreen>
  );
}
