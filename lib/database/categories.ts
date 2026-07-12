import type { SupabaseClient } from "@supabase/supabase-js";
import type { Category } from "@/types/category";

type CategoryRow = {
  id: string;
  user_id: string;
  name: string;
  budget: number | string;
  created_at: string;
  updated_at: string;
};

export type NewCategory = {
  name: string;
  budget: number;
};

export type CategoryUpdate = {
  name: string;
  budget: number;
};

const CATEGORY_COLUMNS = `
  id,
  user_id,
  name,
  budget,
  created_at,
  updated_at
`;

export async function getCategories(
  supabase: SupabaseClient,
  userId: string
): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select(CATEGORY_COLUMNS)
    .eq("user_id", userId)
    .order("created_at", {
      ascending: true,
    });

  if (error) {
    throw new Error(`Unable to load categories: ${error.message}`);
  }

  return (data as CategoryRow[]).map(mapCategoryRow);
}

export async function createCategory(
  supabase: SupabaseClient,
  userId: string,
  category: NewCategory
): Promise<Category> {
  const { data, error } = await supabase
    .from("categories")
    .insert({
      user_id: userId,
      name: category.name.trim(),
      budget: category.budget,
    })
    .select(CATEGORY_COLUMNS)
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new Error("A category with that name already exists.");
    }

    throw new Error(`Unable to create category: ${error.message}`);
  }

  return mapCategoryRow(data as CategoryRow);
}

export async function updateCategoryRecord(
  supabase: SupabaseClient,
  userId: string,
  categoryId: string,
  updates: CategoryUpdate
): Promise<Category> {
  const { data, error } = await supabase
    .from("categories")
    .update({
      name: updates.name.trim(),
      budget: updates.budget,
    })
    .eq("id", categoryId)
    .eq("user_id", userId)
    .select(CATEGORY_COLUMNS)
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new Error("A category with that name already exists.");
    }

    throw new Error(`Unable to update category: ${error.message}`);
  }

  return mapCategoryRow(data as CategoryRow);
}

export async function deleteCategoryRecord(
  supabase: SupabaseClient,
  userId: string,
  categoryId: string
): Promise<void> {
  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", categoryId)
    .eq("user_id", userId);

  if (error) {
    throw new Error(`Unable to delete category: ${error.message}`);
  }
}

function mapCategoryRow(row: CategoryRow): Category {
  return {
    id: row.id,
    name: row.name,
    budget: Number(row.budget),
  };
}