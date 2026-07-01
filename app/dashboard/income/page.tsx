"use client";

import AppLayout from "@/components/AppLayout";
import AddIncomeForm from "@/components/AddIncomeForm";
import { useBudget } from "@/context/BudgetContext";

export default function IncomePage() {
  const { incomeSources, deleteIncomeSource } = useBudget();

  const totalIncome = incomeSources.reduce(
    (total, incomeSource) => total + incomeSource.amount,
    0
  );

  const sourceCount = incomeSources.length;
  const averageIncome = sourceCount > 0 ? totalIncome / sourceCount : 0;

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

        <div className="grid gap-6 md:grid-cols-3">
          <section className="rounded-2xl border border-green-500/30 bg-zinc-950/80 p-6 shadow-xl">
            <p className="text-sm uppercase tracking-widest text-zinc-400">
              Total Income
            </p>
            <p className="mt-3 text-4xl font-bold text-green-400">
              ${totalIncome.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </section>

          <section className="rounded-2xl border border-blue-500/30 bg-zinc-950/80 p-6 shadow-xl">
            <p className="text-sm uppercase tracking-widest text-zinc-400">
              Income Sources
            </p>
            <p className="mt-3 text-4xl font-bold text-blue-400">
              {sourceCount}
            </p>
          </section>

          <section className="rounded-2xl border border-purple-500/30 bg-zinc-950/80 p-6 shadow-xl">
            <p className="text-sm uppercase tracking-widest text-zinc-400">
              Average
            </p>
            <p className="mt-3 text-4xl font-bold text-purple-400">
              ${averageIncome.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </section>
        </div>

        <div className="grid gap-8 lg:grid-cols-[400px_1fr]">
          <AddIncomeForm />

          <section className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6">
            <p className="uppercase tracking-widest text-zinc-400 text-sm mb-4">
              Income Sources
            </p>

            <div className="space-y-4">
              {incomeSources.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-zinc-700 bg-zinc-900/40 p-6">
                  <p className="font-semibold text-zinc-200">
                    No income sources yet.
                  </p>
                  <p className="mt-2 text-sm text-zinc-500">
                    How do you get your money? Work, benefits, theft? Add it here!
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
                          ${incomeSource.amount.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </p>

                        <button
                          onClick={() => deleteIncomeSource(incomeSource.id)}
                          className="mt-2 text-sm text-red-400 hover:text-red-300"
                        >
                          Delete
                        </button>
                      </div>
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