import { Transaction } from "@/types/transaction";
import Link from "next/link";

type TransactionListProps = {
  transactions: Transaction[];
    limit?: number;
    showViewAll?: boolean;
};

export default function TransactionList({
  transactions,
  limit,
  showViewAll = false,
}: TransactionListProps) {
  const sortedTransactions = [...transactions].sort(
    (transactionA, transactionB) =>
      new Date(transactionB.date).getTime() -
      new Date(transactionA.date).getTime()
  );

  const visibleTransactions =
    typeof limit === "number"
      ? sortedTransactions.slice(0, limit)
      : sortedTransactions;
  return (
    <section className="rounded-2xl border border-orange-500/30 bg-zinc-900 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-widest text-orange-400">
            Recent Activity
          </p>

          <h2 className="mt-1 text-2xl font-bold">
            Transactions
          </h2>
        </div>

        <div className="rounded-full bg-orange-500/20 px-3 py-1 text-sm text-orange-300">
          {transactions.length} Total
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {visibleTransactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between rounded-xl bg-zinc-950 p-4 transition hover:bg-zinc-800"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">💳</span>

              <div>
                <p className="font-semibold">{transaction.name}</p>
                <p className="text-sm text-zinc-500">
                  {transaction.category}
                </p>
              </div>
            </div>

            <p className="font-bold text-orange-400">
              -${transaction.amount.toFixed(2)}
            </p>
          </div>
        ))}
      </div>
      {showViewAll &&
        typeof limit === "number" &&
        transactions.length > limit && (
          <Link
            href="/dashboard/transactions"
            className="mt-6 flex items-center justify-center rounded-xl border border-orange-500/30 bg-orange-500/10 px-4 py-3 text-sm font-semibold text-orange-300 transition hover:bg-orange-500/20"
          >
            View All Transactions →
          </Link>
        )}
    </section>
  );
}