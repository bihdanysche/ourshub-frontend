import { z } from "zod";

export const editProfileSchema = z.object({
  name: z
    .string()
    .min(1, { message: "settings.profile.validation.name_min" })
    .max(30, { message: "settings.profile.validation.name_max" })
    .refine((val) => val.trim() === val, {
      message: "settings.profile.validation.name_trim",
    })
    .refine((val) => val.trim().length > 0, {
      message: "settings.profile.validation.name_min",
    }),
  username: z
    .string()
    .min(3, { message: "settings.profile.validation.username_min" })
    .max(30, { message: "settings.profile.validation.username_max" })
    .refine((val) => !/\s/.test(val), {
      message: "settings.profile.validation.username_spaces",
    })
    .regex(/^[a-zA-Z]/, {
      message: "settings.profile.validation.username_start_letter",
    })
    .regex(/^[a-zA-Z0-9_.]+$/, {
      message: "settings.profile.validation.username_chars",
    }),
});

export type EditProfileInput = z.infer<typeof editProfileSchema>;
