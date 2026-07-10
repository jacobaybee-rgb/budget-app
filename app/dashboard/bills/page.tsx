"use client";

import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { useBudget } from "@/context/BudgetContext";
import { CalendarDays, CheckCircle2, Trash2 } from "lucide-react";

export default function BillsPage() {
  const {
    categories,
    bills,
    addBill,
    deleteBill,
    toggleBillPaid,
    } = useBudget();

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDay, setDueDay] = useState("");
  const [category, setCategory] = useState("");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const trimmedName = name.trim();
    const amountNumber = Number(amount);
    const dueDayNumber = Number(dueDay);

    if (!trimmedName) {
      alert("Bill name is required.");
      return;
    }

    if (amountNumber <= 0) {
      alert("Amount must be greater than 0.");
      return;
    }

    if (dueDayNumber < 1 || dueDayNumber > 31) {
      alert("Due day must be between 1 and 31.");
      return;

    if (!category) {
      alert("Please select a category.");
      return;
    }
    }

    addBill({
      id: crypto.randomUUID(),
      name: trimmedName,
      amount: amountNumber,
      dueDay: dueDayNumber,
      category,
      isPaid: false,
    });

    setName("");
    setAmount("");
    setDueDay("");
    setCategory("");
  }

  const totalBills = bills.reduce((total, bill) => total + bill.amount, 0);
  const paidBills = bills.filter((bill) => bill.isPaid);
  const unpaidBills = bills.filter((bill) => !bill.isPaid);

  return (
    <AppLayout>
      <div className="space-y-8">
        <section className="rounded-2xl border border-red-400 bg-zinc-950/80 p-6 shadow-xl">
          <p className="text-sm uppercase tracking-widest text-red-400">
            Bills
          </p>

          <h1 className="mt-2 text-4xl font-bold text-white">
            Monthly Bills
          </h1>

          <p className="mt-2 text-zinc-400">
            Track what bills are due, how much they cost, and whether they have been paid.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <SummaryCard label="Total Bills" value={`$${totalBills.toFixed(2)}`} />
          <SummaryCard label="Paid" value={paidBills.length.toString()} />
          <SummaryCard label="Unpaid" value={unpaidBills.length.toString()} />
        </section>

        <section className="grid gap-8 lg:grid-cols-[0.9fr_1.3fr]">
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-red-400 bg-zinc-950 p-6"
          >
            <h2 className="text-2xl font-bold text-white">Add Bill</h2>

            <div className="mt-6 space-y-4">
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Bill name"
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-red-400"
              />

              <input
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                placeholder="Monthly Amount"
                type="number"
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-red-400"
              />

              <input
                value={dueDay}
                onChange={(event) => setDueDay(event.target.value)}
                placeholder="Due day, example: 15"
                type="number"
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-red-400"
              />

              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-red-400"
                >
                <option value="">Select a category</option>

                {categories.map((category) => (
                    <option key={category.id} value={category.name}>
                    {category.name}
                    </option>
                ))}
                </select>

              <button
                type="submit"
                className="w-full rounded-xl border border-zinc-700 bg-zinc-1000 px-4 py-3 font-semibold text-red-400 transition hover:bg-red-400/50"
              >
                Add Bill
              </button>
            </div>
          </form>

          <section className="rounded-2xl border border-red-400 bg-zinc-950 p-6">
            <h2 className="text-2xl font-bold text-white">Upcoming Bills</h2>

            <div className="mt-6 space-y-4">
              {bills.length === 0 ? (
                <p className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-zinc-400">
                  No bills added yet.
                </p>
              ) : (
                bills
                  .slice()
                  .sort((a, b) => a.dueDay - b.dueDay)
                  .map((bill) => (
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
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </section>
        </section>
      </div>
    </AppLayout>
  );
}

function SummaryCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5">
      <p className="text-xs uppercase tracking-widest text-zinc-400">
        {label}
      </p>

      <p className="mt-3 text-3xl font-bold text-white">{value}</p>
    </div>
  );
}