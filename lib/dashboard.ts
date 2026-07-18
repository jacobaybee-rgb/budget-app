import type { IncomeSource } from "@/types/income";
import type { Transaction } from "@/types/transaction";

type DashboardSummaryInput = {
  incomeSources: IncomeSource[];
  transactions: Transaction[];
  carryoverReceived?: number;
};

export type FinancialStatus = {
  title: string;
  message: string;
  textColor: string;
  dotColor: string;
};

type DashboardSummary = {
  income: number;
  spent: number;
  remaining: number;
  availableFunds: number;
  carryover: number;
  spentPercent: number;
  budgetMessage: string;
  financialStatus: FinancialStatus;
};

export function getDashboardSummary({
  incomeSources,
  transactions,
  carryoverReceived = 0,
}: DashboardSummaryInput): DashboardSummary {
  const income = incomeSources.reduce(
    (total, incomeSource) => total + incomeSource.amount,
    0
  );

  const carryover = carryoverReceived ?? 0;

  const availableFunds = income + carryover;

  const spent = transactions.reduce(
    (total, transaction) =>
      transaction.amount < 0
        ? total + Math.abs(transaction.amount)
        : total,
    0
  );

  const remaining = availableFunds - spent;

  const spentPercent =
    availableFunds > 0
      ? Math.min(
          Math.round((spent / availableFunds) * 100),
          100
        )
      : 0;

  const budgetMessage =
    income === 0
      ? "Add your income to unlock your monthly budget insight."
      : spentPercent < 50
      ? "Excellent pace. You're well ahead of budget."
      : spentPercent < 75
      ? "You're on track. Keep an eye on everyday spending."
      : spentPercent < 90
      ? "Budget is getting tight. Slow down on non-essential purchases."
      : spentPercent < 100
      ? "Careful — you're close to using your full monthly income."
      : "You've spent more than your income. Time to re-evaluate spending.";

  const financialStatus: FinancialStatus =
    income === 0
      ? {
          title: "No Income",
          message: "Add income to begin tracking your financial status.",
          textColor: "text-zinc-300",
          dotColor: "bg-zinc-400",
        }
      : spentPercent < 50
      ? {
          title: "Excellent",
          message: "You’re keeping your spending well under control.",
          textColor: "text-green-400",
          dotColor: "bg-green-400",
        }
      : spentPercent < 75
      ? {
          title: "On Track",
          message: "Your spending is still within a healthy range.",
          textColor: "text-blue-400",
          dotColor: "bg-blue-400",
        }
      : spentPercent < 90
      ? {
          title: "Watch Spending",
          message: "Your available budget is starting to get tight.",
          textColor: "text-yellow-400",
          dotColor: "bg-yellow-400",
        }
      : spentPercent < 100
      ? {
          title: "Near Limit",
          message: "You’re close to spending your full monthly income.",
          textColor: "text-orange-400",
          dotColor: "bg-orange-400",
        }
      : {
          title: "Over Budget",
          message: "Your spending has exceeded your monthly income.",
          textColor: "text-red-400",
          dotColor: "bg-red-400",
        };

  return {
    income,
    carryover,
    availableFunds,
    spent,
    remaining,
    spentPercent,
    budgetMessage,
    financialStatus,
  };
}