"use client";

import { useBudget } from "@/context/BudgetContext";
import { useState } from "react";
import AppLayout from "@/components/AppLayout";

export default function CategoriesPage() {
  const {
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
  } = useBudget();

  const [name, setName] = useState("");
  const [budget, setBudget] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState<
    string | null
  >(null);

  const totalBudget = categories.reduce(
    (total, category) => total + category.budget,
    0
  );

  const categoryCount = categories.length;

  const averageBudget =
    categoryCount > 0 ? totalBudget / categoryCount : 0;

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const trimmedName = name.trim();
    const budgetNumber = Number(budget);

    if (!trimmedName) {
      alert("Category name is required.");
      return;
    }

    if (budgetNumber <= 0) {
      alert("Budget must be greater than 0.");
      return;
    }

    const categoryExists = categories.some(
      (category) =>
        category.name.toLowerCase() === trimmedName.toLowerCase() &&
        category.id !== editingCategoryId
    );

    if (categoryExists) {
      alert("That category already exists.");
      return;
    }

    if (editingCategoryId) {
      const existingCategory = categories.find(
        (category) => category.id === editingCategoryId
      );

      if (!existingCategory) {
        return;
      }

      updateCategory(
        {
          ...existingCategory,
          name: trimmedName,
          budget: budgetNumber,
        },
        existingCategory.name
      );

      setEditingCategoryId(null);
    } else {
      addCategory({
        id: crypto.randomUUID(),
        name: trimmedName,
        budget: budgetNumber,
      });
    }

    setName("");
    setBudget("");
  }

  function handleEditCategory(categoryId: string) {
    const category = categories.find(
      (currentCategory) => currentCategory.id === categoryId
    );

    if (!category) {
      return;
    }

    setEditingCategoryId(category.id);
    setName(category.name);
    setBudget(category.budget.toString());

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function handleCancelEdit() {
    setEditingCategoryId(null);
    setName("");
    setBudget("");
  }

  return (
    <AppLayout>
      <div className="px-8 py-8 space-y-8">
        <div>
          <p className="uppercase tracking-widest text-purple-300 text-sm">
            Category Page
          </p>
          <h1 className="mt-2 text-5xl font-bold">Categories</h1>
          <p className="mt-2 text-zinc-400">
            Create categories and budgets so you know where your money should be going.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <section className="rounded-2xl border border-blue-500/30 bg-zinc-950/80 p-6 shadow-xl">
            <p className="text-sm uppercase tracking-widest text-zinc-400">
              Total Budgeted
            </p>
            <p className="mt-3 text-4xl font-bold text-blue-400">
              ${totalBudget.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </section>

          <section className="rounded-2xl border border-purple-500/30 bg-zinc-950/80 p-6 shadow-xl">
            <p className="text-sm uppercase tracking-widest text-zinc-400">
              Categories
            </p>
            <p className="mt-3 text-4xl font-bold text-purple-400">
              {categoryCount}
            </p>
          </section>

          <section className="rounded-2xl border border-blue-500/50 bg-zinc-950/80 p-6 shadow-xl">
            <p className="text-sm uppercase tracking-widest text-zinc-400">
              Average Budget
            </p>
            <p className="mt-3 text-4xl font-bold text-blue-400">
              ${averageBudget.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </section>
        </div>

        <div className="grid gap-8 lg:grid-cols-[400px_1fr]">
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-purple-500/50 bg-zinc-950/80 p-6 shadow-xl"
          >
            <h2 className="text-2xl font-bold text-purple-400">
              {editingCategoryId ? "Edit Category" : "Add Category"}
            </h2>

            <label className="mt-6 block text-sm text-zinc-400">
              Category Name
            </label>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white"
              placeholder="Name of Category"
            />

            <label className="mt-4 block text-sm text-zinc-400">
              Monthly Budget for this Category
            </label>
            <input
              value={budget}
              onChange={(event) => setBudget(event.target.value)}
              className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white"
              placeholder="Amount you want to budget"
              type="number"
            />

            <div className="mt-6 flex gap-3">
              <button
                type="submit"
                className="flex-1 rounded-xl bg-purple-400/70 px-6 py-3 font-semibold text-zinc-950 hover:bg-purple-500"
              >
                {editingCategoryId ? "Save Changes" : "Save Category"}
              </button>

              {editingCategoryId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="rounded-xl border border-zinc-700 bg-zinc-900 px-6 py-3 font-semibold text-zinc-300 hover:bg-zinc-800"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          <section className="rounded-2xl border border-purple-800 bg-zinc-950/80 p-6 shadow-xl">
            <p className="uppercase tracking-widest text-purple-400 text-sm mb-4">
              Budget Categories
            </p>

            <div className="space-y-4">
              {categories.length === 0 ? (
                <p className="text-zinc-500">No categories yet.</p>
              ) : (
                categories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5"
                  >
                    <div>
                      <p className="text-lg font-bold text-white">
                        {category.name}
                      </p>
                      <p className="text-zinc-400">
                        Monthly budget: $
                        {category.budget.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleEditCategory(category.id)}
                        className="rounded-lg bg-blue-950/40 px-3 py-2 text-sm text-blue-400 transition hover:bg-blue-900/50 hover:text-blue-300"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteCategory(category.id)}
                        className="rounded-lg bg-red-950/40 px-3 py-2 text-sm text-red-400 transition hover:bg-red-900/50 hover:text-red-300"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </AppLayout>
  );
}