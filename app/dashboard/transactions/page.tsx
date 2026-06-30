"use client";

import AppSidebar from "@/components/AppSidebar";
import { useBudget } from "@/context/BudgetContext";
import { useState } from "react";
import MobileNav from "@/components/MobileNav";

export default function TransactionsPage() {
  const { categories, transactions, addTransaction } = useBudget();

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const trimmedName = name.trim();
    const amountNumber = Number(amount);

    if (!trimmedName) {
      alert("Transaction name is required.");
      return;
    }

    if (amountNumber <= 0) {
      alert("Amount must be greater than 0.");
      return;
    }

    if (!category) {
      alert("Please select a category.");
      return;
    }

    addTransaction({
      name: trimmedName,
      amount: amountNumber,
      category,
    });

    setName("");
    setAmount("");
    setCategory("");
  }

  return (
    <main className="flex min-h-screen bg-zinc-950 text-white">
      <AppSidebar />

      <section className="flex-1 px-6 py-24">
        <h1 className="text-4xl font-bold">Transactions</h1>
        <p className="mt-2 text-zinc-400">
          Add and review your spending.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 max-w-xl rounded-2xl border border-zinc-800 bg-zinc-900 p-6"
        >
          <h2 className="text-2xl font-bold">Add Transaction</h2>

          <label className="mt-6 block text-sm text-zinc-400">
            Description
          </label>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white"
            placeholder="Walmart"
          />

          <label className="mt-4 block text-sm text-zinc-400">
            Amount
          </label>
          <input
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white"
            placeholder="82.43"
            type="number"
          />

          <label className="mt-4 block text-sm text-zinc-400">
            Category
          </label>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white"
          >
            <option value="">Select a category</option>

            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>

          <button className="mt-6 rounded-full bg-emerald-400 px-6 py-3 font-semibold text-zinc-950">
            Save Transaction
          </button>
        </form>

        <div className="mt-8 max-w-xl space-y-4">
          {transactions.map((transaction) => (
            <div
              key={`${transaction.name}-${transaction.amount}`}
              className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900 p-4"
            >
              <div>
                <p className="font-bold">{transaction.name}</p>
                <p className="text-zinc-400">{transaction.category}</p>
              </div>

              <p className="font-bold">-${transaction.amount}</p>
            </div>
          ))}
        </div>
      </section>
      <MobileNav />
    </main>
  );
}