"use client";

import { useEffect, useState } from "react";
import { useBudget } from "@/context/BudgetContext";

type IncomeSource = {
  id: string;
  source: string;
  amount: number;
  date: string;
};

type AddIncomeFormProps = {
  editingIncome: IncomeSource | null;
  onCancelEdit: () => void;
};

export default function AddIncomeForm({
  editingIncome,
  onCancelEdit,
}: AddIncomeFormProps) {
  const { addIncomeSource, updateIncomeSource } = useBudget();

  const [source, setSource] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    if (editingIncome) {
      setSource(editingIncome.source);
      setAmount(editingIncome.amount.toString());
      setDate(editingIncome.date);
    } else {
      setSource("");
      setAmount("");
      setDate("");
    }
  }, [editingIncome]);

  function resetForm() {
    setSource("");
    setAmount("");
    setDate("");
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const trimmedSource = source.trim();
    const amountNumber = Number(amount);

    if (!trimmedSource) {
      alert("Income source is required.");
      return;
    }

    if (amountNumber <= 0) {
      alert("Income amount must be greater than 0.");
      return;
    }

    if (!date) {
      alert("Income date is required.");
      return;
    }

    if (editingIncome) {
      updateIncomeSource({
        id: editingIncome.id,
        source: trimmedSource,
        amount: amountNumber,
        date,
      });

      onCancelEdit();
    } else {
      addIncomeSource({
        id: crypto.randomUUID(),
        source: trimmedSource,
        amount: amountNumber,
        date,
      });
    }

    resetForm();
  }

  function handleCancel() {
    resetForm();
    onCancelEdit();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-emerald-500/40 bg-zinc-950/20 p-6 backdrop-blur-xl"
    >
      <p className="text-sm uppercase tracking-widest text-emerald-400">
        {editingIncome ? "Edit Income" : "Add Income"}
      </p>

      <input
        value={source}
        onChange={(event) => setSource(event.target.value)}
        placeholder="How do you make your money?"
        className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-green-400"
      />

      <input
        value={amount}
        onChange={(event) => setAmount(event.target.value)}
        type="number"
        min="0"
        step="0.01"
        placeholder="How much do you make?"
        className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-green-400"
      />

      <input
        value={date}
        onChange={(event) => setDate(event.target.value)}
        type="date"
        className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-green-400"
      />

      <button
        type="submit"
        className="w-full rounded-xl bg-emerald-500/80 py-3 font-bold text-zinc-950 hover:bg-green-400"
      >
        {editingIncome ? "Save Changes" : "Save Income"}
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