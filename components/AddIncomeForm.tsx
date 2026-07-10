"use client";

import { useState } from "react";
import { useBudget } from "@/context/BudgetContext";

export default function AddIncomeForm() {
  const { addIncomeSource } = useBudget();

  const [source, setSource] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    addIncomeSource({
      id: crypto.randomUUID(),
      source,
      amount: Number(amount),
      date,
    });

    setSource("");
    setAmount("");
    setDate("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-emerald-500/40 bg-zinc-950/20 p-6 backdrop-blur-xl space-y-4"
    >
      <p className="uppercase tracking-widest text-emerald-400 text-sm">
        Add Income
      </p>

      <input
        value={source}
        onChange={(e) => setSource(e.target.value)}
        placeholder="How do you make your money?"
        className="w-full rounded-xl bg-zinc-950 border border-zinc-700 px-4 py-3 outline-none focus:border-green-400"
      />

      <input
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        type="number"
        placeholder="How much do you make?"
        className="w-full rounded-xl bg-zinc-950 border border-zinc-700 px-4 py-3 outline-none focus:border-green-400"
      />

      <input
        value={date}
        onChange={(e) => setDate(e.target.value)}
        type="date"
        className="w-full rounded-xl bg-zinc-950 border border-zinc-700 px-4 py-3 outline-none focus:border-green-400"
      />

      <button className="w-full rounded-xl bg-emerald-500/80 py-3 font-bold text-zinc-950 hover:bg-green-400">
        Save Income
      </button>
    </form>
  );
}