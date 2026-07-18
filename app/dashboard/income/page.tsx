"use client";

import { useState } from "react";
import { useBudget } from "@/context/BudgetContext";
import IncomeForm from "@/components/income/IncomeForm";
import IncomeHistory from "@/components/income/IncomeHistory";
import PageHeader from "@/components/ui/PageHeader";
import PageSplitLayout from "@/components/ui/PageSplitLayout";
import PageStatCard from "@/components/ui/PageStatCard";
import MonthSelector from "@/components/budget/MonthSelector";

export default function IncomePage() {
  const {
    incomeSources,
    deleteIncomeSource,
    budgetMonthStatus,
  } = useBudget();

  const [editingIncomeId, setEditingIncomeId] = useState<string | null>(null);

  const isMonthClosed = budgetMonthStatus === "closed";

  const editingIncome =
    incomeSources.find(
      (incomeSource) => incomeSource.id === editingIncomeId
    ) ?? null;

  const totalIncome = incomeSources.reduce(
    (total, incomeSource) => total + incomeSource.amount,
    0
  );

  const sourceCount = incomeSources.length;

  const averageIncome =
    sourceCount > 0 ? totalIncome / sourceCount : 0;

  function handleEditIncome(incomeId: string) {
    if (isMonthClosed) return;

    setEditingIncomeId(incomeId);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function handleDeleteIncome(incomeId: string) {
    if (isMonthClosed) return;

    deleteIncomeSource(incomeId);

    if (editingIncomeId === incomeId) {
      setEditingIncomeId(null);
    }
  }

  return (
    <div className="space-y-10 px-8 py-8">
      <PageHeader
        eyebrow="Income Center"
        title="Income"
        description="Track where your money comes from and how much you have coming in."
        color="green"
      />

      <div className="flex justify-center">
        <MonthSelector />
      </div>

      {isMonthClosed && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-center">
          <p className="font-semibold text-amber-300">
            This month is closed
          </p>

          <p className="mt-1 text-sm text-zinc-400">
            Income from this month is read-only and can no longer be
            added, edited, or deleted.
          </p>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        <PageStatCard
          label="Total Income"
          value={`$${totalIncome.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          color="green"
        />

        <PageStatCard
          label="Income Sources"
          value={sourceCount.toString()}
          color="zinc"
        />

        <PageStatCard
          label="Average"
          value={`$${averageIncome.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          color="blue"
        />
      </div>

      <PageSplitLayout
        left={
          <IncomeForm
            editingIncome={editingIncome}
            onCancelEdit={() => setEditingIncomeId(null)}
            isReadOnly={isMonthClosed}
          />
        }
        right={
          <IncomeHistory
            incomeSources={incomeSources}
            onEdit={handleEditIncome}
            onDelete={handleDeleteIncome}
            isReadOnly={isMonthClosed}
          />
        }
      />
    </div>
  );
}