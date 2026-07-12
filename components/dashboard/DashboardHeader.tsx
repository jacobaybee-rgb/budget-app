import Link from "next/link";

export default function DashboardHeader() {
  return (
    <header className="border-b border-zinc-800 px-6 py-4">
      <Link href="/" className="text-lg font-bold text-emerald-400">
        B.B
      </Link>
    </header>
  );
}