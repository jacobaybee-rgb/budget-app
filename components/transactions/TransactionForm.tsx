"use client";

import { useEffect, useState } from "react";
import type { Category } from "@/types/category";
import type { Transaction } from "@/types/transaction";

type TransactionFormProps = {
  categories: Category[];
  editingTransaction: Transaction | null;
  onAddTransaction: (transaction: Transaction) => void;
  onUpdateTransaction: (transaction: Transaction) => void;
  onCancelEdit: () => void;
  isReadOnly?: boolean;
};

export default function TransactionForm({
  categories,
  editingTransaction,
  onAddTransaction,
  onUpdateTransaction,
  onCancelEdit,
  isReadOnly = false,
}: TransactionFormProps) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (editingTransaction) {
      setName(editingTransaction.name);
      setAmount(Math.abs(editingTransaction.amount).toString());
      setCategory(editingTransaction.category);
    } else {
      setName("");
      setAmount("");
      setCategory("");
    }
  }, [editingTransaction]);
  /* eslint-enable react-hooks/set-state-in-effect */

  function resetForm() {
    setName("");
    setAmount("");
    setCategory("");
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (isReadOnly) {
      alert("This budget month is closed and cannot be changed.");
      return;
    }

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

    if (editingTransaction) {
      onUpdateTransaction({
        ...editingTransaction,
        name: trimmedName,
        amount: -Math.abs(amountNumber),
        category,
      });

      onCancelEdit();
    } else {
      onAddTransaction({
        id: crypto.randomUUID(),
        name: trimmedName,
        amount: -Math.abs(amountNumber),
        category,
        date: new Date().toISOString().split("T")[0],
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
      className="rounded-2xl border border-orange-300 bg-zinc-950/80 p-6 shadow-xl"
    >
      <h2 className="text-2xl font-bold text-orange-300">
        {editingTransaction ? "Edit Transaction" : "Add Transaction"}
      </h2>

      <label className="mt-6 block text-sm text-zinc-200">
        Description
      </label>

      <input
        value={name}
        onChange={(event) => setName(event.target.value)}
        disabled={isReadOnly}
        className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-orange-300"
        placeholder="Add Description"
      />

      <label className="mt-4 block text-sm text-zinc-200">
        Amount
      </label>

      <input
        value={amount}
        onChange={(event) => setAmount(event.target.value)}
        disabled={isReadOnly}
        className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-orange-300 disabled:cursor-not-allowed disabled:opacity-50"
        placeholder="Add numerical amount"
        type="number"
        min="0"
        step="0.01"
      />

      <label className="mt-4 block text-sm text-zinc-200">
        Category
      </label>

      <select
        value={category}
        onChange={(event) => setCategory(event.target.value)}
        disabled={isReadOnly}
        className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-orange-300 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <option value="">Select a Category</option>

        {categories.map((categoryItem) => (
          <option key={categoryItem.id} value={categoryItem.name}>
            {categoryItem.name}
          </option>
        ))}
      </select>

      <div className="mt-6 flex gap-3">
        <button
          type="submit"
          disabled={isReadOnly}
          className="flex-1 rounded-xl border border-zinc-700 bg-zinc-900 px-6 py-3 font-semibold text-orange-300 hover:bg-orange-300/30 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {editingTransaction ? "Save Changes" : "Save Transaction"}
        </button>

        {editingTransaction && (
          <button
            type="button"
            onClick={handleCancel}
            className="rounded-xl border border-zinc-700 bg-zinc-900 px-6 py-3 font-semibold text-zinc-300 hover:bg-zinc-800"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}