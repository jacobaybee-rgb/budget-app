"use client";

import { useBudget } from "@/context/BudgetContext";
import CategoryList from "@/components/CategoryList";
import TransactionList from "@/components/TransactionList";
import AppLayout from "@/components/AppLayout";

export default function Dashboard() {
  const { categories, transactions } = useBudget();

  const income = 5000;

  const spent = transactions.reduce(
    (total, transaction) => total + transaction.amount,
    0
  );

  const remaining = income - spent;
  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        <div>
          <p className="text-sm uppercase tracking-widest text-blue-400">
            Command Center
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight">
            Good evening, Jacob 👋
          </h1>
          <p className="mt-2 text-zinc-400">
            Here&apos;s where your money stands this month.
          </p>
        </div>
        
        <section className="rounded-3xl border border-blue-500/40 bg-gradient-to-br from-blue-950 via-zinc-950 to-blue-900/40 p-8 shadow-2xl shadow-blue-950/40">
          <div className="text-center">
            <p className="text-sm uppercase tracking-widest text-blue-300">
              Remaining This Month
            </p>

            <p className="mt-4 text-6xl font-bold">
              ${remaining.toLocaleString()}
            </p>

            <p className="mt-3 text-zinc-300">
              You&apos;re doing great 💪
            </p>
          </div>

          <div className="mx-auto mt-6 h-3 max-w-2xl rounded-full bg-zinc-800">
            <div
              className="h-3 rounded-full bg-blue-400 transition-all duration-700"
              style={{ width: `${Math.min((spent / income) * 100, 100)}%` }}
            />
          </div>

          <div className="mt-8 grid gap-6 border-t border-blue-500/20 pt-6 text-center md:grid-cols-3">
            <div>
              <p className="text-2xl font-bold text-green-400">
                ${income.toLocaleString()}
              </p>
              <p className="text-xs uppercase tracking-widest text-zinc-400">
                Income
              </p>
            </div>

            <div>
              <p className="text-2xl font-bold text-orange-400">
                ${spent.toLocaleString()}
              </p>
              <p className="text-xs uppercase tracking-widest text-zinc-400">
                Spent
              </p>
            </div>

            <div>
              <p className="text-2xl font-bold text-blue-400">
                ${remaining.toLocaleString()}
              </p>
              <p className="text-xs uppercase tracking-widest text-zinc-400">
                Remaining
              </p>
            </div>
          </div>
        </section>

        <div>
          <p className="text-sm uppercase tracking-widest text-zinc-400">
            Quick Actions
          </p>

          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <a
              href="/dashboard/transactions"
              className="rounded-2xl border border-blue-500/40 bg-blue-950/40 p-6 transition hover:-translate-y-1 hover:bg-blue-900/50"
            >
              <p className="text-3xl">💳</p>
              <h3 className="mt-4 text-xl font-bold">Add Transaction</h3>
              <p className="mt-1 text-sm text-zinc-400">Record a purchase</p>
            </a>

            <a
              href="/dashboard/categories"
              className="rounded-2xl border border-purple-500/40 bg-purple-950/40 p-6 transition hover:-translate-y-1 hover:bg-purple-900/50"
            >
              <p className="text-3xl">📂</p>
              <h3 className="mt-4 text-xl font-bold">New Category</h3>
              <p className="mt-1 text-sm text-zinc-400">Create a budget category</p>
            </a>

            <a
              href="#"
              className="rounded-2xl border border-green-500/40 bg-green-950/40 p-6 transition hover:-translate-y-1 hover:bg-green-900/50"
            >
              <p className="text-3xl">💵</p>
              <h3 className="mt-4 text-xl font-bold">Add Income</h3>
              <p className="mt-1 text-sm text-zinc-400">Coming soon</p>
            </a>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <CategoryList categories={categories} transactions={transactions} />
          <TransactionList transactions={transactions} />
        </div>
      </div>
    </AppLayout>
  );
}