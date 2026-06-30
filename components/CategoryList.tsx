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
};

export default function CategoryList({
  categories,
  transactions,
}: CategoryListProps) {
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
        {categories.map((category) => {
          const spent = getCategorySpent(category, transactions);
          const left = getCategoryRemaining(category, transactions);
          const percent = Math.min(
            Math.round((spent / category.budget) * 100),
            100
          );

          return (
            <div key={category.id}>
              <div className="flex justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{getCategoryIcon(category.name)}</span>

                  <p className="font-semibold text-lg">
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
        })}
      </div>
    </section>
  );
}