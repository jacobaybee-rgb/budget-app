"use client";

import AppLayout from "@/components/AppLayout";
import AddIncomeForm from "@/components/AddIncomeForm";
import { useBudget } from "@/context/BudgetContext";

export default function IncomePage() {
  const { incomeSources } = useBudget();

  const totalIncome = incomeSources.reduce(
    (total, incomeSource) => total + incomeSource.amount,
    0
  );

  return (
    <AppLayout>
      <div className="px-8 py-8 space-y-8">
        <div>
          <p className="uppercase tracking-widest text-green-300 text-sm">
            Income Center
          </p>
          <h1 className="text-5xl font-bold mt-2">Income</h1>
          <p className="text-zinc-400 mt-2">
            Track where your money comes from and how much you have coming in.
          </p>
        </div>

        <section className="rounded-2xl border border-green-500/30 bg-zinc-950/80 p-8 shadow-2xl">
          <p className="text-zinc-400 text-sm uppercase tracking-widest">
            Total Income
          </p>
          <p className="text-5xl font-bold text-green-400 mt-3">
            ${totalIncome.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </section>

        <div className="grid gap-8 lg:grid-cols-[400px_1fr]">
          <AddIncomeForm />

          <section className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6">
            <p className="uppercase tracking-widest text-zinc-400 text-sm mb-4">
              Income Sources
            </p>

            <div className="space-y-3">
              {incomeSources.length === 0 ? (
                <p className="text-zinc-500">
                  No income added yet. Add your first income source.
                </p>
              ) : (
                incomeSources.map((incomeSource) => (
                  <div
                    key={incomeSource.id}
                    className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/60 p-4"
                  >
                    <div>
                      <p className="font-semibold">{incomeSource.source}</p>
                      <p className="text-sm text-zinc-400">
                        {incomeSource.date}
                      </p>
                    </div>

                    <p className="text-green-400 font-bold">
                      ${incomeSource.amount.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
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