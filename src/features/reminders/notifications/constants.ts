/**
 * Android notification channel for reminders (system default sound).
 * Channel settings are immutable once created, so the id changed when the
 * custom bird sound was dropped; the old channel is removed on launch.
 */
export const REMINDER_NOTIFICATION_CHANNEL_ID = 'reminders_default';

/** Channel created by earlier builds with the custom sound. */
export const LEGACY_REMINDER_CHANNEL_IDS = ['reminders'] as const;
