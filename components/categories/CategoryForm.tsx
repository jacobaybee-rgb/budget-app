"use client";

import { useEffect, useState } from "react";
import type { Category } from "@/types/category";

type CategoryFormProps = {
  categories: Category[];
  editingCategory: Category | null;
  onAddCategory: (category: Category) => void;
  onUpdateCategory: (
    updatedCategory: Category,
    previousName: string
  ) => void;
  onCancelEdit: () => void;
};

export default function CategoryForm({
  categories,
  editingCategory,
  onAddCategory,
  onUpdateCategory,
  onCancelEdit,
}: CategoryFormProps) {
  const [name, setName] = useState("");
  const [budget, setBudget] = useState("");

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (editingCategory) {
      setName(editingCategory.name);
      setBudget(editingCategory.budget.toString());
    } else {
      setName("");
      setBudget("");
    }
  }, [editingCategory]);
  /* eslint-enable react-hooks/set-state-in-effect */

  function resetForm() {
    setName("");
    setBudget("");
  }

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
        category.id !== editingCategory?.id
    );

    if (categoryExists) {
      alert("That category already exists.");
      return;
    }

    if (editingCategory) {
      onUpdateCategory(
        {
          ...editingCategory,
          name: trimmedName,
          budget: budgetNumber,
        },
        editingCategory.name
      );

      onCancelEdit();
    } else {
      onAddCategory({
        id: crypto.randomUUID(),
        name: trimmedName,
        budget: budgetNumber,
      });
    }

    resetForm();
  }

  function handleCancel() {
    resetForm();
    onCancelEdit();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-purple-500/50 bg-zinc-950/80 p-6 shadow-xl"
    >
      <h2 className="text-2xl font-bold text-purple-400">
        {editingCategory ? "Edit Category" : "Add Category"}
      </h2>

      <label className="mt-6 block text-sm text-zinc-400">
        Category Name
      </label>

      <input
        value={name}
        onChange={(event) => setName(event.target.value)}
        className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-purple-500/50"
        placeholder="Name of Category"
      />

      <label className="mt-4 block text-sm text-zinc-400">
        Monthly Budget for this Category
      </label>

      <input
        value={budget}
        onChange={(event) => setBudget(event.target.value)}
        className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-purple-500/50"
        placeholder="Amount you want to budget"
        type="number"
        min="0"
        step="0.01"
      />

      <div className="mt-6 flex gap-3">
        <button
          type="submit"
          className="flex-1 rounded-xl bg-purple-400/70 px-6 py-3 font-semibold text-zinc-950 hover:bg-purple-500"
        >
          {editingCategory ? "Save Changes" : "Save Category"}
        </button>

        {editingCategory && (
          <button
            type="button"
            onClick={handleCancel}
            className="rounded-xl border border-zinc-700 bg-zinc-900 px-6 py-3 font-semibold text-zinc-300 hover:bg-zinc-800"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}