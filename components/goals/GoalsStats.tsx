import type { Goal } from "@/types/goal";

type GoalsStatsProps = {
  goals: Goal[];
};

export default function GoalsStats({ goals }: GoalsStatsProps) {
  const totalTarget = goals.reduce(
    (total, goal) => total + goal.targetAmount,
    0
  );

  const totalSaved = goals.reduce(
    (total, goal) => total + goal.currentAmount,
    0
  );

  const overallProgress =
    totalTarget > 0
      ? Math.min((totalSaved / totalTarget) * 100, 100)
      : 0;

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <section className="rounded-2xl border border-yellow-400/80 bg-zinc-950/80 p-6 shadow-xl">
        <p className="text-sm uppercase tracking-widest text-zinc-400">
          Total Goal Amount
        </p>

        <p className="mt-3 text-4xl font-bold text-yellow-400">
          {totalTarget.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
        </p>
      </section>

      <section className="rounded-2xl border border-green-500/30 bg-zinc-950/80 p-6 shadow-xl">
        <p className="text-sm uppercase tracking-widest text-zinc-400">
          Total Saved
        </p>

        <p className="mt-3 text-4xl font-bold text-green-400">
          {totalSaved.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
        </p>
      </section>

      <section className="rounded-2xl border border-blue-500/30 bg-zinc-950/80 p-6 shadow-xl">
        <p className="text-sm uppercase tracking-widest text-zinc-400">
          Overall Progress
        </p>

        <p className="mt-3 text-4xl font-bold text-blue-400">
          {overallProgress.toFixed(0)}%
        </p>
      </section>
    </div>
  );
}