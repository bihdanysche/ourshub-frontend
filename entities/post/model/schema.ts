import { z } from "zod";

export const postContentSchema = z.object({
  content: z
    .string()
    .refine((val) => val.trim().length >= 1, {
      message: "posts.validation.content_min",
    })
    .refine((val) => val.trim().length <= 1500, {
      message: "posts.validation.content_max",
    }),
});

export type PostContentInput = z.infer<typeof postContentSchema>;
