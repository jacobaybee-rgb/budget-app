import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <section className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-6 text-center">
        <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-blue-400">
          Bell&apos;s Budgeting
        </p>

        <h1 className="mb-6 text-5xl font-bold tracking-tight">
          Simple budgeting that actually makes sense.
        </h1>

        <p className="mb-8 max-w-2xl text-lg text-zinc-300">
          Track your income, add transactions, customize your categories, and
          see exactly how much money you have left for the month.
        </p>

        <Link
          href="/dashboard"
          className="rounded-full bg-blue-400 px-6 py-3 font-semibold text-zinc-950 transition hover:bg-blue-300"
        >
          Start Budgeting Now
        </Link>
      </section>
    </main>
  );
}