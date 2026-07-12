"use client";

import { useState } from "react";
import { useBudget } from "@/context/BudgetContext";

export default function AddBillForm() {
  const { categories, addBill } = useBudget();

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDay, setDueDay] = useState("");
  const [category, setCategory] = useState("");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const trimmedName = name.trim();
    const amountNumber = Number(amount);
    const dueDayNumber = Number(dueDay);

    if (!trimmedName) {
      alert("Bill name is required.");
      return;
    }

    if (amountNumber <= 0) {
      alert("Amount must be greater than 0.");
      return;
    }

    if (dueDayNumber < 1 || dueDayNumber > 31) {
      alert("Due day must be between 1 and 31.");
      return;
    }

    if (!category) {
      alert("Please select a category.");
      return;
    }

    addBill({
      id: crypto.randomUUID(),
      name: trimmedName,
      amount: amountNumber,
      dueDay: dueDayNumber,
      category,
      isPaid: false,
    });

    setName("");
    setAmount("");
    setDueDay("");
    setCategory("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-red-400 bg-zinc-950 p-6"
    >
      <h2 className="text-2xl font-bold text-white">Add Bill</h2>

      <div className="mt-6 space-y-4">
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Bill name"
          className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-red-400"
        />

        <input
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          placeholder="Monthly Amount"
          type="number"
          className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-red-400"
        />

        <input
          value={dueDay}
          onChange={(event) => setDueDay(event.target.value)}
          placeholder="Due day, example: 15"
          type="number"
          min="1"
          max="31"
          className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-red-400"
        />

        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-red-400"
        >
          <option value="">Select a category</option>

          {categories.map((category) => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="w-full rounded-xl border border-zinc-700 bg-zinc-1000 px-4 py-3 font-semibold text-red-400 transition hover:bg-red-400/50"
        >
          Add Bill
        </button>
      </div>
    </form>
  );
}