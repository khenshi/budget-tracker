"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { categorySchema } from "@/lib/validations";

export async function getCategories() {
  const session = await auth();
  if (!session?.user?.id) return [];

  const categories = await prisma.category.findMany({
    where: {
      OR: [
        { userId: session.user.id },
        { isDefault: true },
      ],
    },
    orderBy: { name: "asc" },
  });
  return categories;
}

export async function createCategory(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  const parsed = categorySchema.safeParse({
    name: formData.get("name"),
    color: formData.get("color"),
  });
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message };
  }

  await prisma.category.create({
    data: {
      userId: session.user.id,
      name: parsed.data.name,
      color: parsed.data.color,
      isDefault: false,
    },
  });
  revalidatePath("/categories");
  revalidatePath("/dashboard");
  revalidatePath("/transactions");
  revalidatePath("/budgets");
  return { success: true };
}
