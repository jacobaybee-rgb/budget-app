import {
  CreditCard,
  DollarSign,
  FolderPlus,
  Target,
  User,
  Wallet,
} from "lucide-react";
import QuickActionCard from "@/components/dashboard/QuickActionCard";

export default function QuickActions() {
  return (
    <section>
      <p className="mb-4 text-sm uppercase tracking-widest text-zinc-300">
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
  );
}