import { z } from 'zod';

export const medicationSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, 'İlaç adı en az 2 karakter olmalı.')
      .max(80, 'İlaç adı en fazla 80 karakter olabilir.'),
    dosage: z
      .string()
      .trim()
      .min(2, 'Doz en az 2 karakter olmalı.')
      .max(80, 'Doz en fazla 80 karakter olabilir.'),
    frequency: z
      .string()
      .trim()
      .min(2, 'Sıklık en az 2 karakter olmalı.')
      .max(80, 'Sıklık en fazla 80 karakter olabilir.'),
    startedAt: z
      .date()
      .nullable()
      .transform((value, ctx) => {
        if (value === null) {
          ctx.addIssue({ code: 'custom', message: 'Başlangıç tarihini seç.' });
          return z.NEVER;
        }
        if (value > new Date()) {
          ctx.addIssue({ code: 'custom', message: 'Başlangıç tarihi gelecekte olamaz.' });
          return z.NEVER;
        }
        return value;
      }),
    endedAt: z.date().nullable(),
    note: z
      .string()
      .trim()
      .max(200, 'Not en fazla 200 karakter olabilir.')
      .transform((value) => (value === '' ? null : value)),
  })
  .superRefine((value, ctx) => {
    if (value.endedAt && value.endedAt < value.startedAt) {
      ctx.addIssue({
        code: 'custom',
        message: 'Bitiş tarihi, başlangıçtan önce olamaz.',
        path: ['endedAt'],
      });
    }
  });

export type MedicationFormValues = z.input<typeof medicationSchema>;
export type MedicationInput = z.output<typeof medicationSchema>;
