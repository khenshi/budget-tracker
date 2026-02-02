import { auth } from "@/lib/auth";
import { getCategories } from "@/app/actions/categories";
import { CategoryList } from "./CategoryList";

export default async function CategoriesPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const categories = await getCategories();

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold md:text-2xl">Categories</h1>
      <p className="text-sm text-muted-foreground">
        Default student-friendly categories. Add custom ones below.
      </p>
      <CategoryList initialCategories={categories} />
    </div>
  );
}
