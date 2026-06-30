"use client";

import AppSidebar from "@/components/AppSidebar";
import { useBudget } from "@/context/BudgetContext";
import { useState } from "react";
import MobileNav from "@/components/MobileNav";

export default function CategoriesPage() {
  const { categories, addCategory } = useBudget();

  const [name, setName] = useState("");
  const [budget, setBudget] = useState("");

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
    category.name.toLowerCase() === trimmedName.toLowerCase()
);

if (categoryExists) {
  alert("That category already exists.");
  return;
}

addCategory({
  id: crypto.randomUUID(),
  name: trimmedName,
  budget: budgetNumber,
});

setName("");
setBudget("");
  }
  return (
    <main className="flex min-h-screen bg-zinc-950 text-white">
      <AppSidebar />

      <section className="flex-1 px-6 py-10">
        <h1 className="text-4xl font-bold">Categories</h1>
        <p className="mt-2 text-zinc-400">
          Create and manage your budget categories.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 max-w-xl rounded-2xl border border-zinc-800 bg-zinc-900 p-6"
        >
          <h2 className="text-2xl font-bold">Add Category</h2>

          <label className="mt-6 block text-sm text-zinc-400">
            Category Name
          </label>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white"
            placeholder="Groceries"
          />

          <label className="mt-4 block text-sm text-zinc-400">
            Monthly Budget
          </label>
          <input
            value={budget}
            onChange={(event) => setBudget(event.target.value)}
            className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white"
            placeholder="600"
            type="number"
          />

          <button className="mt-6 rounded-full bg-emerald-400 px-6 py-3 font-semibold text-zinc-950">
            Save Category
          </button>
        </form>

        <div className="mt-8 max-w-xl space-y-4">
          {categories.map((category) => (
            <div
              key={category.id}
              className="rounded-xl border border-zinc-800 bg-zinc-900 p-4"
            >
              <p className="text-lg font-bold text-white">{category.name}</p>
              <p className="text-zinc-400">
                Monthly budget: ${category.budget}
              </p>
            </div>
          ))}
        </div>
      </section>
      <MobileNav />
    </main>
  );
}