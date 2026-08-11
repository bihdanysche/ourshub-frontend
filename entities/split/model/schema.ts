import { z } from "zod";

export const splitTitleSchema = z
  .string()
  .refine((val) => val.trim().length >= 2, {
    message: "splits.validation.title_min",
  })
  .refine((val) => val.trim().length <= 30, {
    message: "splits.validation.title_max",
  });

export const splitDescSchema = z
  .string()
  .refine((val) => val.trim().length <= 1000, {
    message: "splits.validation.desc_max",
  })
  .optional()
  .or(z.literal(""));

export const splitMsgSchema = z
  .string()
  .refine((val) => val.trim().length <= 50, {
    message: "splits.validation.msg_max",
  })
  .optional()
  .or(z.literal(""));

export const splitMemberInputSchema = z.object({
  user: z.number({ message: "splits.validation.user_required" }),
  paid: z.number().min(0, { message: "splits.validation.amount_min_zero" }),
  mustPay: z.number().min(0, { message: "splits.validation.amount_min_zero" }),
});

export const splitExpenseInputSchema = z.object({
  title: splitTitleSchema,
  desc: splitDescSchema,
  spender: z.number({ message: "splits.validation.spender_required" }),
  members: z.array(splitMemberInputSchema).min(2, {
    message: "splits.validation.min_members",
  }),
});

export const createSplitSchema = z.object({
  title: splitTitleSchema,
  desc: splitDescSchema,
  expenses: z
    .array(splitExpenseInputSchema)
    .min(1, { message: "splits.validation.min_expenses" })
    .max(10, { message: "splits.validation.max_expenses" }),
});

export type CreateSplitInput = z.infer<typeof createSplitSchema>;

export const updateSplitExpenseSchema = z.object({
  id: z.number(),
  title: splitTitleSchema.optional(),
  desc: splitDescSchema,
});

export const updateSplitSchema = z.object({
  title: splitTitleSchema.optional(),
  desc: splitDescSchema,
  expenses: z.array(updateSplitExpenseSchema).optional(),
});

export type UpdateSplitInput = z.infer<typeof updateSplitSchema>;

export const payOffItemSchema = z.object({
  user: z.number(),
  amount: z.number().positive({ message: "splits.validation.amount_positive" }),
  msg: splitMsgSchema,
});

export type PayOffItemInput = z.infer<typeof payOffItemSchema>;

export const increaseItemSchema = payOffItemSchema;
export type IncreaseItemInput = z.infer<typeof increaseItemSchema>;

export const addExpenseSchema = z.object({
  expenses: z
    .array(splitExpenseInputSchema)
    .min(1, { message: "splits.validation.min_expenses" }),
});

export type AddExpenseInput = z.infer<typeof addExpenseSchema>;

export const addExpenseMembersSchema = z.object({
  members: z
    .array(splitMemberInputSchema)
    .min(1, { message: "splits.validation.min_members_add" }),
});

export type AddExpenseMembersInput = z.infer<typeof addExpenseMembersSchema>;

export const removeExpenseMembersSchema = z.object({
  userIds: z
    .array(z.number())
    .min(1, { message: "splits.validation.min_members_remove" }),
});

export type RemoveExpenseMembersInput = z.infer<typeof removeExpenseMembersSchema>;
