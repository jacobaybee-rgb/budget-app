"use client";

import { useMemo } from "react";
import { useBudget } from "@/context/BudgetContext";
import CategoryList from "@/components/dashboard/CategoryList";
import TransactionList from "@/components/dashboard/TransactionList";
import QuickActions from "@/components/dashboard/QuickActions";
import FinancialOverview from "@/components/dashboard/FinancialOverview";
import RemainingBudgetCard from "@/components/dashboard/RemainingBudgetCard";
import DashboardHero from "@/components/dashboard/DashboardHero";
import { getDashboardSummary } from "@/lib/dashboard";
import { getNotifications } from "@/lib/notifications";
import MonthEndAllocationCard from "@/components/budget/MonthEndAllocationCard";

export default function Dashboard() {
  const {
    categories,
    transactions,
    incomeSources,
    bills,
    goals,
    carryoverReceived,
    selectedMonthStart,
    budgetMonthStatus,
    notificationPreferences,
  } = useBudget();

  const {
    income,
    carryover,
    availableFunds,
    spent,
    remaining,
    spentPercent,
    budgetMessage,
    financialStatus,
  } = getDashboardSummary({
    incomeSources,
    transactions,
    carryoverReceived,
    budgetMonthStatus,
  });

  const notifications = useMemo(
    () =>
      getNotifications({
        bills,
        incomeSources,
        categories,
        transactions,
        goals,
        selectedMonthStart,
        budgetMonthStatus,
        preferences: notificationPreferences,
      }),
    [
      bills,
      incomeSources,
      categories,
      transactions,
      goals,
      selectedMonthStart,
      budgetMonthStatus,
      notificationPreferences,
    ]
  );

  return (
    <>
      <DashboardHero
        financialStatus={financialStatus}
        notifications={notifications}
      />

      <div className="relative z-10 -mt-32 px-4 sm:px-6 md:-mt-45 md:px-8">
        <div className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
          <RemainingBudgetCard
            income={income}
            carryover={carryover}
            availableFunds={availableFunds}
            spent={spent}
            remaining={remaining}
            spentPercent={spentPercent}
            budgetMessage={budgetMessage}
          />

          <QuickActions />
        </div>
      </div>

      <FinancialOverview
        income={income}
        spent={spent}
        remaining={remaining}
        transactionCount={transactions.length}
      />

      <div className="space-y-8 px-8 pt-6">
        <MonthEndAllocationCard remaining={remaining} />

        <div className="grid gap-8 lg:grid-cols-2">
          <CategoryList
            categories={categories}
            transactions={transactions}
            limit={5}
            showViewAll
          />

          <TransactionList
            transactions={transactions}
            limit={5}
            showViewAll
          />
        </div>
      </div>
    </>
  );
}