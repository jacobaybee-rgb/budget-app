import Link from "next/link";
import Image from "next/image";

export default function AppSidebar() {
  return (
    <aside className="hidden min-h-screen w-64 border-r border-zinc-800 bg-zinc-950 p-6 md:block">
      <div className="flex flex-col items-center border-b border-zinc-800 pb-6">
        <Link href="/dashboard">
          <Image
            src="/logos/bell-logo-v2.png"
            alt="Bell's Budgeting logo"
            width={140}
            height={140}
            priority
            className="transition duration-300 hover:scale-105 drop-shadow-[0_0_15px_rgba(250,204,21,0.35)]"        
          />
        </Link>

        <h1 className="mt-0.1 text-3xl font-bold leading-tight text-center">
          Bell's
          <br />
          Budgeting
        </h1>

        <p className="mt-2 text-xs font-semibold uppercase tracking-[0.25em] text-sky-400">
          Dashboard
        </p>
      </div>

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