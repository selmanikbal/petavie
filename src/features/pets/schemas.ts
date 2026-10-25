import { z } from "zod";

import type { PetGender, PetSpecies } from "@/types/database";

/** Form picker order — keep in sync with `PetSpecies` in `types/database.ts`. */
export const PET_SPECIES = [
  "cat",
  "dog",
  "bird",
  "rabbit",
  "turtle",
  "hamster",
  "other",
] as const satisfies readonly PetSpecies[];
export const PET_GENDERS = ["female", "male", "unknown"] as const satisfies readonly PetGender[];

export const SPECIES_LABELS: Record<PetSpecies, string> = {
  cat: "Kedi",
  dog: "Köpek",
  bird: "Kuş",
  rabbit: "Tavşan",
  turtle: "Kaplumbağa",
  hamster: "Hamster",
  other: "Diğer",
};

export const GENDER_LABELS: Record<PetGender, string> = {
  female: "Dişi",
  male: "Erkek",
  unknown: "Bilmiyorum",
};

const MAX_WEIGHT_KG = 200;

/**
 * Pet form validation. Messages are user-facing Turkish copy.
 *
 * The input type keeps the shapes the UI controls produce (nullable picker
 * values, weight as text); the output type is what the backends store.
 */
export const petSchema = z.object({
  name: z.string().trim().min(2, "Adı en az 2 karakter olmalı.").max(40, "Adı en fazla 40 karakter olabilir."),
  species: z
    .enum(PET_SPECIES)
    .nullable()
    .transform((value, ctx) => {
      if (value === null) {
        ctx.addIssue({ code: "custom", message: "Türünü seç." });
        return z.NEVER;
      }
      return value;
    }),
  description: z.string().trim().min(2, "Açıklama en az 2 karakter olmalı.").max(200, "Açıklama en fazla 200 karakter olabilir."),
  gender: z.enum(PET_GENDERS),
  birthDate: z
    .date()
    .nullable()
    .transform((value, ctx) => {
      if (value === null) {
        ctx.addIssue({ code: "custom", message: "Doğum tarihini seç." });
        return z.NEVER;
      }
      if (value > new Date()) {
        ctx.addIssue({ code: "custom", message: "Doğum tarihi gelecekte olamaz." });
        return z.NEVER;
      }
      return value;
    }),
  weightKg: z
    .string()
    .trim()
    .transform((value, ctx) => {
      if (value === "") return null;

      // Turkish keyboards produce a comma; storage uses a dot.
      const parsed = Number(value.replace(",", "."));
      if (!Number.isFinite(parsed) || parsed <= 0 || parsed > MAX_WEIGHT_KG) {
        ctx.addIssue({
          code: "custom",
          message: `Kiloyu 0 ile ${MAX_WEIGHT_KG} kg arasında gir.`,
        });
        return z.NEVER;
      }
      return Math.round(parsed * 100) / 100;
    }),
});

/** What the form controls hold. */
export type PetFormValues = z.input<typeof petSchema>;
/** What the backends receive. */
export type PetInput = z.output<typeof petSchema>;
