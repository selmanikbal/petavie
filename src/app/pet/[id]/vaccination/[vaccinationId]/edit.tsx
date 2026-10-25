import { useLocalSearchParams, useRouter } from 'expo-router';

import { StackScreen } from '@/components/ui/stack-screen';
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/state-views';
import { VaccinationForm } from '@/features/health/components/vaccination-form';
import { useUpdateVaccination } from '@/features/health/hooks/use-vaccination-mutations';
import { useVaccination } from '@/features/health/hooks/use-vaccinations';
import { toVaccinationFormValues } from '@/features/health/vaccination-utils';
import { petScreenTitles } from '@/features/pets/navigation';
import { toUserFacingError } from '@/utils/errors';

export default function EditVaccinationScreen() {
  const { id, vaccinationId } = useLocalSearchParams<{ id: string; vaccinationId: string }>();
  const petId = id ?? '';
  const recordId = vaccinationId ?? '';

  const router = useRouter();
  const vaccination = useVaccination(recordId);
  const updateVaccination = useUpdateVaccination(petId, recordId);

  if (vaccination.isPending) {
    return (
      <StackScreen title={petScreenTitles.vaccinationEdit}>
        <LoadingState label="Kayıt yükleniyor…" />
      </StackScreen>
    );
  }

  if (vaccination.isError) {
    return (
      <StackScreen title={petScreenTitles.vaccinationEdit}>
        <ErrorState
          description={toUserFacingError(vaccination.error).message}
          onRetry={() => void vaccination.refetch()}
        />
      </StackScreen>
    );
  }

  if (!vaccination.data) {
    return (
      <StackScreen title={petScreenTitles.vaccinationEdit}>
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
    <StackScreen title={petScreenTitles.vaccinationEdit} scrollable>
      <VaccinationForm
        initialValues={toVaccinationFormValues(vaccination.data)}
        submitLabel="Değişiklikleri kaydet"
        isSubmitting={updateVaccination.isPending}
        errorMessage={
          updateVaccination.isError
            ? toUserFacingError(updateVaccination.error).message
            : undefined
        }
        onSubmit={(values) =>
          updateVaccination.mutate(values, {
            onSuccess: () => router.back(),
          })
        }
      />
    </StackScreen>
  );
}
