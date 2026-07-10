"use client";

import { useBudget } from "@/context/BudgetContext";
import CategoryList from "@/components/CategoryList";
import TransactionList from "@/components/TransactionList";
import AppLayout from "@/components/AppLayout";
import CommandCenterHeader from "@/components/CommandCenterHeader";
import { getTimeTheme } from "@/lib/timeTheme";
import Link from "next/link";
import {
  Bell,
  CalendarDays,
  CreditCard,
  FolderPlus,
  DollarSign,
  Target,
  ArrowRight,
  Wallet,
  TrendingUp,
  User,
} from "lucide-react";
import type { ReactNode } from "react";

export default function Dashboard() {
  const { categories, transactions, incomeSources } = useBudget();
  const notificationCount = 0;
  const today = new Date();

  const currentMonthYear = today.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const income = incomeSources.reduce(
    (total, incomeSource) => total + incomeSource.amount,
    0
  );
  const spent = transactions.reduce(
    (total, transaction) =>
      transaction.amount < 0 ? total + Math.abs(transaction.amount) : total,
    0
  );
  const remaining = income - spent;
  const spentPercent =
  income > 0
    ? Math.min(Math.round((spent / income) * 100), 100)
    : 0;

  const budgetMessage =
    income === 0
      ? "Add your income to unlock your monthly budget insight."
      : spentPercent < 50
      ? "Excellent pace. You're well ahead of budget."
      : spentPercent < 75
      ? "You're on track. Keep an eye on everyday spending."
      : spentPercent < 90
      ? "Budget is getting tight. Slow down on non-essential purchases."
      : spentPercent < 100
      ? "Careful — you're close to using your full monthly income."
      : "You've spent more than your income. Time to re-evaluate spending.";

  const financialStatus =
    income === 0
      ? {
          title: "No Income",
          message: "Add income to begin tracking your financial status.",
          textColor: "text-zinc-300",
          dotColor: "bg-zinc-400",
        }
      : spentPercent < 50
      ? {
          title: "Excellent",
          message: "You’re keeping your spending well under control.",
          textColor: "text-green-400",
          dotColor: "bg-green-400",
        }
      : spentPercent < 75
      ? {
          title: "On Track",
          message: "Your spending is still within a healthy range.",
          textColor: "text-blue-400",
          dotColor: "bg-blue-400",
        }
      : spentPercent < 90
      ? {
          title: "Watch Spending",
          message: "Your available budget is starting to get tight.",
          textColor: "text-yellow-400",
          dotColor: "bg-yellow-400",
        }
      : spentPercent < 100
      ? {
          title: "Near Limit",
          message: "You’re close to spending your full monthly income.",
          textColor: "text-orange-400",
          dotColor: "bg-orange-400",
        }
      : {
          title: "Over Budget",
          message: "Your spending has exceeded your monthly income.",
          textColor: "text-red-400",
          dotColor: "bg-red-400",
        };

  // Dynamic vibrant background
  const { bgImage, heroOverlay } = getTimeTheme();

  return (
    <AppLayout>
      {/* Top Background Hero - Mockup Style */}
      <div
        className="relative min-h-[500px] -mt-10 -mx-6 bg-cover bg-center 2xl:min-h-0 2xl:h-[325px]"
        style={{
          backgroundImage: `${heroOverlay}, url(${bgImage})`,
          backgroundPosition: "center 8%",
        }}
      >
        <div className="relative px-6 pt-20 sm:px-8 sm:pt-12">
          <CommandCenterHeader />

          <div className="absolute top-2 right-8 flex items-start gap-4">
            <button
              type="button"
              onClick={() => alert("Calendar coming soon!")}
              className="rounded-xl border border-white/10 bg-black/40 px-5 py-3 text-sm font-semibold text-white shadow-lg backdrop-blur transition hover:bg-white/10"
            >
              <div className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-blue-300" />
                <span>{currentMonthYear}</span>
            </div>
            </button>

            <button
              type="button"
              onClick={() => alert("Notifications coming soon!")}
              className="relative rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white shadow-lg backdrop-blur transition hover:bg-white/10"
            >
              <Bell className="h-5 w-5" />

              {notificationCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold">
                  {notificationCount}
                </span>
              )}
            </button>
          </div>

          <div className="mt-6 w-full max-w-sm rounded-2xl border border-white/10 bg-black/45 p-6 shadow-xl backdrop-blur 2xl:absolute 2xl:top-18 2xl:right-8 2xl:mt-0 2xl:w-64">
            <p className="text-sm font-semibold text-zinc-300">
              Financial Status
            </p>

            <div className="mt-3 flex items-center gap-2">
              <h3
                className={`text-3xl font-bold ${financialStatus.textColor}`}
              >
                {financialStatus.title}
              </h3>

              <span
                className={`h-3 w-3 shrink-0 rounded-full ${financialStatus.dotColor}`}
              />
            </div>

            <p className="mt-3 text-sm text-zinc-200">
              {financialStatus.message}
            </p>
          </div>
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
                  ${remaining.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
                <p
                  className={`mt-2 ${
                    spentPercent < 50
                      ? "text-emerald-400"
                      : spentPercent < 75
                      ? "text-blue-400"
                      : spentPercent < 90
                      ? "text-yellow-400"
                      : "text-red-400"
                  }`}
                >
                  {budgetMessage}
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
                <p className="text-green-400 text-2xl font-bold">
                  ${income.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
                <p className="text-xs text-zinc-400">INCOME</p>
              </div>

              <div>
                <p className="text-red-400 text-2xl font-bold">
                  ${spent.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
                <p className="text-xs text-zinc-400">SPENT</p>
              </div>

              <div>
                <p className="text-blue-400 text-2xl font-bold">
                  ${remaining.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
                <p className="text-xs text-zinc-400">REMAINING</p>
              </div>
            </div>
          </section>

          <section>
            <p className="uppercase tracking-widest text-zinc-300 text-sm mb-4">
              QUICK ACTIONS
            </p>

            <div className="grid grid-cols-3 gap-3">
              <QuickActionCard
                href="/dashboard/transactions"
                title="Add Transaction"
                description="Record a new purchase"
                icon={<CreditCard className="h-6 w-6 text-orange-400" />}
                color="orange"
              />

              <QuickActionCard
                href="/dashboard/categories"
                title="New Category"
                description="Create a budget category"
                icon={<FolderPlus className="h-6 w-6 text-purple-400" />}
                color="purple"
              />

              <QuickActionCard
                href="/dashboard/income"
                title="Add Income"
                description="Record income received"
                icon={<DollarSign className="h-6 w-6 text-green-400" />}
                color="green"
              />

              <QuickActionCard
                href="/dashboard/goals"
                title="Create Goal"
                description="Set a savings goal"
                icon={<Target className="h-6 w-6 text-yellow-300" />}
                color="yellow"
              />

              <QuickActionCard
                href="/dashboard/bills"
                title="Bills"
                description="Manage bills"
                icon={<Wallet className="h-6 w-6 text-red-400" />}
                color="red"
              />

              <QuickActionCard
                href="/dashboard/profile"
                title="Profile"
                description="Account settings"
                icon={<User className="h-6 w-6 text-blue-400" />}
                color="blue"
              />
            </div>
          </section>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="px-8 pt-6">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatCard
            label="Income"
            value={income}
            helper="Money coming in"
            icon={<DollarSign className="h-6 w-6 text-green-400" />}
            color="green"
          />

          <StatCard
            label="Expenses"
            value={spent}
            helper={`${transactions.length} transactions`}
            icon={<CreditCard className="h-6 w-6 text-orange-400" />}
            color="orange"
          />

          <StatCard
            label="Remaining"
            value={remaining}
            helper="Available balance"
            icon={<Wallet className="h-6 w-6 text-blue-400" />}
            color="blue"
          />

          <StatCard
            label="Savings Rate"
            value={`${
              income > 0 ? Math.max(Math.round((remaining / income) * 100), 0) : 0
            }%`}
            helper="Income unspent"
            icon={<TrendingUp className="h-6 w-6 text-yellow-300" />}
            color="yellow"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="px-8 pt-6 space-y-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <CategoryList
            categories={categories}
            transactions={transactions}
            limit={5}
            showViewAll
          />

          <TransactionList
            transactions={transactions}
            limit={5}
            showViewAll
          />
        </div>
      </div>
    </AppLayout>
  );
}

function QuickActionCard({
  href,
  title,
  description,
  icon,
  color,
}: {
  href: string;
  title: string;
  description: string;
  icon: ReactNode;
  color: "orange" | "purple" | "green" | "yellow" | "red" | "blue";
}) {
  const colors = {
    orange: "border-orange-500/40 bg-orange-950/40 hover:bg-orange-900/50",
    purple: "border-purple-500/40 bg-purple-950/40 hover:bg-purple-900/50",
    green: "border-green-500/40 bg-green-950/40 hover:bg-green-900/50",
    yellow: "border-yellow-400/40 bg-yellow-900/20 hover:bg-yellow-900/50",
    red: "border-red-500/50 bg-red-700/10 hover:bg-red-950/50",
    blue: "border-blue-500/50 bg-blue-950/20 hover:bg-blue-700/20",
  };

  return (
    <Link
      href={href}
      className={`group rounded-2xl border p-4 backdrop-blur-xl transition ${colors[color]}`}
    >
      <div className="mb-3 flex items-center justify-between">
          <div className="rounded-xl bg-white/5 p-2">
              {icon}
          </div>

          <ArrowRight className="h-4 w-4 text-white/50 transition group-hover:translate-x-1" />
      </div>

      <h3 className="text-base font-bold text-white">{title}</h3>

      <p className="mt-1 text-sm text-zinc-300">{description}</p>
    </Link>
  );
}
function StatCard({
  label,
  value,
  helper,
  icon,
  color,
}: {
  label: string;
  value: number | string;
  helper: string;
  icon: ReactNode;
  color: "green" | "orange" | "blue" | "yellow";
}) {
  const colors = {
    green: "border-green-500/30 bg-green-800/20 hover:bg-green-800/40",
    orange: "border-orange-500/30 bg-orange-950/20 hover:bg-orange-700/30",
    blue: "border-blue-500/30 bg-blue-950/20 hover:bg-blue-700/30",
    yellow: "border-yellow-400/40 bg-yellow-900/20 hover:bg-yellow-700/40",
  };

  const displayValue =
    typeof value === "number"
      ? `$${value.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`
      : value;

  return (
    <div
      className={`rounded-2xl border p-4 transition hover:-translate-y-1 ${colors[color]}`}
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="rounded-xl bg-white/5 p-2">{icon}</div>
      </div>

      <p className="text-xs uppercase tracking-widest text-zinc-400">{label}</p>

      <p className="mt-2 text-2xl font-bold text-white">{displayValue}</p>

      <p className="mt-1 text-xs text-zinc-400">{helper}</p>
    </div>
  );
}