"use client";

import { useState } from "react";
import { useBudget } from "@/context/BudgetContext";
import PageHeader from "@/components/ui/PageHeader";
import PageStatCard from "@/components/ui/PageStatCard";
import PageSplitLayout from "@/components/ui/PageSplitLayout";
import CategoryForm from "@/components/categories/CategoryForm";
import CategoryManager from "@/components/categories/CategoryManager";
import MonthSelector from "@/components/budget/MonthSelector";

export default function CategoriesPage() {
  const {
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    budgetMonthStatus,
  } = useBudget();

  const isMonthClosed = budgetMonthStatus === "closed";

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
    if (isMonthClosed) return;

    setEditingCategoryId(categoryId);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function handleDeleteCategory(categoryId: string) {
    if (isMonthClosed) return;

    deleteCategory(categoryId);

    if (editingCategoryId === categoryId) {
      setEditingCategoryId(null);
    }
  }

  return (
    <div className="space-y-10 px-8 py-8">
      <PageHeader
        eyebrow="Category Page"
        title="Categories"
        description="Create categories and budgets so you know where your money should be going."
        color="purple"
      />

      <div className="flex justify-center">
        <MonthSelector />
      </div>

      {isMonthClosed && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-center">
          <p className="font-semibold text-amber-300">
            This month is closed
          </p>

          <p className="mt-1 text-sm text-zinc-400">
            Category budgets for this month are read-only and can no longer
            be added, edited, or deleted.
          </p>
        </div>
      )}

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
            isReadOnly={isMonthClosed}
          />
        }
        right={
          <CategoryManager
            categories={categories}
            onEdit={handleEditCategory}
            onDelete={handleDeleteCategory}
            isReadOnly={isMonthClosed}
          />
        }
      />
    </div>
  );
}