"use client";

import { useBudget } from "@/context/BudgetContext";
import CategoryList from "@/components/CategoryList";
import TransactionList from "@/components/TransactionList";
import AppLayout from "@/components/AppLayout";
import CommandCenterHeader from "@/components/CommandCenterHeader";

export default function Dashboard() {
  const { categories, transactions } = useBudget();

  const income = 5000;
  const spent = transactions.reduce((total, t) => total + Math.abs(t.amount || 0), 0);
  const remaining = income - spent;
  const spentPercent = Math.min(Math.round((spent / income) * 100), 100);

  // Dynamic vibrant background
  const hour = new Date().getHours();
  let bgImage = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070"; // sunset

  if (hour >= 5 && hour < 12) bgImage = "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?q=80&w=2070";
  else if (hour >= 12 && hour < 17) bgImage = "https://images.unsplash.com/photo-1519904985650-2c3c3e2c5c3b?q=80&w=2070";
  else if (hour >= 17 && hour < 21) bgImage = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070";
  else bgImage = "https://images.unsplash.com/photo-1531366936337-7c912a4589a3?q=80&w=2070";

  return (
    <AppLayout>
      {/* Top Background Hero - Mockup Style */}
      <div
        className="relative h-[300px] -mt-10 -mx-8 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(2,6,23,0.15), rgba(2,6,23,0.95)), url(${bgImage})`,
          backgroundPosition: "center 45%",
        }}
      >
        <div className="px-8 pt-12">
          <CommandCenterHeader />
        </div>
      </div>

      {/* Remaining This Month Card */}
      <div className="px-8 -mt-16 relative z-10">
        <div className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
          <section className="rounded-2xl border border-blue-500/40 bg-zinc-950/80 p-8 shadow-2xl backdrop-blur-xl">
            <div className="flex justify-between items-start">
              <div>
                <p className="uppercase text-blue-300 text-sm tracking-widest">
                  REMAINING THIS MONTH
                </p>
                <p className="text-6xl font-bold mt-4">
                  ${remaining.toLocaleString()}
                </p>
                <p className="text-emerald-400 mt-2">
                  You're doing great! 💪
                </p>
              </div>

              <div className="rounded-2xl border border-blue-500/30 bg-blue-950/30 px-6 py-4 text-center">
                <p className="text-2xl font-bold text-cyan-300">{spentPercent}%</p>                <p className="text-xs text-zinc-300">of income spent</p>
              </div>
            </div>

            <div className="h-3 bg-zinc-900 rounded-full mt-6 overflow-hidden">
              <div
                className="h-3 bg-blue-500 rounded-full shadow-[0_0_16px_rgba(59,130,246,0.9)]"
                style={{ width: `${spentPercent}%` }}
              />            
            </div>

            <div className="grid grid-cols-3 gap-6 mt-8 text-center border-t border-zinc-800 pt-6">
              <div>
                <p className="text-green-400 text-2xl font-bold">$5,000.00</p>
                <p className="text-xs text-zinc-400">INCOME</p>
              </div>
              <div>
                <p className="text-orange-400 text-2xl font-bold">${spent.toLocaleString()}</p>
                <p className="text-xs text-zinc-400">SPENT</p>
              </div>
              <div>
                <p className="text-blue-400 text-2xl font-bold">${remaining.toLocaleString()}</p>
                <p className="text-xs text-zinc-400">REMAINING</p>
              </div>
            </div>
          </section>

          <section>
            <p className="uppercase tracking-widest text-zinc-300 text-sm mb-4">
              QUICK ACTIONS
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-blue-950/40 border border-blue-500/30 p-6 backdrop-blur-xl">
                Add Transaction
              </div>
              <div className="rounded-2xl bg-purple-950/40 border border-purple-500/30 p-6 backdrop-blur-xl">
                New Category
              </div>
              <div className="rounded-2xl bg-green-950/40 border border-green-500/30 p-6 backdrop-blur-xl">
                Add Income
              </div>
              <div className="rounded-2xl bg-orange-950/40 border border-orange-500/30 p-6 backdrop-blur-xl">
                Create Goal
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-8 pt-6 space-y-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <CategoryList categories={categories} transactions={transactions} />
          <TransactionList transactions={transactions} />
        </div>
      </div>
    </AppLayout>
  );
}