import { useLocalSearchParams, useRouter } from 'expo-router';

import { StackScreen } from '@/components/ui/stack-screen';
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/state-views';
import { MedicationForm } from '@/features/health/components/medication-form';
import { useUpdateMedication } from '@/features/health/hooks/use-medication-mutations';
import { useMedication } from '@/features/health/hooks/use-medications';
import { toMedicationFormValues } from '@/features/health/medication-utils';
import { petScreenTitles } from '@/features/pets/navigation';
import { toUserFacingError } from '@/utils/errors';

export default function EditMedicationScreen() {
  const { id, medicationId } = useLocalSearchParams<{ id: string; medicationId: string }>();
  const petId = id ?? '';
  const recordId = medicationId ?? '';

  const router = useRouter();
  const medication = useMedication(recordId);
  const updateMedication = useUpdateMedication(petId, recordId);

  if (medication.isPending) {
    return (
      <StackScreen title={petScreenTitles.medicationEdit}>
        <LoadingState label="Kayıt yükleniyor…" />
      </StackScreen>
    );
  }

  if (medication.isError) {
    return (
      <StackScreen title={petScreenTitles.medicationEdit}>
        <ErrorState
          description={toUserFacingError(medication.error).message}
          onRetry={() => void medication.refetch()}
        />
      </StackScreen>
    );
  }

  if (!medication.data) {
    return (
      <StackScreen title={petScreenTitles.medicationEdit}>
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
    <StackScreen title={petScreenTitles.medicationEdit} scrollable>
      <MedicationForm
        initialValues={toMedicationFormValues(medication.data)}
        submitLabel="Değişiklikleri kaydet"
        isSubmitting={updateMedication.isPending}
        errorMessage={
          updateMedication.isError
            ? toUserFacingError(updateMedication.error).message
            : undefined
        }
        onSubmit={(values) =>
          updateMedication.mutate(values, {
            onSuccess: () => router.back(),
          })
        }
      />
    </StackScreen>
  );
}
