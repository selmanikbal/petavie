import { z } from 'zod';

const MAX_WEIGHT_KG = 200;

export const petWeightSchema = z.object({
  weightKg: z
    .string()
    .trim()
    .transform((value, ctx) => {
      const parsed = Number(value.replace(',', '.'));
      if (!Number.isFinite(parsed) || parsed <= 0 || parsed > MAX_WEIGHT_KG) {
        ctx.addIssue({
          code: 'custom',
          message: `Kiloyu 0 ile ${MAX_WEIGHT_KG} kg arasında gir.`,
        });
        return z.NEVER;
      }
      return Math.round(parsed * 100) / 100;
    }),
  recordedAt: z
    .date()
    .nullable()
    .transform((value, ctx) => {
      if (value === null) {
        ctx.addIssue({ code: 'custom', message: 'Ölçüm tarihini seç.' });
        return z.NEVER;
      }
      if (value > new Date()) {
        ctx.addIssue({ code: 'custom', message: 'Ölçüm tarihi gelecekte olamaz.' });
        return z.NEVER;
      }
      return value;
    }),
  note: z
    .string()
    .trim()
    .max(200, 'Not en fazla 200 karakter olabilir.')
    .transform((value) => (value === '' ? null : value)),
});

export type PetWeightFormValues = z.input<typeof petWeightSchema>;
export type PetWeightInput = z.output<typeof petWeightSchema>;
