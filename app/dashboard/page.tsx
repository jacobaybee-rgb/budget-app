"use client";

import { useBudget } from "@/context/BudgetContext";
import DashboardHeader from "@/components/DashboardHeader";
import SummaryCard from "@/components/SummaryCard";
import CategoryList from "@/components/CategoryList";
import TransactionList from "@/components/TransactionList";
import AppSidebar from "@/components/AppSidebar";

export default function Dashboard() {
  const { categories, transactions } = useBudget();

  const income = 5000;
  const spent = categories.reduce(
    (total, category) => total + category.spent,
    0
  );
  const remaining = income - spent;
  return (
    <main className="flex min-h-screen bg-zinc-950 text-white">
      <AppSidebar />

      <section className="flex-1 px-6 py-10">
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