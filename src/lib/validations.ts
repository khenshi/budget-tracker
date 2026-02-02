import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password required"),
});

export const registerSchema = z
  .object({
    email: z.string().email("Invalid email"),
    name: z.string().min(1, "Name required").max(100),
    password: z.string().min(6, "At least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const transactionSchema = z.object({
  amount: z.coerce.number().positive("Amount must be positive"),
  type: z.enum(["income", "expense"]),
  categoryId: z.string().min(1, "Category required"),
  date: z.coerce.date(),
  note: z.string().max(500).optional(),
});

export const categorySchema = z.object({
  name: z.string().min(1, "Name required").max(50),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default("#6366f1"),
});

export const budgetSchema = z.object({
  categoryId: z.string().min(1),
  amount: z.coerce.number().nonnegative(),
  month: z.coerce.date(),
});
