"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Banknote,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  ReceiptText,
  X,
} from "lucide-react";
import { useBudget } from "@/context/BudgetContext";

type FinancialCalendarProps = {
  isOpen: boolean;
  onClose: () => void;
};

const WEEK_DAYS = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
];

function parseMonthStart(monthStart: string) {
  const [year, month] = monthStart.split("-").map(Number);

  return new Date(year, month - 1, 1);
}

function formatDateKey(date: Date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function getSafeBillDate(
  monthDate: Date,
  preferredDay: number
) {
  const year = monthDate.getFullYear();
  const monthIndex = monthDate.getMonth();

  const lastDayOfMonth = new Date(
    year,
    monthIndex + 1,
    0
  ).getDate();

  const safeDay = Math.min(
    Math.max(preferredDay, 1),
    lastDayOfMonth
  );

  return new Date(year, monthIndex, safeDay);
}

export default function FinancialCalendar({
  isOpen,
  onClose,
}: FinancialCalendarProps) {
  const {
    selectedMonthStart,
    transactions,
    incomeSources,
    bills,
    goToPreviousMonth,
    goToNextMonth,
  } = useBudget();

  const displayedMonth = useMemo(
    () => parseMonthStart(selectedMonthStart),
    [selectedMonthStart]
  );

  const currentDate = new Date();

  const initialSelectedDay = useMemo(() => {
    const isCurrentMonth =
      displayedMonth.getFullYear() ===
        currentDate.getFullYear() &&
      displayedMonth.getMonth() === currentDate.getMonth();

    return isCurrentMonth ? currentDate.getDate() : 1;
  }, [displayedMonth]);

  const [selectedDay, setSelectedDay] = useState(
    initialSelectedDay
  );

  useEffect(() => {
    setSelectedDay(initialSelectedDay);
  }, [initialSelectedDay, selectedMonthStart]);

  useEffect(() => {
    if (!isOpen) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  const year = displayedMonth.getFullYear();
  const monthIndex = displayedMonth.getMonth();

  const monthLabel = displayedMonth.toLocaleDateString(
    "en-US",
    {
      month: "long",
      year: "numeric",
    }
  );

  const firstWeekDay = new Date(
    year,
    monthIndex,
    1
  ).getDay();

  const daysInMonth = new Date(
    year,
    monthIndex + 1,
    0
  ).getDate();

  const calendarCells = Array.from(
    { length: 42 },
    (_, cellIndex) => {
      const dayNumber = cellIndex - firstWeekDay + 1;

      if (
        dayNumber < 1 ||
        dayNumber > daysInMonth
      ) {
        return null;
      }

      return dayNumber;
    }
  );

  const selectedDate = new Date(
    year,
    monthIndex,
    selectedDay
  );

  const selectedDateKey = formatDateKey(selectedDate);

  const selectedDateLabel =
    selectedDate.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });

  const billTransactionIds = useMemo(
    () =>
      new Set(
        bills
          .map((bill) => bill.transactionId)
          .filter(
            (transactionId): transactionId is string =>
              Boolean(transactionId)
          )
      ),
    [bills]
  );

  const dayIncome = incomeSources.filter(
    (income) => income.date === selectedDateKey
  );

  const dayBills = bills.filter((bill) => {
    const billDate = getSafeBillDate(
      displayedMonth,
      bill.dueDay
    );

    return formatDateKey(billDate) === selectedDateKey;
  });

  const dayTransactions = transactions.filter(
    (transaction) =>
      transaction.date === selectedDateKey &&
      !billTransactionIds.has(transaction.id)
  );

  const hasSelectedDayEvents =
    dayIncome.length > 0 ||
    dayBills.length > 0 ||
    dayTransactions.length > 0;

  function getDayEventSummary(dayNumber: number) {
    const date = new Date(year, monthIndex, dayNumber);
    const dateKey = formatDateKey(date);

    const hasIncome = incomeSources.some(
      (income) => income.date === dateKey
    );

    const hasBills = bills.some((bill) => {
      const billDate = getSafeBillDate(
        displayedMonth,
        bill.dueDay
      );

      return formatDateKey(billDate) === dateKey;
    });

    const hasTransactions = transactions.some(
      (transaction) =>
        transaction.date === dateKey &&
        !billTransactionIds.has(transaction.id)
    );

    return {
      hasIncome,
      hasBills,
      hasTransactions,
    };
  }

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/75 p-3 backdrop-blur-md sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="financial-calendar-title"
        className="flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 shadow-2xl"
      >
        <header className="flex items-start justify-between gap-4 border-b border-zinc-800 px-5 py-5 sm:px-7">
          <div>
            <div className="flex items-center gap-3">
              <span className="rounded-2xl bg-blue-500/15 p-3 text-blue-300">
                <CalendarDays className="h-6 w-6" />
              </span>

              <div>
                <h2
                  id="financial-calendar-title"
                  className="text-2xl font-bold text-white"
                >
                  Financial Calendar
                </h2>

                <p className="mt-1 text-sm text-zinc-400">
                  See everything affecting your budget this
                  month.
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close financial calendar"
            className="rounded-xl p-2 text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
          >
            <X className="h-6 w-6" />
          </button>
        </header>

        <div className="grid min-h-0 flex-1 overflow-y-auto lg:grid-cols-[1.35fr_0.85fr] lg:overflow-hidden">
          {/* Left side: calendar */}
          <section className="border-b border-zinc-800 p-4 sm:p-7 lg:overflow-y-auto lg:border-b-0 lg:border-r">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={goToPreviousMonth}
                aria-label="View previous month"
                className="rounded-xl border border-zinc-800 bg-zinc-900 p-2.5 text-zinc-300 transition hover:border-zinc-700 hover:bg-zinc-800 hover:text-white"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <div className="text-center">
                <p className="text-xl font-bold text-white sm:text-2xl">
                  {monthLabel}
                </p>

                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-zinc-500">
                  Budget activity
                </p>
              </div>

              <button
                type="button"
                onClick={goToNextMonth}
                aria-label="View next month"
                className="rounded-xl border border-zinc-800 bg-zinc-900 p-2.5 text-zinc-300 transition hover:border-zinc-700 hover:bg-zinc-800 hover:text-white"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-7 grid grid-cols-7 gap-1 sm:gap-2">
              {WEEK_DAYS.map((weekDay) => (
                <div
                  key={weekDay}
                  className="py-2 text-center text-[10px] font-semibold uppercase tracking-wider text-zinc-500 sm:text-xs"
                >
                  {weekDay}
                </div>
              ))}

              {calendarCells.map((dayNumber, index) => {
                if (dayNumber === null) {
                  return (
                    <div
                      key={`empty-${index}`}
                      className="min-h-16 rounded-xl border border-transparent sm:min-h-24"
                    />
                  );
                }

                const dayDate = new Date(
                  year,
                  monthIndex,
                  dayNumber
                );

                const isSelected =
                  dayNumber === selectedDay;

                const isToday =
                  dayDate.getFullYear() ===
                    currentDate.getFullYear() &&
                  dayDate.getMonth() ===
                    currentDate.getMonth() &&
                  dayDate.getDate() ===
                    currentDate.getDate();

                const {
                  hasIncome,
                  hasBills,
                  hasTransactions,
                } = getDayEventSummary(dayNumber);

                return (
                  <button
                    key={dayNumber}
                    type="button"
                    onClick={() =>
                      setSelectedDay(dayNumber)
                    }
                    aria-label={`View financial activity for ${dayDate.toLocaleDateString(
                      "en-US",
                      {
                        month: "long",
                        day: "numeric",
                      }
                    )}`}
                    className={`relative flex min-h-16 flex-col rounded-xl border p-2 text-left transition sm:min-h-24 sm:rounded-2xl sm:p-3 ${
                      isSelected
                        ? "border-blue-400 bg-blue-500/20 shadow-lg shadow-blue-950/30"
                        : isToday
                        ? "border-blue-500/50 bg-blue-950/30 hover:bg-blue-950/50"
                        : "border-zinc-800 bg-zinc-900/70 hover:border-zinc-700 hover:bg-zinc-800"
                    }`}
                  >
                    <span
                      className={`text-sm font-bold sm:text-base ${
                        isSelected
                          ? "text-blue-200"
                          : isToday
                          ? "text-blue-300"
                          : "text-zinc-200"
                      }`}
                    >
                      {dayNumber}
                    </span>

                    <div className="mt-auto flex flex-wrap gap-1 pt-2">
                      {hasIncome && (
                        <span
                          title="Income"
                          className="h-2 w-2 rounded-full bg-emerald-400 sm:h-2.5 sm:w-2.5"
                        />
                      )}

                      {hasBills && (
                        <span
                          title="Bill due"
                          className="h-2 w-2 rounded-full bg-red-700 sm:h-2.5 sm:w-2.5"
                        />
                      )}

                      {hasTransactions && (
                        <span
                          title="Transaction"
                          className="h-2 w-2 rounded-full bg-amber-500 sm:h-2.5 sm:w-2.5"
                        />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs text-zinc-400">
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                Income
              </span>

              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-red-700" />
                Bills
              </span>

              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                Transactions
              </span>
            </div>
          </section>

          {/* Right side: selected-day details */}
          <aside className="bg-zinc-950/80 p-5 sm:p-7 lg:overflow-y-auto">
            <div className="border-b border-zinc-800 pb-5">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-400">
                Selected Day
              </p>

              <h3 className="mt-2 text-2xl font-bold text-white">
                {selectedDateLabel}
              </h3>

              <p className="mt-2 text-sm text-zinc-400">
                {hasSelectedDayEvents
                  ? "Here is everything affecting your budget on this day."
                  : "There is no financial activity scheduled for this day."}
              </p>
            </div>

            {!hasSelectedDayEvents && (
              <div className="flex min-h-64 flex-col items-center justify-center text-center">
                <span className="rounded-full bg-zinc-900 p-5 text-zinc-600">
                  <CalendarDays className="h-10 w-10" />
                </span>

                <h4 className="mt-5 text-lg font-semibold text-zinc-200">
                  Nothing scheduled
                </h4>

                <p className="mt-2 max-w-xs text-sm leading-6 text-zinc-500">
                  Select another date to review income,
                  bills, and transactions.
                </p>
              </div>
            )}

            {dayIncome.length > 0 && (
              <section className="mt-6">
                <div className="mb-3 flex items-center gap-2">
                  <Banknote className="h-5 w-5 text-emerald-400" />

                  <h4 className="font-semibold text-white">
                    Income
                  </h4>

                  <span className="ml-auto rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-semibold text-emerald-300">
                    {dayIncome.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {dayIncome.map((income) => (
                    <div
                      key={income.id}
                      className="rounded-2xl border border-emerald-500/20 bg-emerald-950/20 p-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-semibold text-zinc-100">
                            {income.source}
                          </p>

                          <p className="mt-1 text-xs text-zinc-500">
                            Income received
                          </p>
                        </div>

                        <p className="font-bold text-emerald-400">
                          +{formatCurrency(income.amount)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {dayBills.length > 0 && (
              <section className="mt-6">
                <div className="mb-3 flex items-center gap-2">
                  <ReceiptText className="h-5 w-5 text-red-400" />

                  <h4 className="font-semibold text-white">
                    Bills
                  </h4>

                  <span className="ml-auto rounded-full bg-red-500/15 px-2.5 py-1 text-xs font-semibold text-red-300">
                    {dayBills.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {dayBills.map((bill) => (
                    <div
                      key={bill.id}
                      className="rounded-2xl border border-red-500/20 bg-red-950/20 p-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-zinc-100">
                              {bill.name}
                            </p>

                            {bill.isPaid && (
                              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                            )}
                          </div>

                          <p className="mt-1 text-xs text-zinc-500">
                            {bill.category} ·{" "}
                            {bill.isPaid
                              ? "Paid"
                              : "Payment due"}
                          </p>
                        </div>

                        <p
                          className={`font-bold ${
                            bill.isPaid
                              ? "text-red-400"
                              : "text-red-300"
                          }`}
                        >
                          {formatCurrency(bill.amount)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {dayTransactions.length > 0 && (
              <section className="mt-6">
                <div className="mb-3 flex items-center gap-2">
                  <CircleDollarSign className="h-5 w-5 text-orange-400" />

                  <h4 className="font-semibold text-white">
                    Transactions
                  </h4>

                  <span className="ml-auto rounded-full bg-orange-400/10 px-2.5 py-1 text-xs font-semibold text-orange-400">
                    {dayTransactions.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {dayTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="rounded-2xl border border-orange-200/10 bg-orange-400/10 p-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-semibold text-zinc-100">
                            {transaction.name}
                          </p>

                          <p className="mt-1 text-xs text-zinc-500">
                            {transaction.category}
                          </p>
                        </div>

                        <p
                          className={`font-bold ${
                            transaction.amount >= 0
                              ? "text-orange-400"
                              : "text-orange-400"
                          }`}
                        >
                          {transaction.amount >= 0
                            ? "+"
                            : "-"}
                          {formatCurrency(
                            Math.abs(transaction.amount)
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}