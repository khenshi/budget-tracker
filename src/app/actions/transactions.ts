"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { transactionSchema } from "@/lib/validations";

export async function createTransaction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  const raw = {
    amount: formData.get("amount"),
    type: formData.get("type"),
    categoryId: formData.get("categoryId"),
    date: formData.get("date"),
    note: formData.get("note"),
  };
  const parsed = transactionSchema.safeParse({
    amount: raw.amount,
    type: raw.type,
    categoryId: raw.categoryId,
    date: raw.date || new Date(),
    note: raw.note || undefined,
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

  await prisma.transaction.create({
    data: {
      userId: session.user.id,
      amount: parsed.data.amount,
      type: parsed.data.type,
      categoryId: parsed.data.categoryId,
      date: parsed.data.date,
      note: parsed.data.note ?? null,
    },
  });
  revalidatePath("/dashboard");
  revalidatePath("/transactions");
  revalidatePath("/analytics");
  revalidatePath("/budgets");
  return { success: true };
}

export async function updateTransaction(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  const existing = await prisma.transaction.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!existing) return { success: false, error: "Not found" };

  const raw = {
    amount: formData.get("amount"),
    type: formData.get("type"),
    categoryId: formData.get("categoryId"),
    date: formData.get("date"),
    note: formData.get("note"),
  };
  const parsed = transactionSchema.safeParse({
    amount: raw.amount,
    type: raw.type,
    categoryId: raw.categoryId,
    date: raw.date || existing.date,
    note: raw.note ?? existing.note ?? undefined,
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

  await prisma.transaction.update({
    where: { id },
    data: {
      amount: parsed.data.amount,
      type: parsed.data.type,
      categoryId: parsed.data.categoryId,
      date: parsed.data.date,
      note: parsed.data.note ?? null,
    },
  });
  revalidatePath("/dashboard");
  revalidatePath("/transactions");
  revalidatePath("/analytics");
  revalidatePath("/budgets");
  return { success: true };
}

export async function deleteTransaction(id: string) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  const existing = await prisma.transaction.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!existing) return { success: false, error: "Not found" };

  await prisma.transaction.delete({ where: { id } });
  revalidatePath("/dashboard");
  revalidatePath("/transactions");
  revalidatePath("/analytics");
  revalidatePath("/budgets");
  return { success: true };
}
