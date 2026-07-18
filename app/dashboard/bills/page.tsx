"use client";

import { useBudget } from "@/context/BudgetContext";
import BillsHeader from "@/components/bills/BillsHeader";
import BillsStats from "@/components/bills/BillsStats";
import AddBillForm from "@/components/bills/AddBillForm";
import BillsList from "@/components/bills/BillsList";
import MonthSelector from "@/components/budget/MonthSelector";

export default function BillsPage() {
  const { budgetMonthStatus } = useBudget();

  const isMonthClosed = budgetMonthStatus === "closed";

  return (
    <div className="space-y-10">
      <BillsHeader />

      <div className="flex justify-center">
        <MonthSelector />
      </div>

      {isMonthClosed && (
        <div className="mx-8 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-center">
          <p className="font-semibold text-amber-300">
            This month is closed
          </p>

          <p className="mt-1 text-sm text-zinc-400">
            Bills from this month are read-only. Their payment
            status cannot be changed, and bills cannot be added or
            deleted.
          </p>
        </div>
      )}

      <BillsStats />

      <section className="grid gap-8 p-6 px-8 lg:grid-cols-[0.9fr_1.3fr]">
        <AddBillForm />
        <BillsList />
      </section>
    </div>
  );
}