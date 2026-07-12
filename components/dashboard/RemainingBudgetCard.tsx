type RemainingBudgetCardProps = {
  income: number;
  spent: number;
  remaining: number;
  spentPercent: number;
  budgetMessage: string;
};

export default function RemainingBudgetCard({
  income,
  spent,
  remaining,
  spentPercent,
  budgetMessage,
}: RemainingBudgetCardProps) {
  const messageColor =
    spentPercent < 50
      ? "text-emerald-400"
      : spentPercent < 75
      ? "text-blue-400"
      : spentPercent < 90
      ? "text-yellow-400"
      : "text-red-400";

  return (
    <section className="rounded-2xl border border-blue-500/40 bg-zinc-950/80 p-5 shadow-2xl backdrop-blur-xl sm:p-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-widest text-blue-300">
            Remaining This Month
          </p>

          <p className="mt-4 text-4xl font-bold sm:text-5xl lg:text-6xl">
            $
            {remaining.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>

          <p className={`mt-2 ${messageColor}`}>{budgetMessage}</p>
        </div>

        <div className="w-fit rounded-2xl border border-blue-500/30 bg-blue-950/30 px-6 py-4 text-center sm:shrink-0">
          <p className="text-2xl font-bold text-cyan-300">
            {spentPercent}%
          </p>

          <p className="text-xs text-zinc-300">of income spent</p>
        </div>
      </div>

      <div className="mt-6 h-3 overflow-hidden rounded-full bg-zinc-900">
        <div
          className="h-3 rounded-full bg-blue-500 shadow-[0_0_16px_rgba(59,130,246,0.9)]"
          style={{ width: `${spentPercent}%` }}
        />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 border-t border-zinc-800 pt-6 text-center sm:grid-cols-3 sm:gap-6">
        <div>
          <p className="text-2xl font-bold text-green-400">
            $
            {income.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>

          <p className="text-xs text-zinc-400">Income</p>
        </div>

        <div>
          <p className="text-2xl font-bold text-red-400">
            $
            {spent.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>

          <p className="text-xs text-zinc-400">Spent</p>
        </div>

        <div>
          <p className="text-2xl font-bold text-blue-400">
            $
            {remaining.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>

          <p className="text-xs text-zinc-400">Remaining</p>
        </div>
      </div>
    </section>
  );
}