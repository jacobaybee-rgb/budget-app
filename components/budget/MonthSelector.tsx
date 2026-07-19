"use client";

import { useEffect, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Lock,
  X,
} from "lucide-react";
import { useBudget } from "@/context/BudgetContext";

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function getMonthStart(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function parseMonthStart(monthStart: string) {
  const [year, month] = monthStart.split("-").map(Number);

  return new Date(year, month - 1, 1);
}

function formatMonthStart(year: number, monthIndex: number) {
  return [
    year,
    String(monthIndex + 1).padStart(2, "0"),
    "01",
  ].join("-");
}

export default function MonthSelector() {
  const {
    selectedMonthStart,
    budgetMonths,
    isBudgetLoading,
    goToPreviousMonth,
    goToNextMonth,
    goToCurrentMonth,
    goToMonth,
  } = useBudget();

  const selectedMonth = parseMonthStart(selectedMonthStart);
  const currentMonth = getMonthStart(new Date());

  const maximumFutureMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 12,
    1
  );

  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const [pickerYear, setPickerYear] = useState(
    selectedMonth.getFullYear()
  );

  const isCurrentMonth =
    selectedMonth.getFullYear() === currentMonth.getFullYear() &&
    selectedMonth.getMonth() === currentMonth.getMonth();

  const canGoNext = selectedMonth < maximumFutureMonth;

  const formattedMonth = selectedMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  useEffect(() => {
    if (!isPickerOpen) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsPickerOpen(false);
      }
    }

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isPickerOpen]);

  function openMonthPicker() {
    setPickerYear(selectedMonth.getFullYear());
    setIsPickerOpen(true);
  }

  function handleSelectMonth(monthIndex: number) {
    const selectedDate = new Date(
      pickerYear,
      monthIndex,
      1
    );

    if (selectedDate > maximumFutureMonth) {
      return;
    }

    goToMonth(
      formatMonthStart(pickerYear, monthIndex)
    );

    setIsPickerOpen(false);
  }

  return (
    <>
      <div className="flex flex-col items-start gap-2">
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            type="button"
            onClick={goToPreviousMonth}
            disabled={isBudgetLoading}
            aria-label="Go to previous month"
            className="rounded-full p-2 text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            type="button"
            onClick={openMonthPicker}
            disabled={isBudgetLoading}
            aria-label="Open month picker"
            className="group flex items-center gap-3 rounded-xl px-3 py-2 text-left transition hover:bg-black/25 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <CalendarDays className="h-5 w-5 shrink-0 text-blue-300" />

            <span className="text-2xl font-semibold text-white">
              {isBudgetLoading
                ? "Loading..."
                : formattedMonth}
            </span>

            <ChevronDown className="h-5 w-5 text-white/70 transition group-hover:text-white" />
          </button>

          <button
            type="button"
            onClick={goToNextMonth}
            disabled={isBudgetLoading || !canGoNext}
            aria-label="Go to next month"
            className="rounded-full p-2 text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>

        {!isCurrentMonth ? (
          <button
            type="button"
            onClick={goToCurrentMonth}
            disabled={isBudgetLoading}
            className="ml-12 text-sm text-blue-300 transition hover:text-white disabled:opacity-40 sm:ml-14"
          >
            Return to Current Month
          </button>
        ) : (
          <p className="ml-12 text-sm text-zinc-300 sm:ml-14">
            Current Month
          </p>
        )}
      </div>

      {isPickerOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setIsPickerOpen(false);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="month-picker-title"
            className="w-full max-w-md rounded-3xl border border-white/10 bg-zinc-950 p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2
                  id="month-picker-title"
                  className="text-2xl font-bold text-white"
                >
                  Pick a Budget Month
                </h2>

                <p className="mt-1 text-sm text-zinc-400">
                  Jump directly to the month you want to view.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsPickerOpen(false)}
                aria-label="Close month picker"
                className="rounded-xl p-2 text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-900/70 p-2">
              <button
                type="button"
                onClick={() =>
                  setPickerYear(
                    (currentYear) => currentYear - 1
                  )
                }
                aria-label="View previous year"
                className="rounded-xl p-2 text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <p className="text-xl font-bold text-white">
                {pickerYear}
              </p>

              <button
                type="button"
                onClick={() =>
                  setPickerYear(
                    (currentYear) => currentYear + 1
                  )
                }
                disabled={
                  pickerYear >=
                  maximumFutureMonth.getFullYear()
                }
                aria-label="View next year"
                className="rounded-xl p-2 text-zinc-300 transition hover:bg-zinc-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3">
              {MONTH_NAMES.map(
                (monthName, monthIndex) => {
                  const monthDate = new Date(
                    pickerYear,
                    monthIndex,
                    1
                  );

                  const monthStart = formatMonthStart(
                    pickerYear,
                    monthIndex
                  );

                  const monthRecord = budgetMonths.find(
                    (month) =>
                      month.monthStart === monthStart
                  );

                  const isClosed =
                    monthRecord?.status === "closed";

                  const isOpen =
                    monthRecord?.status === "open";

                  const isSelected =
                    pickerYear ===
                      selectedMonth.getFullYear() &&
                    monthIndex ===
                      selectedMonth.getMonth();

                  const isActualCurrentMonth =
                    pickerYear ===
                      currentMonth.getFullYear() &&
                    monthIndex ===
                      currentMonth.getMonth();

                  const isUnavailable =
                    monthDate > maximumFutureMonth;

                  return (
                    <button
                      key={monthName}
                      type="button"
                      onClick={() =>
                        handleSelectMonth(monthIndex)
                      }
                      disabled={isUnavailable}
                      className={`relative flex min-h-20 flex-col items-center justify-center rounded-2xl border px-3 py-3 text-sm font-semibold transition ${
                        isSelected
                          ? "border-blue-400 bg-blue-500 text-white"
                          : isClosed
                          ? "border-amber-400/50 bg-amber-950/40 text-amber-100 hover:bg-amber-900/50"
                          : isActualCurrentMonth
                          ? "border-blue-400/70 bg-blue-950/50 text-blue-200 hover:bg-blue-900/60"
                          : "border-zinc-800 bg-zinc-900 text-zinc-200 hover:border-zinc-600 hover:bg-zinc-800"
                      } disabled:cursor-not-allowed disabled:border-zinc-900 disabled:bg-zinc-950 disabled:text-zinc-700`}
                    >
                      <span>
                        {monthName.slice(0, 3)}
                      </span>

                      {isClosed && (
                        <span
                          className={`mt-1 flex items-center gap-1 text-[10px] font-medium uppercase tracking-wide ${
                            isSelected
                              ? "text-white/90"
                              : "text-amber-300"
                          }`}
                        >
                          <Lock className="h-3 w-3" />
                          Closed
                        </span>
                      )}

                      {isOpen &&
                        !isClosed &&
                        !isActualCurrentMonth &&
                        !isSelected && (
                          <span className="mt-1 flex items-center gap-1 text-[10px] font-medium uppercase tracking-wide text-emerald-400">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                            Open
                          </span>
                        )}

                      {isActualCurrentMonth &&
                        !isSelected &&
                        !isClosed && (
                          <span className="mt-1 text-[10px] font-medium uppercase tracking-wide text-blue-300">
                            Current
                          </span>
                        )}
                    </button>
                  );
                }
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                goToCurrentMonth();
                setIsPickerOpen(false);
              }}
              className="mt-6 w-full rounded-2xl border border-blue-400/40 bg-blue-950/40 px-4 py-3 font-semibold text-blue-200 transition hover:bg-blue-900/60 hover:text-white"
            >
              Go to Current Month
            </button>
          </div>
        </div>
      )}
    </>
  );
}