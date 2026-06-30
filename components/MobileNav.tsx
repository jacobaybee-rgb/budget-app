import Link from "next/link";

export default function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-zinc-800 bg-zinc-950 p-3 md:hidden">
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
      </div>
    </nav>
  );
}