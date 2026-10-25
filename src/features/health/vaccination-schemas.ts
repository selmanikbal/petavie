import { z } from 'zod';

export const vaccinationSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, 'Aşı adı en az 2 karakter olmalı.')
      .max(80, 'Aşı adı en fazla 80 karakter olabilir.'),
    administeredAt: z
      .date()
      .nullable()
      .transform((value, ctx) => {
        if (value === null) {
          ctx.addIssue({ code: 'custom', message: 'Uygulama tarihini seç.' });
          return z.NEVER;
        }
        if (value > new Date()) {
          ctx.addIssue({ code: 'custom', message: 'Uygulama tarihi gelecekte olamaz.' });
          return z.NEVER;
        }
        return value;
      }),
    nextDueAt: z.date().nullable(),
    clinicName: z
      .string()
      .trim()
      .max(80, 'Klinik adı en fazla 80 karakter olabilir.')
      .transform((value) => (value === '' ? null : value)),
    note: z
      .string()
      .trim()
      .max(200, 'Not en fazla 200 karakter olabilir.')
      .transform((value) => (value === '' ? null : value)),
  })
  .superRefine((value, ctx) => {
    if (value.nextDueAt && value.nextDueAt < value.administeredAt) {
      ctx.addIssue({
        code: 'custom',
        message: 'Sonraki doz, uygulama tarihinden önce olamaz.',
        path: ['nextDueAt'],
      });
    }
  });

export type VaccinationFormValues = z.input<typeof vaccinationSchema>;
export type VaccinationInput = z.output<typeof vaccinationSchema>;
