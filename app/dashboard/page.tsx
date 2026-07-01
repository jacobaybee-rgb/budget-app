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

  const hour = new Date().getHours();
  let bgImage = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070"; // sunset mountains

  return (
    <AppLayout>
      {/* Mockup-style Top Section */}
      <div
        className="relative -mt-10 h-[520px] bg-cover bg-center flex items-end"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(0,0,0,0.75)), url(${bgImage})`,
          backgroundPosition: "center 25%",
        }}
      >
        <div className="px-8 pb-10 w-full">
          <CommandCenterHeader />
        </div>
      </div>

      {/* Remaining This Month - positioned like mockup */}
      <div className="px-8 -mt-24 relative z-10">
        <section className="rounded-3xl bg-gradient-to-br from-blue-950/90 to-zinc-950 border border-blue-500/40 p-8 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <div>
              <p className="text-blue-300 text-sm uppercase tracking-widest">REMAINING THIS MONTH</p>
              <p className="text-6xl font-bold mt-3">${remaining.toLocaleString()}</p>
              <p className="text-emerald-400 mt-2">You're doing great 💪</p>
            </div>

            <div className="text-right">
              <div className="text-sm text-zinc-400">42% of income spent</div>
              <div className="h-2.5 w-80 bg-zinc-800 rounded-full mt-3 overflow-hidden">
                <div className="h-2.5 w-[42%] bg-blue-500 rounded-full" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-8 mt-10">
            <div>
              <p className="text-green-400 text-3xl font-bold">$5,000.00</p>
              <p className="text-xs text-zinc-400">INCOME</p>
            </div>
            <div>
              <p className="text-orange-400 text-3xl font-bold">$2,856.52</p>
              <p className="text-xs text-zinc-400">SPENT</p>
            </div>
            <div>
              <p className="text-blue-400 text-3xl font-bold">${remaining.toLocaleString()}</p>
              <p className="text-xs text-zinc-400">REMAINING</p>
            </div>
          </div>
        </section>
      </div>

      {/* Quick Actions + Rest of content */}
      <div className="px-8 pt-12">
        {/* Quick Actions */}
        <div>
          <p className="text-sm uppercase tracking-widest text-zinc-400 mb-4">QUICK ACTIONS</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Add your quick action cards here later */}
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 mt-12">
          <CategoryList categories={categories} transactions={transactions} />
          <TransactionList transactions={transactions} />
        </div>
      </div>
    </AppLayout>
  );
}