"use client";

import { useState } from "react";
import { useBudget } from "@/context/BudgetContext";
import type { Goal } from "@/types/goal";

export default function GoalsPage() {
  const { goals, addGoal, updateGoal, deleteGoal } = useBudget();

  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [currentAmount, setCurrentAmount] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);

  const totalTarget = goals.reduce(
    (total, goal) => total + goal.targetAmount,
    0
  );

  const totalSaved = goals.reduce(
    (total, goal) => total + goal.currentAmount,
    0
  );

  const overallProgress =
    totalTarget > 0 ? Math.min((totalSaved / totalTarget) * 100, 100) : 0;

  function resetForm() {
    setName("");
    setTargetAmount("");
    setCurrentAmount("");
    setTargetDate("");
    setEditingGoalId(null);
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const trimmedName = name.trim();
    const targetNumber = Number(targetAmount);
    const currentNumber = Number(currentAmount);

    if (!trimmedName) {
      alert("Goal name is required.");
      return;
    }

    if (targetNumber <= 0) {
      alert("Target amount must be greater than 0.");
      return;
    }

    if (currentNumber < 0) {
      alert("Current amount cannot be negative.");
      return;
    }

    if (!targetDate) {
      alert("Please select a target date.");
      return;
    }

    const goal: Goal = {
      id: editingGoalId ?? crypto.randomUUID(),
      name: trimmedName,
      targetAmount: targetNumber,
      currentAmount: currentNumber,
      targetDate,
    };

    if (editingGoalId) {
      updateGoal(goal);
    } else {
      addGoal(goal);
    }

    resetForm();
  }

  function handleEdit(goal: Goal) {
    setEditingGoalId(goal.id);
    setName(goal.name);
    setTargetAmount(goal.targetAmount.toString());
    setCurrentAmount(goal.currentAmount.toString());
    setTargetDate(goal.targetDate);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function handleDelete(id: string) {
    deleteGoal(id);

    if (editingGoalId === id) {
      resetForm();
    }
  }

  return (
    <>
      <div className="space-y-8 px-8 py-8">
        <div>
          <p className="text-sm uppercase tracking-widest text-yellow-400">
            Goal Center
          </p>

          <h1 className="mt-2 text-5xl font-bold">
            Savings Goals
          </h1>

          <p className="mt-2 text-zinc-400">
            Set financial goals and track your progress toward reaching them.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <section className="rounded-2xl border border-yellow-400/80 bg-zinc-950/80 p-6 shadow-xl">
            <p className="text-sm uppercase tracking-widest text-zinc-400">
              Total Goal Amount
            </p>

            <p className="mt-3 text-4xl font-bold text-yellow-400">
              $
              {totalTarget.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </section>

          <section className="rounded-2xl border border-green-500/30 bg-zinc-950/80 p-6 shadow-xl">
            <p className="text-sm uppercase tracking-widest text-zinc-400">
              Total Saved
            </p>

            <p className="mt-3 text-4xl font-bold text-green-400">
              $
              {totalSaved.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </section>

          <section className="rounded-2xl border border-blue-500/30 bg-zinc-950/80 p-6 shadow-xl">
            <p className="text-sm uppercase tracking-widest text-zinc-400">
              Overall Progress
            </p>

            <p className="mt-3 text-4xl font-bold text-blue-400">
              {overallProgress.toFixed(0)}%
            </p>
          </section>
        </div>

        <div className="grid gap-8 lg:grid-cols-[400px_1fr]">
          <form
            onSubmit={handleSubmit}
            className="h-fit space-y-4 rounded-2xl border border-yellow-400/80 bg-zinc-950/80 p-6"
          >
            <div>
              <p className="text-sm uppercase tracking-widest text-yellow-400">
                {editingGoalId ? "Edit Goal" : "Add Goal"}
              </p>

              <p className="mt-1 text-sm text-zinc-500">
                {editingGoalId
                  ? "Update the details for this goal."
                  : "What are you saving for?"}
              </p>
            </div>

            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Goal name"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-yellow-400"
            />

            <input
              value={targetAmount}
              onChange={(event) => setTargetAmount(event.target.value)}
              type="number"
              min="0"
              step="0.01"
              placeholder="Target amount"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-yellow-400"
            />

            <input
              value={currentAmount}
              onChange={(event) => setCurrentAmount(event.target.value)}
              type="number"
              min="0"
              step="0.01"
              placeholder="Current amount saved"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-yellow-400"
            />

            <div>
              <label className="mb-2 block text-sm text-zinc-400">
                Target date
              </label>

              <input
                value={targetDate}
                onChange={(event) => setTargetDate(event.target.value)}
                type="date"
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-yellow-400"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-1000 py-3 font-bold text-yellow-400 transition hover:bg-yellow-400/30"
            >
              {editingGoalId ? "Save Changes" : "Create Goal"}
            </button>

            {editingGoalId && (
              <button
                type="button"
                onClick={resetForm}
                className="w-full rounded-xl border border-zinc-700 py-3 font-semibold text-zinc-300 transition hover:bg-zinc-800"
              >
                Cancel
              </button>
            )}
          </form>

          <section className="rounded-2xl border border-yellow-400/80 bg-zinc-950/80 p-6">
            <p className="mb-4 text-sm uppercase tracking-widest text-yellow-400">
              Your Goals
            </p>

            <div className="space-y-4">
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
                goals.map((goal) => {
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
                    <div
                      key={goal.id}
                      className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 transition hover:border-purple-500/40"
                    >
                      <div className="flex flex-col justify-between gap-4 sm:flex-row">
                        <div>
                          <div className="flex items-center gap-2">
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
                            $
                            {goal.currentAmount.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </p>

                          <p className="text-sm text-zinc-500">
                            of $
                            {goal.targetAmount.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="mt-5">
                        <div className="mb-2 flex justify-between text-sm">
                          <span className="text-zinc-400">
                            {progress.toFixed(0)}% complete
                          </span>

                          <span className="text-zinc-500">
                            ${remaining.toLocaleString()} remaining
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
                          onClick={() => handleEdit(goal)}
                          className="rounded-lg border border-zinc-700 px-3 py-2 text-sm font-medium text-zinc-300 transition hover:border-blue-500 hover:text-blue-400"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(goal.id)}
                          className="rounded-lg border border-red-900 px-3 py-2 text-sm font-medium text-red-400 transition hover:bg-red-950"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}