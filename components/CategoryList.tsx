import Link from "next/link";
import { Category } from "@/types/category";
import { Transaction } from "@/types/transaction";
import {
  getCategoryRemaining,
  getCategorySpent,
} from "@/lib/budget";
import { getCategoryIcon } from "@/lib/categoryIcons";

type CategoryListProps = {
  categories: Category[];
  transactions: Transaction[];
  limit?: number;
  showViewAll?: boolean;
};

export default function CategoryList({
  categories,
  transactions,
  limit,
  showViewAll = false,
}: CategoryListProps) {
  const sortedCategories = [...categories].sort((categoryA, categoryB) => {
    const categoryASpent = getCategorySpent(categoryA, transactions);
    const categoryBSpent = getCategorySpent(categoryB, transactions);

    return categoryBSpent - categoryASpent;
  });

  const visibleCategories =
    typeof limit === "number"
      ? sortedCategories.slice(0, limit)
      : sortedCategories;

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-widest text-purple-400">
            Budget Overview
          </p>

          <h2 className="mt-1 text-2xl font-bold">
            Budget Plans
          </h2>
        </div>

        <div className="rounded-full bg-purple-500/20 px-3 py-1 text-sm text-purple-300">
          {categories.length} Active
        </div>
      </div>

      <div className="mt-6 space-y-5">
        {visibleCategories.length === 0 ? (
          <p className="text-zinc-500">No categories yet.</p>
        ) : (
          visibleCategories.map((category) => {
            const spent = getCategorySpent(category, transactions);
            const left = getCategoryRemaining(category, transactions);

            const percent =
              category.budget > 0
                ? Math.min(
                    Math.round((spent / category.budget) * 100),
                    100
                  )
                : 0;

            return (
              <div key={category.id}>
                <div className="flex justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">
                      {getCategoryIcon(category.name)}
                    </span>

                    <p className="text-lg font-semibold">
                      {category.name}
                    </p>
                  </div>

                  <p className="font-semibold text-purple-300">
                    ${left.toFixed(2)} left
                  </p>
                </div>

                <div className="mt-2 h-3 rounded-full bg-zinc-800">
                  <div
                    className="h-3 rounded-full bg-purple-500 transition-all duration-700"
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-zinc-500">
                    ${spent.toFixed(2)} spent
                  </span>

                  <span className="text-zinc-500">
                    ${category.budget.toFixed(2)} budget
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {showViewAll &&
        typeof limit === "number" &&
        categories.length > limit && (
          <Link
            href="/dashboard/categories"
            className="mt-6 flex items-center justify-center rounded-xl border border-purple-500/30 bg-purple-500/10 px-4 py-3 text-sm font-semibold text-purple-300 transition hover:bg-purple-500/20"
          >
            View All Categories →
          </Link>
        )}
    </section>
  );
}