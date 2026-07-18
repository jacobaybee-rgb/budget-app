"use client";

import { useBudget } from "@/context/BudgetContext";
import {
  CalendarDays,
  CheckCircle2,
  Trash2,
} from "lucide-react";

export default function BillsList() {
  const {
    bills,
    deleteBill,
    toggleBillPaid,
    budgetMonthStatus,
  } = useBudget();

  const isMonthClosed = budgetMonthStatus === "closed";

  const sortedBills = bills
    .slice()
    .sort((a, b) => a.dueDay - b.dueDay);

  return (
    <section className="rounded-2xl border border-red-400 bg-zinc-950 p-6">
      <h2 className="text-2xl font-bold text-white">
        Upcoming Bills
      </h2>

      <div className="mt-6 space-y-4">
        {sortedBills.length === 0 ? (
          <p className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-zinc-400">
            No bills added yet.
          </p>
        ) : (
          sortedBills.map((bill) => (
            <div
              key={bill.id}
              className="flex flex-col gap-4 rounded-xl border border-zinc-700 bg-zinc-950 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-blue-400" />

                  <h3 className="text-lg font-bold text-white">
                    {bill.name}
                  </h3>
                </div>

                <p className="mt-1 text-sm text-zinc-400">
                  Due on day {bill.dueDay} • {bill.category}
                </p>

                <p className="mt-2 text-xl font-bold text-green-400">
                  ${bill.amount.toFixed(2)}
                </p>
              </div>

              {!isMonthClosed && (
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => toggleBillPaid(bill.id)}
                    className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                      bill.isPaid
                        ? "bg-green-500/20 text-green-300"
                        : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" />
                      {bill.isPaid ? "Paid" : "Mark Paid"}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteBill(bill.id)}
                    className="rounded-xl bg-red-500/10 px-4 py-2 text-red-300 transition hover:bg-red-500/20"
                    aria-label={`Delete ${bill.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              )}

              {isMonthClosed && (
                <div
                  className={`rounded-xl px-4 py-2 text-sm font-semibold ${
                    bill.isPaid
                      ? "bg-green-500/20 text-green-300"
                      : "bg-zinc-800 text-zinc-400"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    {bill.isPaid ? "Paid" : "Unpaid"}
                  </span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </section>
  );
}