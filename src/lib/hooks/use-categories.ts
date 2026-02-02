"use client";

import { useEffect, useState } from "react";
import { getCategories } from "@/app/actions/categories";
import type { Category } from "@prisma/client";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  useEffect(() => {
    getCategories().then(setCategories);
  }, []);
  return categories;
}
