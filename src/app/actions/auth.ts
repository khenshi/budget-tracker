"use server";

import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations";

export async function registerUser(data: {
  email: string;
  name: string;
  password: string;
}) {
  const parsed = registerSchema.safeParse({
    ...data,
    confirmPassword: data.password,
  });
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message };
  }
  const existing = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  });
  if (existing) {
    return { success: false, error: "Email already registered" };
  }
  const hashed = await hash(parsed.data.password, 10);
  await prisma.user.create({
    data: {
      email: parsed.data.email,
      name: parsed.data.name,
      password: hashed,
    },
  });
  return { success: true };
}
