import Link from "next/link";

export default function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-800 bg-zinc-950 p-3 md:hidden">
      <div className="flex justify-around text-sm">
        <Link href="/dashboard" className="text-zinc-300">
          Dashboard
        </Link>

        <Link href="/dashboard/categories" className="text-zinc-300">
          Categories
        </Link>

        <Link href="/dashboard/transactions" className="text-zinc-300">
          Transactions
        </Link>
        <Link
          href="/dashboard/income"
          className="text-zinc-300"
        >
          Income
        </Link>
        <Link href="/dashboard/bills" className="text-zinc-300">
          Bills
        </Link>

        <Link href="/dashboard/profile" className="text-zinc-300">
          Profile
        </Link>

      </div>
    </nav>
  );
}