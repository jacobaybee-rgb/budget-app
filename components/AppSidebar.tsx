import Link from "next/link";

export default function AppSidebar() {
  return (
    <aside className="hidden min-h-screen w-64 border-r border-zinc-800 bg-zinc-950 p-6 md:block">
      <Link href="/" className="text-xl font-bold text-emerald-400">
        B.S.B
      </Link>

      <nav className="mt-10 space-y-2">
        <Link
          href="/dashboard"
          className="block rounded-xl px-4 py-3 text-zinc-300 hover:bg-zinc-900 hover:text-white"
        >
          Dashboard
        </Link>

        <Link
          href="/dashboard/categories"
          className="block rounded-xl px-4 py-3 text-zinc-300 hover:bg-zinc-900 hover:text-white"
        >
          Categories
        </Link>

        <Link
          href="/dashboard/transactions"
          className="block rounded-xl px-4 py-3 text-zinc-300 hover:bg-zinc-900 hover:text-white"
        >
          Transactions
        </Link>

        <Link
          href="/dashboard/income"
          className="block rounded-xl px-4 py-3 text-zinc-300 hover:bg-zinc-900 hover:text-white"
        >
          Income
        </Link>
      </nav>
    </aside>
  );
}