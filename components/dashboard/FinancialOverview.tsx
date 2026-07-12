import {
  CreditCard,
  DollarSign,
  TrendingUp,
  Wallet,
} from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";

type FinancialOverviewProps = {
  income: number;
  spent: number;
  remaining: number;
  transactionCount: number;
};

export default function FinancialOverview({
  income,
  spent,
  remaining,
  transactionCount,
}: FinancialOverviewProps) {
  const savingsRate =
    income > 0
      ? Math.max(Math.round((remaining / income) * 100), 0)
      : 0;

  return (
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
          helper={`${transactionCount} transactions`}
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
          value={`${savingsRate}%`}
          helper="Income unspent"
          icon={<TrendingUp className="h-6 w-6 text-yellow-300" />}
          color="yellow"
        />
      </div>
    </div>
  );
}