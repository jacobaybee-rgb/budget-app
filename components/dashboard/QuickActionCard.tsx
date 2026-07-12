import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

type QuickActionColor =
  | "orange"
  | "purple"
  | "green"
  | "yellow"
  | "red"
  | "blue";

type QuickActionCardProps = {
  href: string;
  title: string;
  description: string;
  icon: ReactNode;
  color: QuickActionColor;
};

const colors: Record<QuickActionColor, string> = {
  orange:
    "border-orange-500/40 bg-orange-950/40 hover:bg-orange-900/50",
  purple:
    "border-purple-500/40 bg-purple-950/40 hover:bg-purple-900/50",
  green:
    "border-green-500/40 bg-green-950/40 hover:bg-green-900/50",
  yellow:
    "border-yellow-400/40 bg-yellow-900/20 hover:bg-yellow-900/50",
  red:
    "border-red-500/50 bg-red-700/10 hover:bg-red-950/50",
  blue:
    "border-blue-500/50 bg-blue-950/20 hover:bg-blue-700/20",
};

export default function QuickActionCard({
  href,
  title,
  description,
  icon,
  color,
}: QuickActionCardProps) {
  return (
    <Link
      href={href}
      className={`group rounded-2xl border p-4 backdrop-blur-xl transition ${colors[color]}`}
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="rounded-xl bg-white/5 p-2">{icon}</div>

        <ArrowRight className="h-4 w-4 text-white/50 transition group-hover:translate-x-1" />
      </div>

      <h3 className="text-base font-bold text-white">{title}</h3>

      <p className="mt-1 text-sm text-zinc-300">{description}</p>
    </Link>
  );
}