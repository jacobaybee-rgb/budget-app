"use client";

import { useBudget } from "@/context/BudgetContext";

export default function BillsStats() {
  const { bills } = useBudget();

  const totalBills = bills.reduce(
    (total, bill) => total + bill.amount,
    0
  );

  const paidBills = bills.filter((bill) => bill.isPaid);
  const unpaidBills = bills.filter((bill) => !bill.isPaid);

  return (
    <section className="grid gap-4 px-8 md:grid-cols-3">
      <SummaryCard
        label="Total Bills"
        value={`$${totalBills.toFixed(2)}`}
      />

      <SummaryCard
        label="Paid"
        value={paidBills.length.toString()}
      />

      <SummaryCard
        label="Unpaid"
        value={unpaidBills.length.toString()}
      />
    </section>
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

      <p className="mt-3 text-3xl font-bold text-white">
        {value}
      </p>
    </div>
  );
}