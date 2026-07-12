import type { Transaction } from "@/types/transaction";

type TransactionHistoryProps = {
  transactions: Transaction[];
  onEdit: (transactionId: string) => void;
  onDelete: (transactionId: string) => void;
};

export default function TransactionHistory({
  transactions,
  onEdit,
  onDelete,
}: TransactionHistoryProps) {
  return (
    <section className="rounded-2xl border border-orange-300 bg-zinc-950/80 p-6 shadow-xl">
      <p className="mb-4 text-sm uppercase tracking-widest text-orange-300">
        Recent Transactions
      </p>

      <div className="space-y-4">
        {transactions.length === 0 ? (
          <p className="text-zinc-500">No transactions yet.</p>
        ) : (
          transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5"
            >
              <div>
                <p className="font-bold">{transaction.name}</p>
                <p className="text-zinc-400">{transaction.category}</p>
              </div>

              <div className="text-right">
                <p className="font-bold text-red-400">
                  -$
                  {Math.abs(transaction.amount).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>

                <div className="mt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => onEdit(transaction.id)}
                    className="text-sm text-blue-400 hover:text-blue-300"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => onDelete(transaction.id)}
                    className="text-sm text-red-400 hover:text-red-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}