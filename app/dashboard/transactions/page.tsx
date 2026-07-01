"use client";

import { useBudget } from "@/context/BudgetContext";
import { useState } from "react";
import AppLayout from "@/components/AppLayout";

export default function TransactionsPage() {
  const { categories, transactions, addTransaction, deleteTransaction } =
    useBudget();

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");

  const totalSpent = transactions.reduce(
    (total, transaction) => total + transaction.amount,
    0
  );

  const transactionCount = transactions.length;
  const averageTransaction =
    transactionCount > 0 ? totalSpent / transactionCount : 0;

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const trimmedName = name.trim();
    const amountNumber = Number(amount);

    if (!trimmedName) return alert("Transaction name is required.");
    if (amountNumber <= 0) return alert("Amount must be greater than 0.");
    if (!category) return alert("Please select a category.");

    addTransaction({
      id: crypto.randomUUID(),
      name: trimmedName,
      amount: amountNumber,
      category,
    });

    setName("");
    setAmount("");
    setCategory("");
  }

  return (
    <AppLayout>
      <div className="px-8 py-8 space-y-8">
        <div>
          <p className="uppercase tracking-widest text-red-300 text-sm">
            Transaction Center
          </p>
          <h1 className="mt-2 text-5xl font-bold">Transactions</h1>
          <p className="mt-2 text-zinc-400">
            Add and review your spending.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <section className="rounded-2xl border border-red-500/30 bg-zinc-950/80 p-6 shadow-xl">
            <p className="text-sm uppercase tracking-widest text-zinc-400">
              Total Spent
            </p>
            <p className="mt-3 text-4xl font-bold text-red-400">
              ${totalSpent.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </section>

          <section className="rounded-2xl border border-blue-500/30 bg-zinc-950/80 p-6 shadow-xl">
            <p className="text-sm uppercase tracking-widest text-zinc-400">
              Transactions
            </p>
            <p className="mt-3 text-4xl font-bold text-blue-400">
              {transactionCount}
            </p>
          </section>

          <section className="rounded-2xl border border-purple-500/30 bg-zinc-950/80 p-6 shadow-xl">
            <p className="text-sm uppercase tracking-widest text-zinc-400">
              Average
            </p>
            <p className="mt-3 text-4xl font-bold text-purple-400">
              ${averageTransaction.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </section>
        </div>

        <div className="grid gap-8 lg:grid-cols-[400px_1fr]">
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6 shadow-xl"
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

            <button className="mt-6 w-full rounded-xl bg-emerald-400 px-6 py-3 font-semibold text-zinc-950 hover:bg-emerald-300">
              Save Transaction
            </button>
          </form>

          <section className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6 shadow-xl">
            <p className="uppercase tracking-widest text-zinc-400 text-sm mb-4">
              Recent Transactions
            </p>

            <div className="space-y-4">
              {transactions.length === 0 ? (
                <p className="text-zinc-500">No transactions yet.</p>
              ) : (
                transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5"
                  >
                    <div>
                      <p className="font-bold">{transaction.name}</p>
                      <p className="text-zinc-400">{transaction.category}</p>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-red-400">
                        -${transaction.amount.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>

                      <button
                        onClick={() => deleteTransaction(transaction.id)}
                        className="mt-1 text-sm text-red-400 hover:text-red-300"
                      >
                        Delete
                      </button>
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