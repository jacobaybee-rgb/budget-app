import Link from "next/link";
import DashboardHeader from "@/components/DashboardHeader";
import SummaryCard from "@/components/SummaryCard";
import CategoryList from "@/components/CategoryList";
import TransactionList from "@/components/TransactionList";

const categories = [
  { name: "Groceries", budget: 600, spent: 248 },
  { name: "Gas", budget: 250, spent: 92 },
  { name: "Eating Out", budget: 200, spent: 141 },
  { name: "Bills", budget: 1800, spent: 1800 },
];

const transactions = [
  { name: "Walmart", category: "Groceries", amount: 82.43 },
  { name: "Shell", category: "Gas", amount: 46.1 },
  { name: "Amazon", category: "Shopping", amount: 27.99 },
];

export default function Dashboard() {
  const income = 5000;
  const spent = categories.reduce((total, category) => total + category.spent, 0);
  const remaining = income - spent;

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <DashboardHeader />

      <section className="mx-auto max-w-6xl px-6 py-10">
        <p className="text-zinc-400">Good evening, Jacob 👋</p>

        <h1 className="mt-2 text-4xl font-bold">Dashboard</h1>

        <div className="mt-8 rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-8">
          <p className="text-sm uppercase tracking-widest text-emerald-400">
            Remaining This Month
          </p>
          <p className="mt-3 text-6xl font-bold">${remaining.toLocaleString()}</p>
          <p className="mt-3 text-zinc-300">
            Based on ${income.toLocaleString()} income and ${spent.toLocaleString()} spent.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
            <SummaryCard label="Income" value={`$${income.toLocaleString()}`} />
            <SummaryCard label="Spent" value={`$${spent.toLocaleString()}`} />
            <SummaryCard label="Safe to Spend" value={`$${remaining.toLocaleString()}`} />
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <CategoryList categories={categories} />
          <TransactionList transactions={transactions} />
        </div>
      </section>
    </main>
  );
}