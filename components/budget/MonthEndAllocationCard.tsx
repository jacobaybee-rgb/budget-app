"use client";

import { useMemo, useState } from "react";
import { LockKeyhole, Plus, Trash2 } from "lucide-react";
import {
  useBudget,
  type MonthEndAllocationInput,
} from "@/context/BudgetContext";

type AllocationRow = {
  id: string;
  destinationType: MonthEndAllocationInput["destinationType"];
  amount: string;
  goalId: string;
};

type MonthEndAllocationCardProps = {
  remaining: number;
};

function formatCurrency(amount: number) {
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

function getCurrentMonthStart() {
  const now = new Date();

  return [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    "01",
  ].join("-");
}

function formatMonth(monthStart: string) {
  const [year, month] = monthStart.split("-").map(Number);

  return new Date(year, month - 1, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

export default function MonthEndAllocationCard({
  remaining,
}: MonthEndAllocationCardProps) {
  const {
    goals,
    selectedMonthStart,
    budgetMonthStatus,
    closedAt,
    closingBalance,
    savingsBalance,
    closeBudgetMonth,
  } = useBudget();

  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [allocations, setAllocations] = useState<AllocationRow[]>([
    {
      id: crypto.randomUUID(),
      destinationType: "next_month",
      amount: "",
      goalId: "",
    },
  ]);

  const currentMonthStart = getCurrentMonthStart();

  const isCurrentOrPastMonth =
    selectedMonthStart <= currentMonthStart;

  const positiveRemaining = Math.max(remaining, 0);

  const allocatedTotal = useMemo(
    () =>
      allocations.reduce(
        (total, allocation) =>
          total + Math.max(Number(allocation.amount) || 0, 0),
        0
      ),
    [allocations]
  );

  const unallocatedAmount = Math.max(
    positiveRemaining - allocatedTotal,
    0
  );

  const hasOverAllocated =
    allocatedTotal > positiveRemaining + 0.005;

  function updateAllocation(
    id: string,
    changes: Partial<AllocationRow>
  ) {
    setAllocations((currentAllocations) =>
      currentAllocations.map((allocation) =>
        allocation.id === id
          ? {
              ...allocation,
              ...changes,
              goalId:
                changes.destinationType &&
                changes.destinationType !== "goal"
                  ? ""
                  : changes.goalId ?? allocation.goalId,
            }
          : allocation
      )
    );
  }

  function addAllocation() {
    setAllocations((currentAllocations) => [
      ...currentAllocations,
      {
        id: crypto.randomUUID(),
        destinationType: "savings",
        amount: "",
        goalId: "",
      },
    ]);
  }

  function removeAllocation(id: string) {
    setAllocations((currentAllocations) =>
      currentAllocations.filter(
        (allocation) => allocation.id !== id
      )
    );
  }

  async function handleCloseMonth() {
    if (positiveRemaining <= 0) {
      alert("There is no remaining money to allocate.");
      return;
    }

    if (hasOverAllocated) {
      alert(
        "Your allocations cannot exceed the remaining balance."
      );
      return;
    }

    const cleanedAllocations: MonthEndAllocationInput[] =
      allocations
        .map((allocation) => ({
          destinationType: allocation.destinationType,
          amount: Number(allocation.amount),
          goalId:
            allocation.destinationType === "goal"
              ? allocation.goalId
              : undefined,
        }))
        .filter(
          (allocation) =>
            Number.isFinite(allocation.amount) &&
            allocation.amount > 0
        );

    const missingGoal = cleanedAllocations.some(
      (allocation) =>
        allocation.destinationType === "goal" &&
        !allocation.goalId
    );

    if (missingGoal) {
      alert("Please select a goal for every goal allocation.");
      return;
    }

    if (unallocatedAmount > 0) {
      cleanedAllocations.push({
        destinationType: "unallocated",
        amount: unallocatedAmount,
      });
    }

    const confirmed = window.confirm(
      `Close ${formatMonth(
        selectedMonthStart
      )} and allocate ${formatCurrency(positiveRemaining)}?`
    );

    if (!confirmed) return;

    try {
      setIsSubmitting(true);
      await closeBudgetMonth(cleanedAllocations);
      setIsOpen(false);
    } catch {
      // BudgetContext already shows the error.
    } finally {
      setIsSubmitting(false);
    }
  }

  if (budgetMonthStatus === "closed") {
    return (
      <section className="rounded-2xl border border-green-500/30 bg-zinc-950/80 p-6 shadow-xl">
        <div className="flex items-start gap-4">
          <div className="rounded-xl bg-green-500/10 p-3">
            <LockKeyhole className="h-6 w-6 text-green-400" />
          </div>

          <div>
            <p className="text-sm uppercase tracking-widest text-green-400">
              Month Closed
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              {formatMonth(selectedMonthStart)} is complete
            </h2>

            <p className="mt-2 text-zinc-400">
              Closing balance:{" "}
              <span className="font-semibold text-white">
                {formatCurrency(closingBalance ?? 0)}
              </span>
            </p>

            {closedAt && (
              <p className="mt-1 text-sm text-zinc-500">
                Closed on{" "}
                {new Date(closedAt).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <p className="text-sm text-zinc-400">
            Total saved through month-end allocations
          </p>

          <p className="mt-1 text-2xl font-bold text-green-400">
            {formatCurrency(savingsBalance)}
          </p>
        </div>
      </section>
    );
  }

  if (!isCurrentOrPastMonth) {
    return (
      <section className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6">
        <p className="text-sm uppercase tracking-widest text-zinc-500">
          Month-End Allocation
        </p>

        <p className="mt-3 text-zinc-400">
          Future months cannot be closed yet.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-blue-500/40 bg-zinc-950/80 p-6 shadow-xl">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <p className="text-sm uppercase tracking-widest text-blue-400">
            End-of-Month Allocation
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            Decide where your remaining money goes
          </h2>

          <p className="mt-2 text-zinc-400">
            Remaining to allocate:{" "}
            <span className="font-semibold text-white">
              {formatCurrency(positiveRemaining)}
            </span>
          </p>
        </div>

        {!isOpen && (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            disabled={positiveRemaining <= 0}
            className="rounded-xl bg-blue-500/80 px-5 py-3 font-semibold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Allocate Remaining Money
          </button>
        )}
      </div>

      {positiveRemaining <= 0 && (
        <p className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 text-sm text-zinc-400">
          There is no positive balance available to allocate.
        </p>
      )}

      {isOpen && positiveRemaining > 0 && (
        <div className="mt-6 space-y-4">
          {allocations.map((allocation) => (
            <div
              key={allocation.id}
              className="grid gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 md:grid-cols-[1fr_1fr_auto]"
            >
              <div>
                <label className="mb-2 block text-sm text-zinc-400">
                  Destination
                </label>

                <select
                  value={allocation.destinationType}
                  onChange={(event) =>
                    updateAllocation(allocation.id, {
                      destinationType: event.target
                        .value as AllocationRow["destinationType"],
                    })
                  }
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-blue-500"
                >
                  <option value="next_month">
                    Carry into next month
                  </option>

                  <option value="savings">
                    General savings
                  </option>

                  <option value="goal">
                    Savings goal
                  </option>
                </select>

                {allocation.destinationType === "goal" && (
                  <select
                    value={allocation.goalId}
                    onChange={(event) =>
                      updateAllocation(allocation.id, {
                        goalId: event.target.value,
                      })
                    }
                    className="mt-3 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-blue-500"
                  >
                    <option value="">Select a goal</option>

                    {goals.map((goal) => (
                      <option key={goal.id} value={goal.id}>
                        {goal.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm text-zinc-400">
                  Amount
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={allocation.amount}
                  onChange={(event) =>
                    updateAllocation(allocation.id, {
                      amount: event.target.value,
                    })
                  }
                  placeholder="0.00"
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="button"
                onClick={() =>
                  removeAllocation(allocation.id)
                }
                disabled={allocations.length === 1}
                aria-label="Remove allocation"
                className="self-end rounded-xl border border-red-900 p-3 text-red-400 transition hover:bg-red-950 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addAllocation}
            className="flex items-center gap-2 rounded-xl border border-zinc-700 px-4 py-3 text-sm font-semibold text-zinc-300 transition hover:border-blue-500 hover:text-blue-400"
          >
            <Plus className="h-4 w-4" />
            Add Another Destination
          </button>

          <div className="grid gap-4 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 sm:grid-cols-3">
            <div>
              <p className="text-sm text-zinc-500">
                Available
              </p>

              <p className="mt-1 text-xl font-bold">
                {formatCurrency(positiveRemaining)}
              </p>
            </div>

            <div>
              <p className="text-sm text-zinc-500">
                Allocated
              </p>

              <p
                className={`mt-1 text-xl font-bold ${
                  hasOverAllocated
                    ? "text-red-400"
                    : "text-blue-400"
                }`}
              >
                {formatCurrency(allocatedTotal)}
              </p>
            </div>

            <div>
              <p className="text-sm text-zinc-500">
                Unallocated
              </p>

              <p className="mt-1 text-xl font-bold text-red-400/70">
                {formatCurrency(unallocatedAmount)}
              </p>
            </div>
          </div>

          {hasOverAllocated && (
            <p className="text-sm font-medium text-red-400">
              You allocated more than the month’s remaining balance.
            </p>
          )}

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              disabled={isSubmitting}
              className="rounded-xl border border-zinc-700 px-5 py-3 font-semibold text-zinc-300 transition hover:bg-zinc-800 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={() => void handleCloseMonth()}
              disabled={isSubmitting || hasOverAllocated}
              className="rounded-xl bg-blue-500/80 px-5 py-3 font-semibold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting
                ? "Closing Month..."
                : `Close ${formatMonth(selectedMonthStart)}`}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}