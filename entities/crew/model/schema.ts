import { z } from "zod";

export const createCrewSchema = z.object({
  title: z
    .string()
    .min(2, { message: "crew.validation.title_min" })
    .max(50, { message: "crew.validation.title_max" })
    .refine((val) => val.trim() === val, {
      message: "crew.validation.title_trim",
    })
    .refine((val) => val.trim().length >= 2, {
      message: "crew.validation.title_min",
    }),
});

export type CreateCrewInput = z.infer<typeof createCrewSchema>;

export const updateCrewSchema = createCrewSchema;

export type UpdateCrewInput = z.infer<typeof updateCrewSchema>;

export const updateMemberAliasSchema = z.object({
  alias: z
    .string()
    .max(20, { message: "crew.validation.alias_max" })
    .refine((val) => val.trim() === val, {
      message: "crew.validation.alias_trim",
    })
    .nullable()
    .optional()
    .or(z.literal("")),
});

export type UpdateMemberAliasInput = z.infer<typeof updateMemberAliasSchema>;
