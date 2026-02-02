"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { budgetSchema } from "@/lib/validations";

export async function createBudget(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  const parsed = budgetSchema.safeParse({
    categoryId: formData.get("categoryId"),
    amount: formData.get("amount"),
    month: formData.get("month"),
  });
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message };
  }

  const category = await prisma.category.findFirst({
    where: {
      id: parsed.data.categoryId,
      OR: [{ userId: null }, { userId: session.user.id }],
    },
  });
  if (!category) return { success: false, error: "Invalid category" };

  const monthStart = new Date(parsed.data.month);
  monthStart.setUTCHours(0, 0, 0, 0);

  await prisma.budget.create({
    data: {
      userId: session.user.id,
      categoryId: parsed.data.categoryId,
      amount: parsed.data.amount,
      month: monthStart,
    },
  });
  revalidatePath("/dashboard");
  revalidatePath("/budgets");
  return { success: true };
}

export async function updateBudget(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  const existing = await prisma.budget.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!existing) return { success: false, error: "Not found" };

  const parsed = budgetSchema.safeParse({
    categoryId: existing.categoryId,
    amount: formData.get("amount"),
    month: existing.month,
  });
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message };
  }

  await prisma.budget.update({
    where: { id },
    data: { amount: parsed.data.amount },
  });
  revalidatePath("/dashboard");
  revalidatePath("/budgets");
  return { success: true };
}

export async function deleteBudget(id: string) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  const existing = await prisma.budget.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!existing) return { success: false, error: "Not found" };

  await prisma.budget.delete({ where: { id } });
  revalidatePath("/dashboard");
  revalidatePath("/budgets");
  return { success: true };
}
