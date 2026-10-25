/** Analytics event names — snake_case, defined once for stable taxonomy. */
export const AnalyticsEvents = {
  appOpened: 'app_opened',

  petCreated: 'pet_created',
  petUpdated: 'pet_updated',
  petDeleted: 'pet_deleted',
  petAvatarUpdated: 'pet_avatar_updated',

  healthRecordCreated: 'health_record_created',
  vaccinationCreated: 'vaccination_created',
  medicationCreated: 'medication_created',
  weightAdded: 'weight_added',

  reminderCreated: 'reminder_created',
  reminderCompleted: 'reminder_completed',

  notificationReceived: 'notification_received',
  notificationOpened: 'notification_opened',
} as const;

export type AnalyticsEvent = (typeof AnalyticsEvents)[keyof typeof AnalyticsEvents];
