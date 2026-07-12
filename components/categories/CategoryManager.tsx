import type { Category } from "@/types/category";

type CategoryManagerProps = {
  categories: Category[];
  onEdit: (categoryId: string) => void;
  onDelete: (categoryId: string) => void;
};

export default function CategoryManager({
  categories,
  onEdit,
  onDelete,
}: CategoryManagerProps) {
  return (
    <section className="rounded-2xl border border-purple-800 bg-zinc-950/80 p-6 shadow-xl">
      <p className="mb-4 text-sm uppercase tracking-widest text-purple-400">
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
                  onClick={() => onEdit(category.id)}
                  className="rounded-lg bg-blue-950/40 px-3 py-2 text-sm text-blue-400 transition hover:bg-blue-900/50 hover:text-blue-300"
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => onDelete(category.id)}
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
  );
}