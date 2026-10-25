import { z } from 'zod';

export const healthRecordSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, 'Başlık en az 2 karakter olmalı.')
    .max(80, 'Başlık en fazla 80 karakter olabilir.'),
  visitedAt: z
    .date()
    .nullable()
    .transform((value, ctx) => {
      if (value === null) {
        ctx.addIssue({ code: 'custom', message: 'Tarihi seç.' });
        return z.NEVER;
      }
      if (value > new Date()) {
        ctx.addIssue({ code: 'custom', message: 'Tarih gelecekte olamaz.' });
        return z.NEVER;
      }
      return value;
    }),
  description: z
    .string()
    .trim()
    .min(2, 'Açıklama en az 2 karakter olmalı.')
    .max(500, 'Açıklama en fazla 500 karakter olabilir.'),
  clinicName: z
    .string()
    .trim()
    .max(80, 'Klinik adı en fazla 80 karakter olabilir.')
    .transform((value) => (value === '' ? null : value)),
});

export type HealthRecordFormValues = z.input<typeof healthRecordSchema>;
export type HealthRecordInput = z.output<typeof healthRecordSchema>;
