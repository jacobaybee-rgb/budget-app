import { Transaction } from "@/types/transaction";

type TransactionListProps = {
  transactions: Transaction[];
};

export default function TransactionList({
  transactions,
}: TransactionListProps) {
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
        {transactions.map((transaction) => (
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
    </section>
  );
}