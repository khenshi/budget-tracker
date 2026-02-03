"use server";

import { revalidatePath } from "next/cache";
import { unstable_cache } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { categorySchema } from "@/lib/validations";

// Cache categories for 1 hour (3600 seconds)
const getCategoriesCached = unstable_cache(
  async (userId: string) => {
    const categories = await prisma.category.findMany({
      where: {
        OR: [
          { userId },
          { isDefault: true },
        ],
      },
      orderBy: { name: "asc" },
    });
    return categories;
  },
  ["user-categories"],
  { revalidate: 3600, tags: ["categories"] }
);

export async function getCategories() {
  const session = await auth();
  if (!session?.user?.id) return [];
  
  return getCategoriesCached(session.user.id);
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
  
  // Revalidate cache tag instead of individual paths
  revalidatePath("/categories", "layout");
  revalidatePath("/dashboard", "layout");
  revalidatePath("/transactions", "layout");
  revalidatePath("/budgets", "layout");
  return { success: true };
}
