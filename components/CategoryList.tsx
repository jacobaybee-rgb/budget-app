import { Category } from "@/types/category";
import { Transaction } from "@/types/transaction";
import {
  getCategoryRemaining,
  getCategorySpent,
} from "@/lib/budget";

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
      <h2 className="text-2xl font-bold">Categories</h2>

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
                <p className="font-medium">{category.name}</p>
                <p className="text-zinc-400">${left} left</p>
              </div>

              <div className="mt-2 h-3 rounded-full bg-zinc-800">
                <div
                  className="h-3 rounded-full bg-emerald-400"
                  style={{ width: `${percent}%` }}
                />
              </div>

              <p className="mt-1 text-sm text-zinc-500">
                ${spent} of ${category.budget}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}