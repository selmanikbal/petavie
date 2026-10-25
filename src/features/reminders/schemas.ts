import { z } from 'zod';

import {
  combineDateAndTime,
  generateOccurrences,
  toRangeDate,
} from '@/features/reminders/schedule-utils';
import type { ReminderRecurrence, ReminderType } from '@/types/database';

export const REMINDER_TYPES = [
  'vaccination',
  'medication',
  'vet',
  'grooming',
  'other',
] as const satisfies readonly ReminderType[];

export const REMINDER_TYPE_LABELS: Record<ReminderType, string> = {
  vaccination: 'Aşı',
  medication: 'İlaç',
  vet: 'Veteriner',
  grooming: 'Bakım',
  other: 'Diğer',
};

export const SCHEDULE_MODES = ['once', 'recurring'] as const;

export const SCHEDULE_MODE_LABELS = {
  once: 'Tek seferlik',
  recurring: 'Tekrarlayan',
} as const;

export const RECURRENCE_OPTIONS = ['daily', 'weekly', 'monthly'] as const satisfies readonly ReminderRecurrence[];

const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;

const baseReminderSchema = z.object({
  petId: z.string().trim().min(1, 'Bir dost seç.'),
  type: z.enum(REMINDER_TYPES),
  title: z
    .string()
    .trim()
    .min(2, 'Başlık en az 2 karakter olmalı.')
    .max(80, 'Başlık en fazla 80 karakter olabilir.'),
  scheduleMode: z.enum(SCHEDULE_MODES),
  remindDate: z.date().nullable(),
  rangeStart: z.date().nullable(),
  rangeEnd: z.date().nullable(),
  recurrence: z.enum(RECURRENCE_OPTIONS).nullable(),
  remindTime: z
    .string()
    .trim()
    .transform((value, ctx) => {
      if (!TIME_PATTERN.test(value)) {
        ctx.addIssue({ code: 'custom', message: 'Saati SS:DD formatında gir.' });
        return z.NEVER;
      }
      return value;
    }),
  notes: z
    .string()
    .trim()
    .max(200, 'Not en fazla 200 karakter olabilir.')
    .transform((value) => (value === '' ? null : value)),
});

export const reminderSchema = baseReminderSchema.superRefine((value, ctx) => {
  if (value.scheduleMode === 'once') {
    if (value.remindDate === null) {
      ctx.addIssue({ code: 'custom', message: 'Tarihi seç.', path: ['remindDate'] });
      return;
    }

    const remindAt = combineDateAndTime(value.remindDate, value.remindTime);
    if (remindAt.getTime() <= Date.now()) {
      ctx.addIssue({
        code: 'custom',
        message: 'Hatırlatma zamanı gelecekte olmalı.',
        path: ['remindTime'],
      });
    }
    return;
  }

  if (value.rangeStart === null) {
    ctx.addIssue({ code: 'custom', message: 'Başlangıç tarihini seç.', path: ['rangeStart'] });
  }
  if (value.rangeEnd === null) {
    ctx.addIssue({ code: 'custom', message: 'Bitiş tarihini seç.', path: ['rangeEnd'] });
  }
  if (value.recurrence === null) {
    ctx.addIssue({ code: 'custom', message: 'Tekrar sıklığını seç.', path: ['recurrence'] });
  }

  if (value.rangeStart && value.rangeEnd && value.rangeEnd < value.rangeStart) {
    ctx.addIssue({
      code: 'custom',
      message: 'Bitiş tarihi, başlangıçtan önce olamaz.',
      path: ['rangeEnd'],
    });
  }

  if (value.rangeStart && value.rangeEnd && value.recurrence) {
    const occurrences = generateOccurrences({
      scheduleMode: 'recurring',
      recurrence: value.recurrence,
      rangeStart: value.rangeStart,
      rangeEnd: value.rangeEnd,
      remindTime: value.remindTime,
    });

    if (occurrences.length === 0) {
      ctx.addIssue({
        code: 'custom',
        message: 'Seçilen aralıkta gelecekte en az bir hatırlatma olmalı.',
        path: ['rangeEnd'],
      });
    }
  }
}).transform(parseReminderInput);

export type ReminderFormValues = z.input<typeof reminderSchema>;

export type ReminderInput = {
  petId: string;
  type: ReminderType;
  title: string;
  notes: string | null;
  scheduleMode: 'once' | 'recurring';
  recurrence: ReminderRecurrence | null;
  rangeStart: string;
  rangeEnd: string | null;
  remindAt: Date;
};

function parseReminderInput(values: z.infer<typeof baseReminderSchema>): ReminderInput {
  if (values.scheduleMode === 'once') {
    const remindDate = values.remindDate as Date;
    const remindAt = combineDateAndTime(remindDate, values.remindTime);

    return {
      petId: values.petId,
      type: values.type,
      title: values.title,
      notes: values.notes,
      scheduleMode: 'once',
      recurrence: null,
      rangeStart: toRangeDate(remindDate),
      rangeEnd: null,
      remindAt,
    };
  }

  const rangeStart = values.rangeStart as Date;
  const rangeEnd = values.rangeEnd as Date;
  const recurrence = values.recurrence as ReminderRecurrence;
  const occurrences = generateOccurrences({
    scheduleMode: 'recurring',
    recurrence,
    rangeStart,
    rangeEnd,
    remindTime: values.remindTime,
  });

  return {
    petId: values.petId,
    type: values.type,
    title: values.title,
    notes: values.notes,
    scheduleMode: 'recurring',
    recurrence,
    rangeStart: toRangeDate(rangeStart),
    rangeEnd: toRangeDate(rangeEnd),
    remindAt: occurrences[0] ?? combineDateAndTime(rangeStart, values.remindTime),
  };
}
