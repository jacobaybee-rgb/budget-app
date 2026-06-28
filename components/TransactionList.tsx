type Transaction = {
  name: string;
  category: string;
  amount: number;
};

type TransactionListProps = {
  transactions: Transaction[];
};

export default function TransactionList({
  transactions,
}: TransactionListProps) {
  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
      <h2 className="text-2xl font-bold">Recent Transactions</h2>

      <div className="mt-6 space-y-4">
        {transactions.map((transaction) => (
          <div
            key={transaction.name}
            className="flex items-center justify-between rounded-xl bg-zinc-950 p-4"
          >
            <div>
              <p className="font-medium">{transaction.name}</p>
              <p className="text-sm text-zinc-500">{transaction.category}</p>
            </div>

            <p className="font-bold">-${transaction.amount}</p>
          </div>
        ))}
      </div>

      <button className="mt-6 w-full rounded-full bg-emerald-400 px-5 py-3 font-semibold text-zinc-950">
        + Add Transaction
      </button>
    </section>
  );
}