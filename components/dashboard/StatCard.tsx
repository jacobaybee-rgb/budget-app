import type { ReactNode } from "react";

type StatCardColor = "green" | "orange" | "blue" | "yellow";

type StatCardProps = {
  label: string;
  value: number | string;
  helper: string;
  icon: ReactNode;
  color: StatCardColor;
};

const colors: Record<StatCardColor, string> = {
  green:
    "border-green-500/30 bg-green-800/20 hover:bg-green-800/40",
  orange:
    "border-orange-500/30 bg-orange-950/20 hover:bg-orange-700/30",
  blue:
    "border-blue-500/30 bg-blue-950/20 hover:bg-blue-700/30",
  yellow:
    "border-yellow-400/40 bg-yellow-900/20 hover:bg-yellow-700/40",
};

export default function StatCard({
  label,
  value,
  helper,
  icon,
  color,
}: StatCardProps) {
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

      <p className="text-xs uppercase tracking-widest text-zinc-400">
        {label}
      </p>

      <p className="mt-2 text-2xl font-bold text-white">
        {displayValue}
      </p>

      <p className="mt-1 text-xs text-zinc-400">{helper}</p>
    </div>
  );
}