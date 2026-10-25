import { useLocalSearchParams, useRouter } from 'expo-router';

import { StackScreen } from '@/components/ui/stack-screen';
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/state-views';
import { ReminderForm } from '@/features/reminders/components/reminder-form';
import { useUpdateReminder } from '@/features/reminders/hooks/use-reminder-mutations';
import { useReminder } from '@/features/reminders/hooks/use-reminders';
import { reminderScreenTitles } from '@/features/reminders/navigation';
import { toReminderFormValues } from '@/features/reminders/utils';
import { toUserFacingError } from '@/utils/errors';

export default function EditReminderScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const reminderId = id ?? '';

  const router = useRouter();
  const reminder = useReminder(reminderId);
  const updateReminder = useUpdateReminder(reminderId);

  if (reminder.isPending) {
    return (
      <StackScreen title={reminderScreenTitles.edit}>
        <LoadingState label="Hatırlatma yükleniyor…" />
      </StackScreen>
    );
  }

  if (reminder.isError) {
    return (
      <StackScreen title={reminderScreenTitles.edit}>
        <ErrorState
          description={toUserFacingError(reminder.error).message}
          onRetry={() => void reminder.refetch()}
        />
      </StackScreen>
    );
  }

  if (!reminder.data) {
    return (
      <StackScreen title={reminderScreenTitles.edit}>
        <EmptyState
          title="Bu hatırlatmayı bulamadık"
          description="Kayıt silinmiş olabilir. Listeye dönüp tekrar dene."
          actionLabel="Geri dön"
          onAction={() => router.back()}
        />
      </StackScreen>
    );
  }

  if (reminder.data.completed_at) {
    return (
      <StackScreen title={reminderScreenTitles.edit}>
        <EmptyState
          title="Tamamlanan hatırlatma"
          description="Bu hatırlatma tamamlandı. Düzenlemek için önce yeni bir hatırlatma oluştur."
          actionLabel="Geri dön"
          onAction={() => router.back()}
        />
      </StackScreen>
    );
  }

  return (
    <StackScreen title={reminderScreenTitles.edit} scrollable>
      <ReminderForm
        initialValues={toReminderFormValues(reminder.data)}
        submitLabel="Değişiklikleri kaydet"
        isSubmitting={updateReminder.isPending}
        errorMessage={
          updateReminder.isError ? toUserFacingError(updateReminder.error).message : undefined
        }
        onSubmit={(values) =>
          updateReminder.mutate(values, {
            onSuccess: () => router.back(),
          })
        }
      />
    </StackScreen>
  );
}
