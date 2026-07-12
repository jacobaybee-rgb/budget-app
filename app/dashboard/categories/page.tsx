"use client";

import { useState } from "react";
import { useBudget } from "@/context/BudgetContext";
import PageHeader from "@/components/ui/PageHeader";
import PageStatCard from "@/components/ui/PageStatCard";
import PageSplitLayout from "@/components/ui/PageSplitLayout";
import CategoryForm from "@/components/categories/CategoryForm";
import CategoryManager from "@/components/categories/CategoryManager";

export default function CategoriesPage() {
  const {
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
  } = useBudget();

  const [editingCategoryId, setEditingCategoryId] = useState<
    string | null
  >(null);

  const editingCategory =
    categories.find(
      (category) => category.id === editingCategoryId
    ) ?? null;

  const totalBudget = categories.reduce(
    (total, category) => total + category.budget,
    0
  );

  const categoryCount = categories.length;

  const averageBudget =
    categoryCount > 0 ? totalBudget / categoryCount : 0;

  function handleEditCategory(categoryId: string) {
    setEditingCategoryId(categoryId);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function handleDeleteCategory(categoryId: string) {
    deleteCategory(categoryId);

    if (editingCategoryId === categoryId) {
      setEditingCategoryId(null);
    }
  }

  return (
    <div className="space-y-8 px-8 py-8">
      <PageHeader
        eyebrow="Category Page"
        title="Categories"
        description="Create categories and budgets so you know where your money should be going."
        color="purple"
      />

      <div className="grid gap-6 md:grid-cols-3">
        <PageStatCard
          label="Total Budgeted"
          value={`$${totalBudget.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          color="blue"
        />

        <PageStatCard
          label="Categories"
          value={categoryCount.toString()}
          color="purple"
        />

        <PageStatCard
          label="Average Budget"
          value={`$${averageBudget.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          color="blue"
        />
      </div>

      <PageSplitLayout
        left={
          <CategoryForm
            categories={categories}
            editingCategory={editingCategory}
            onAddCategory={addCategory}
            onUpdateCategory={updateCategory}
            onCancelEdit={() => setEditingCategoryId(null)}
          />
        }
        right={
          <CategoryManager
            categories={categories}
            onEdit={handleEditCategory}
            onDelete={handleDeleteCategory}
          />
        }
      />
    </div>
  );
}