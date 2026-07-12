import type { IncomeSource } from "@/types/income";

type IncomeHistoryProps = {
  incomeSources: IncomeSource[];
  onEdit: (incomeId: string) => void;
  onDelete: (incomeId: string) => void;
};

export default function IncomeHistory({
  incomeSources,
  onEdit,
  onDelete,
}: IncomeHistoryProps) {
    
  return (
    <section className="rounded-2xl border border-emerald-800 bg-zinc-950/80 p-6">
      <p className="mb-4 text-sm uppercase tracking-widest text-emerald-400">
        Income Sources
      </p>

      <div className="space-y-4">
        {incomeSources.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-700 bg-zinc-900/40 p-6">
            <p className="font-semibold text-zinc-200">
              No income sources yet.
            </p>

            <p className="mt-2 text-sm text-zinc-500">
              How do you make your money?
            </p>
          </div>
        ) : (
          incomeSources.map((incomeSource) => (
            <div
              key={incomeSource.id}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 transition hover:border-green-500/40 hover:bg-zinc-900"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-lg font-semibold">
                    💵 {incomeSource.source}
                  </p>

                  <p className="mt-1 text-sm text-zinc-500">
                    {incomeSource.date
                      ? new Date(incomeSource.date).toLocaleDateString()
                      : "No date added"}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-bold text-green-400">
                    $
                    {incomeSource.amount.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(incomeSource.id)}
                      className="rounded-lg border border-zinc-700 px-3 py-2 text-sm font-medium text-zinc-300 transition hover:border-blue-500 hover:text-blue-400"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => onDelete(incomeSource.id)}
                      className="rounded-lg border border-red-900 px-3 py-2 text-sm font-medium text-red-400 transition hover:bg-red-950"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}