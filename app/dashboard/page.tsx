"use client";

import { useBudget } from "@/context/BudgetContext";
import CategoryList from "@/components/dashboard/CategoryList";
import TransactionList from "@/components/dashboard/TransactionList";
import QuickActions from "@/components/dashboard/QuickActions";
import FinancialOverview from "@/components/dashboard/FinancialOverview";
import RemainingBudgetCard from "@/components/dashboard/RemainingBudgetCard";
import DashboardHero from "@/components/dashboard/DashboardHero";
import { getDashboardSummary } from "@/lib/dashboard";

export default function Dashboard() {
  const { categories, transactions, incomeSources } = useBudget();

  const {
    income,
    spent,
    remaining,
    spentPercent,
    budgetMessage,
    financialStatus,
  } = getDashboardSummary({
    incomeSources,
    transactions,
  });

  return (
    <>
      <DashboardHero
        financialStatus={financialStatus}
        notificationCount={0}
      />  

      {/* Remaining This Month Card */}
      <div className="relative z-10 -mt-32 px-4 sm:px-6 md:-mt-70 md:px-8">
        <div className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
          <RemainingBudgetCard
            income={income}
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

      {/* Main Content */}
      <div className="px-8 pt-6 space-y-8">
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