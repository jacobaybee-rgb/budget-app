"use client";

import { useBudget } from "@/context/BudgetContext";
import { useState } from "react";
import AppLayout from "@/components/AppLayout";

export default function TransactionsPage() {
  const { 
    categories, 
    transactions, 
    addTransaction,
    updateTransaction,
    deleteTransaction 
  } = useBudget();

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [editingTransactionId, setEditingTransactionId] = useState<
    string | null
  >(null);

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

    if (editingTransactionId) {
      const existingTransaction = transactions.find(
        (transaction) => transaction.id === editingTransactionId
      );

      if (!existingTransaction) {
        return;
      }

      updateTransaction({
        ...existingTransaction,
        name: trimmedName,
        amount: -Math.abs(amountNumber),
        category,
      });

      setEditingTransactionId(null);
    } else {
      addTransaction({
        id: crypto.randomUUID(),
        name: trimmedName,
        amount: -Math.abs(amountNumber),
        category,
        date: new Date().toISOString().split("T")[0],
      });
    }

    setName("");
    setAmount("");
    setCategory("");
  }

  function handleEditTransaction(transactionId: string) {
    const transaction = transactions.find(
      (currentTransaction) => currentTransaction.id === transactionId
    );

    if (!transaction) {
      return;
    }

    setEditingTransactionId(transaction.id);
    setName(transaction.name);
    setAmount(Math.abs(transaction.amount).toString());
    setCategory(transaction.category);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function handleCancelEdit() {
    setEditingTransactionId(null);
    setName("");
    setAmount("");
    setCategory("");
  }

  return (
    <AppLayout>
      <div className="px-8 py-8 space-y-8">
        <div>
          <p className="uppercase tracking-widest text-orange-300 text-sm">
            Transaction Page
          </p>
          <h1 className="mt-2 text-5xl font-bold">Transactions</h1>
          <p className="mt-2 text-zinc-400">
            Add and review your spending. See where your money is going.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <section className="rounded-2xl border border-red-500/30 bg-zinc-950/80 p-6 shadow-xl">
            <p className="text-sm uppercase tracking-widest text-zinc-300">
              Total Spent
            </p>
            <p className="mt-3 text-4xl font-bold text-red-400">
              ${totalSpent.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </section>

          <section className="rounded-2xl border border-orange-300/30 bg-zinc-950/80 p-6 shadow-xl">
            <p className="text-sm uppercase tracking-widest text-zinc-300">
              Transactions
            </p>
            <p className="mt-3 text-4xl font-bold text-orange-300">
              {transactionCount}
            </p>
          </section>

          <section className="rounded-2xl border border-blue-500/30 bg-zinc-950/80 p-6 shadow-xl">
            <p className="text-sm uppercase tracking-widest text-zinc-300">
              Average
            </p>
            <p className="mt-3 text-4xl font-bold text-blue-400">
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
            className="rounded-2xl border border-orange-300 bg-zinc-950/80 p-6 shadow-xl"
          >
            <h2 className="text-2xl font-bold text-orange-300">
              {editingTransactionId ? "Edit Transaction" : "Add Transaction"}
            </h2>

            <label className="mt-6 block text-sm text-zinc-200">
              Description
            </label>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white"
              placeholder="Add Description"
            />

            <label className="mt-4 block text-sm text-zinc-200">
              Amount
            </label>
            <input
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white"
              placeholder="Add numerical amount"
              type="number"
            />

            <label className="mt-4 block text-sm text-zinc-200">
              Category
            </label>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white"
            >
              <option value="">Select a Category</option>

              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>

            <div className="mt-6 flex gap-3">
              <button
                type="submit"
                className="flex-1 rounded-xl border border-zinc-700 bg-zinc-900 px-6 py-3 font-semibold text-orange-300 hover:bg-orange-300/30"
              >
                {editingTransactionId ? "Save Changes" : "Save Transaction"}
              </button>

              {editingTransactionId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="rounded-xl border border-zinc-700 bg-zinc-900 px-6 py-3 font-semibold text-zinc-300 hover:bg-zinc-800"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          <section className="rounded-2xl border border-orange-300 bg-zinc-950/80 p-6 shadow-xl">
            <p className="uppercase tracking-widest text-orange-300 text-sm mb-4">
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
                        -${Math.abs(transaction.amount).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>

                      <div className="mt-2 flex justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => handleEditTransaction(transaction.id)}
                          className="text-sm text-blue-400 hover:text-blue-300"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => deleteTransaction(transaction.id)}
                          className="text-sm text-red-400 hover:text-red-300"
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