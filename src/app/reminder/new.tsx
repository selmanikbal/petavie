import { useRouter } from 'expo-router';

import { StackScreen } from '@/components/ui/stack-screen';
import { EmptyState, LoadingState } from '@/components/ui/state-views';
import { usePets } from '@/features/pets/hooks/use-pets';
import { ReminderForm } from '@/features/reminders/components/reminder-form';
import { useCreateReminder } from '@/features/reminders/hooks/use-reminder-mutations';
import { reminderScreenTitles } from '@/features/reminders/navigation';
import { toUserFacingError } from '@/utils/errors';

export default function NewReminderScreen() {
  const router = useRouter();
  const pets = usePets();
  const createReminder = useCreateReminder();

  if (pets.isPending) {
    return (
      <StackScreen title={reminderScreenTitles.new}>
        <LoadingState label="Yükleniyor…" />
      </StackScreen>
    );
  }

  if (!pets.data || pets.data.length === 0) {
    return (
      <StackScreen title={reminderScreenTitles.new}>
        <EmptyState
          title="Önce bir dost ekle"
          description="Hatırlatma oluşturmak için en az bir evcil hayvan kaydı gerekli."
          actionLabel="Dost ekle"
          onAction={() => router.replace('/pet/new')}
        />
      </StackScreen>
    );
  }

  return (
    <StackScreen title={reminderScreenTitles.new} scrollable>
      <ReminderForm
        submitLabel="Kaydet"
        isSubmitting={createReminder.isPending}
        errorMessage={
          createReminder.isError ? toUserFacingError(createReminder.error).message : undefined
        }
        onSubmit={(values) =>
          createReminder.mutate(values, {
            onSuccess: () => router.back(),
          })
        }
      />
    </StackScreen>
  );
}
