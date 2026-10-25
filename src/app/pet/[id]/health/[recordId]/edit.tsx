import { useLocalSearchParams, useRouter } from 'expo-router';

import { StackScreen } from '@/components/ui/stack-screen';
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/state-views';
import { HealthRecordForm } from '@/features/health/components/health-record-form';
import { toHealthRecordFormValues } from '@/features/health/health-record-utils';
import { useUpdateHealthRecord } from '@/features/health/hooks/use-health-record-mutations';
import { useHealthRecord } from '@/features/health/hooks/use-health-records';
import { petScreenTitles } from '@/features/pets/navigation';
import { toUserFacingError } from '@/utils/errors';

export default function EditHealthRecordScreen() {
  const { id, recordId } = useLocalSearchParams<{ id: string; recordId: string }>();
  const petId = id ?? '';
  const healthRecordId = recordId ?? '';

  const router = useRouter();
  const record = useHealthRecord(healthRecordId);
  const updateRecord = useUpdateHealthRecord(petId, healthRecordId);

  if (record.isPending) {
    return (
      <StackScreen title={petScreenTitles.healthEdit}>
        <LoadingState label="Kayıt yükleniyor…" />
      </StackScreen>
    );
  }

  if (record.isError) {
    return (
      <StackScreen title={petScreenTitles.healthEdit}>
        <ErrorState
          description={toUserFacingError(record.error).message}
          onRetry={() => void record.refetch()}
        />
      </StackScreen>
    );
  }

  if (!record.data) {
    return (
      <StackScreen title={petScreenTitles.healthEdit}>
        <EmptyState
          title="Bu kaydı bulamadık"
          description="Kayıt silinmiş olabilir. Geri dönüp tekrar dene."
          actionLabel="Geri dön"
          onAction={() => router.back()}
        />
      </StackScreen>
    );
  }

  return (
    <StackScreen title={petScreenTitles.healthEdit} scrollable>
      <HealthRecordForm
        initialValues={toHealthRecordFormValues(record.data)}
        submitLabel="Değişiklikleri kaydet"
        isSubmitting={updateRecord.isPending}
        errorMessage={
          updateRecord.isError ? toUserFacingError(updateRecord.error).message : undefined
        }
        onSubmit={(values) =>
          updateRecord.mutate(values, {
            onSuccess: () => router.back(),
          })
        }
      />
    </StackScreen>
  );
}
