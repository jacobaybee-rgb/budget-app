"use client";

import type { Goal } from "@/types/goal";

type GoalsListProps = {
  goals: Goal[];
  onEditGoal: (goal: Goal) => void;
  onDeleteGoal: (id: string) => void;
};

function formatCurrency(amount: number) {
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

export default function GoalsList({
  goals,
  onEditGoal,
  onDeleteGoal,
}: GoalsListProps) {
  return (
    <section className="rounded-2xl border border-yellow-400/80 bg-zinc-950/80 p-6">
      <p className="mb-4 text-sm uppercase tracking-widest text-yellow-400">
        Your Goals
      </p>

      {goals.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-700 bg-zinc-900/40 p-8 text-center">
          <p className="text-4xl">🎯</p>

          <p className="mt-4 font-semibold text-zinc-200">
            No savings goals yet.
          </p>

          <p className="mt-2 text-sm text-zinc-500">
            Create your first goal to start tracking your progress.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {goals.map((goal) => {
            const progress =
              goal.targetAmount > 0
                ? Math.min(
                    (goal.currentAmount / goal.targetAmount) * 100,
                    100
                  )
                : 0;

            const remaining = Math.max(
              goal.targetAmount - goal.currentAmount,
              0
            );

            const isComplete =
              goal.currentAmount >= goal.targetAmount;

            return (
              <article
                key={goal.id}
                className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 transition hover:border-purple-500/40"
              >
                <div className="flex flex-col justify-between gap-4 sm:flex-row">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-xl font-semibold">
                        🎯 {goal.name}
                      </p>

                      {isComplete && (
                        <span className="rounded-full bg-green-500/15 px-3 py-1 text-xs font-semibold text-green-400">
                          Complete
                        </span>
                      )}
                    </div>

                    <p className="mt-2 text-sm text-zinc-500">
                      Target date:{" "}
                      {goal.targetDate
                        ? new Date(
                            `${goal.targetDate}T00:00:00`
                          ).toLocaleDateString()
                        : "No date"}
                    </p>
                  </div>

                  <div className="sm:text-right">
                    <p className="text-2xl font-bold text-green-400">
                      {formatCurrency(goal.currentAmount)}
                    </p>

                    <p className="text-sm text-zinc-500">
                      of {formatCurrency(goal.targetAmount)}
                    </p>
                  </div>
                </div>

                <div className="mt-5">
                  <div className="mb-2 flex flex-wrap justify-between gap-2 text-sm">
                    <span className="text-zinc-400">
                      {progress.toFixed(0)}% complete
                    </span>

                    <span className="text-zinc-500">
                      {formatCurrency(remaining)} remaining
                    </span>
                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-zinc-800">
                    <div
                      className="h-full rounded-full bg-purple-500 transition-all"
                      style={{
                        width: `${progress}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="mt-5 flex gap-2">
                  <button
                    type="button"
                    onClick={() => onEditGoal(goal)}
                    className="rounded-lg border border-zinc-700 px-3 py-2 text-sm font-medium text-zinc-300 transition hover:border-blue-500 hover:text-blue-400"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => onDeleteGoal(goal.id)}
                    className="rounded-lg border border-red-900 px-3 py-2 text-sm font-medium text-red-400 transition hover:bg-red-950"
                  >
                    Delete
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}