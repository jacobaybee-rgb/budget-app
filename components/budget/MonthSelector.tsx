"use client";

import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useBudget } from "@/context/BudgetContext";

function getMonthStart(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function parseMonthStart(monthStart: string) {
  const [year, month] = monthStart.split("-").map(Number);

  return new Date(year, month - 1, 1);
}

export default function MonthSelector() {
  const {
    selectedMonthStart,
    isBudgetLoading,
    goToPreviousMonth,
    goToNextMonth,
    goToCurrentMonth,
  } = useBudget();

  const selectedMonth = parseMonthStart(selectedMonthStart);
  const currentMonth = getMonthStart(new Date());

  const maximumFutureMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 12,
    1
  );

  const isCurrentMonth =
    selectedMonth.getFullYear() === currentMonth.getFullYear() &&
    selectedMonth.getMonth() === currentMonth.getMonth();

  const canGoNext = selectedMonth < maximumFutureMonth;

  const formattedMonth = selectedMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex flex-col items-start gap-2">
        <div className="flex items-center gap-4">
        <button
            type="button"
            onClick={goToPreviousMonth}
            disabled={isBudgetLoading}
            aria-label="Go to previous month"
            className="rounded-full p-2 text-white transition hover:bg-white/10 disabled:opacity-40"
        >
            <ChevronLeft className="h-6 w-6" />
        </button>

        <div className="flex items-center gap-3">
            <CalendarDays className="h-5 w-5 text-blue-300" />

            <span className="text-2xl font-semibold text-white">
            {isBudgetLoading ? "Loading..." : formattedMonth}
            </span>
        </div>

        <button
            type="button"
            onClick={goToNextMonth}
            disabled={isBudgetLoading || !canGoNext}
            aria-label="Go to next month"
            className="rounded-full p-2 text-white transition hover:bg-white/10 disabled:opacity-40"
        >
            <ChevronRight className="h-6 w-6" />
        </button>
        </div>

        {!isCurrentMonth ? (
        <button
            onClick={goToCurrentMonth}
            className="ml-14 text-sm text-blue-300 transition hover:text-white"
        >
            Return to Current Month
        </button>
        ) : (
        <p className="ml-14 text-sm text-zinc-300">
            Current Month
        </p>
        )}
    </div>
    );
}