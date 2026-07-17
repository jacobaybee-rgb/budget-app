"use client";

import { useEffect, useState } from "react";
import { CalendarDays, RefreshCw } from "lucide-react";
import { useBudget } from "@/context/BudgetContext";
import type { IncomeSource } from "@/types/income";

type AddIncomeFormProps = {
  editingIncome: IncomeSource | null;
  onCancelEdit: () => void;
};

type IncomeType = "one-time" | "monthly";

export default function IncomeForm({
  editingIncome,
  onCancelEdit,
}: AddIncomeFormProps) {
  const { 
    selectedMonthStart,
    addIncomeSource,
    addIncomeTemplate,
    updateIncomeSource 
  } = useBudget();

  const [source, setSource] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [incomeType, setIncomeType] =
    useState<IncomeType>("one-time");
  const [recurringDay, setRecurringDay] = useState("");

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (editingIncome) {
      setSource(editingIncome.source);
      setAmount(editingIncome.amount.toString());
      setDate(editingIncome.date);
      setIncomeType("one-time");
      setRecurringDay("");
    } else {
      setSource("");
      setAmount("");
      setDate("");
      setIncomeType("one-time");
      setRecurringDay("");
    }
  }, [editingIncome]);
  /* eslint-enable react-hooks/set-state-in-effect */

  function resetForm() {
    setSource("");
    setAmount("");
    setDate("");
    setIncomeType("one-time");
    setRecurringDay("");
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const trimmedSource = source.trim();
    const amountNumber = Number(amount);
    const recurringDayNumber = Number(recurringDay);

    if (!trimmedSource) {
      alert("Income source is required.");
      return;
    }

    if (!Number.isFinite(amountNumber) || amountNumber <= 0) {
      alert("Income amount must be greater than 0.");
      return;
    }

    if (editingIncome) {
      if (!date) {
        alert("Income date is required.");
        return;
      }

      await updateIncomeSource({
        id: editingIncome.id,
        source: trimmedSource,
        amount: amountNumber,
        date,
        incomeTemplateId: editingIncome.incomeTemplateId,
      });

      onCancelEdit();
      resetForm();
      return;
    }

    if (incomeType === "monthly") {
      if (
        !Number.isInteger(recurringDayNumber) ||
        recurringDayNumber < 1 ||
        recurringDayNumber > 31
      ) {
        alert("Recurring day must be between 1 and 31.");
        return;
      }

      await addIncomeTemplate({
        id: crypto.randomUUID(),
        source: trimmedSource,
        amount: amountNumber,
        frequency: "monthly",
        recurringDay: recurringDayNumber,
        startMonth: selectedMonthStart,
        isActive: true,
      });

      resetForm();
      return;
    }

    if (!date) {
      alert("Income date is required.");
      return;
    }

    await addIncomeSource({
      id: crypto.randomUUID(),
      source: trimmedSource,
      amount: amountNumber,
      date,
    });

    resetForm();
  }

  function handleCancel() {
    resetForm();
    onCancelEdit();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl border border-emerald-500/40 bg-zinc-950/20 p-6 backdrop-blur-xl"
    >
      <p className="text-sm uppercase tracking-widest text-emerald-400">
        {editingIncome ? "Edit Income" : "Add Income"}
      </p>

      {!editingIncome && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-zinc-300">
            Income Type
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setIncomeType("one-time")}
              className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
                incomeType === "one-time"
                  ? "border-emerald-400 bg-emerald-500/10"
                  : "border-zinc-700 bg-zinc-950 hover:border-zinc-500"
              }`}
            >
              <div
                className={`rounded-lg p-2 ${
                  incomeType === "one-time"
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "bg-zinc-900 text-zinc-400"
                }`}
              >
                <CalendarDays size={20} />
              </div>

              <div>
                <p className="font-semibold text-white">
                  One-Time
                </p>

                <p className="text-xs text-zinc-400">
                  Add income to one month
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setIncomeType("monthly")}
              className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
                incomeType === "monthly"
                  ? "border-emerald-400 bg-emerald-500/10"
                  : "border-zinc-700 bg-zinc-950 hover:border-zinc-500"
              }`}
            >
              <div
                className={`rounded-lg p-2 ${
                  incomeType === "monthly"
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "bg-zinc-900 text-zinc-400"
                }`}
              >
                <RefreshCw size={20} />
              </div>

              <div>
                <p className="font-semibold text-white">
                  Monthly Recurring
                </p>

                <p className="text-xs text-zinc-400">
                  Automatically add it each month
                </p>
              </div>
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <label
          htmlFor="income-source"
          className="text-sm font-medium text-zinc-300"
        >
          Income Source
        </label>

        <input
          id="income-source"
          value={source}
          onChange={(event) => setSource(event.target.value)}
          placeholder="How do you make your money?"
          className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none transition focus:border-green-400"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="income-amount"
          className="text-sm font-medium text-zinc-300"
        >
          Amount
        </label>

        <input
          id="income-amount"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          type="number"
          min="0.01"
          step="0.01"
          placeholder="How much do you make?"
          className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none transition focus:border-green-400"
        />
      </div>

      {(editingIncome || incomeType === "one-time") && (
        <div className="space-y-2">
          <label
            htmlFor="income-date"
            className="text-sm font-medium text-zinc-300"
          >
            Income Date
          </label>

          <input
            id="income-date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            type="date"
            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none transition focus:border-green-400"
          />
        </div>
      )}

      {!editingIncome && incomeType === "monthly" && (
        <div className="space-y-2">
          <label
            htmlFor="recurring-day"
            className="text-sm font-medium text-zinc-300"
          >
            Day of Month
          </label>

          <input
            id="recurring-day"
            value={recurringDay}
            onChange={(event) =>
              setRecurringDay(event.target.value)
            }
            type="number"
            min="1"
            max="31"
            step="1"
            placeholder="Example: 1 or 15"
            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none transition focus:border-green-400"
          />

          <p className="text-xs text-zinc-500">
            For months with fewer days, the income will be added on
            the final day of that month.
          </p>
        </div>
      )}

      <button
        type="submit"
        className="w-full rounded-xl bg-emerald-500/80 py-3 font-bold text-zinc-950 transition hover:bg-green-400"
      >
        {editingIncome
          ? "Save Changes"
          : incomeType === "monthly"
            ? "Create Recurring Income"
            : "Save Income"}
      </button>

      {editingIncome && (
        <button
          type="button"
          onClick={handleCancel}
          className="w-full rounded-xl border border-zinc-700 py-3 font-semibold text-zinc-300 transition hover:bg-zinc-800"
        >
          Cancel
        </button>
      )}
    </form>
  );
}