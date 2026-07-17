"use client";

import { useState } from "react";
import { useBudget } from "@/context/BudgetContext";
import PageHeader from "@/components/ui/PageHeader";
import PageStatCard from "@/components/ui/PageStatCard";
import PageSplitLayout from "@/components/ui/PageSplitLayout";
import TransactionForm from "@/components/transactions/TransactionForm";
import TransactionHistory from "@/components/transactions/TransactionHistory";
import MonthSelector from "@/components/budget/MonthSelector";

export default function TransactionsPage() {
  const {
    categories,
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  } = useBudget();

  const [editingTransactionId, setEditingTransactionId] = useState<
    string | null
  >(null);

  const editingTransaction =
    transactions.find(
      (transaction) => transaction.id === editingTransactionId
    ) ?? null;

  const totalSpent = transactions.reduce(
    (total, transaction) =>
      transaction.amount < 0
        ? total + Math.abs(transaction.amount)
        : total,
    0
  );

  const transactionCount = transactions.length;

  const averageTransaction =
    transactionCount > 0 ? totalSpent / transactionCount : 0;

  function handleEditTransaction(transactionId: string) {
    setEditingTransactionId(transactionId);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function handleDeleteTransaction(transactionId: string) {
    deleteTransaction(transactionId);

    if (editingTransactionId === transactionId) {
      setEditingTransactionId(null);
    }
  }

  return (
    <div className="space-y-10 px-8 py-8">
      <PageHeader
        eyebrow="Transaction Page"
        title="Transactions"
        description="Add and review your spending. See where your money is going."
        color="orange"
      />

      <div className="flex justify-center">
        <MonthSelector />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <PageStatCard
          label="Total Spent"
          value={`$${totalSpent.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          color="red"
        />

        <PageStatCard
          label="Transactions"
          value={transactionCount.toString()}
          color="orange"
        />

        <PageStatCard
          label="Average"
          value={`$${averageTransaction.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          color="blue"
        />
      </div>

      <PageSplitLayout
        left={
          <TransactionForm
            categories={categories}
            editingTransaction={editingTransaction}
            onAddTransaction={addTransaction}
            onUpdateTransaction={updateTransaction}
            onCancelEdit={() => setEditingTransactionId(null)}
          />
        }
        right={
          <TransactionHistory
            transactions={transactions}
            onEdit={handleEditTransaction}
            onDelete={handleDeleteTransaction}
          />
        }
      />
    </div>
  );
}