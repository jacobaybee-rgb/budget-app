import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <section className="mx-auto flex min-h-screen max-w-5xl flex-col px-6">
        <header className="flex items-center justify-between py-6">
          <Link
            href="/"
            className="text-lg font-bold tracking-wide text-blue-400"
          >
            Bell&apos;s Budgeting
          </Link>

          <nav className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-full border border-zinc-700 px-5 py-2 text-sm font-semibold text-zinc-200 transition hover:border-blue-400 hover:text-blue-400"
            >
              Log In
            </Link>

            <Link
              href="/signup"
              className="rounded-full bg-blue-400 px-5 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-blue-300"
            >
              Create Account
            </Link>
          </nav>
        </header>

        <section className="flex flex-1 flex-col items-center justify-center pb-24 text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-blue-400">
            Take control of your money
          </p>

          <h1 className="max-w-4xl text-5xl font-bold tracking-tight sm:text-6xl">
            Simple budgeting that actually makes sense.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
            Track your income, manage bills, organize spending, build savings
            goals, and see exactly how much money you have left each month.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/signup"
              className="rounded-full bg-blue-400 px-8 py-3 font-semibold text-zinc-950 transition hover:bg-blue-300"
            >
              Start Budgeting
            </Link>

            <Link
              href="/login"
              className="rounded-full border border-zinc-700 px-8 py-3 font-semibold text-white transition hover:border-blue-400 hover:text-blue-400"
            >
              I Already Have an Account
            </Link>
          </div>

          <div className="mt-16 grid w-full max-w-4xl gap-4 text-left sm:grid-cols-3">
            <article className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
              <p className="text-xl font-bold text-blue-400">
                Track everything
              </p>

              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Keep income, transactions, bills, categories, and goals
                organized in one place.
              </p>
            </article>

            <article className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
              <p className="text-xl font-bold text-blue-400">
                Know what remains
              </p>

              <p className="mt-2 text-sm leading-6 text-zinc-400">
                See how much money is still available without digging through
                complicated reports.
              </p>
            </article>

            <article className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
              <p className="text-xl font-bold text-blue-400">
                Access it anywhere
              </p>

              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Your account keeps your budget available across your phone,
                computer, and other devices.
              </p>
            </article>
          </div>
        </section>
      </section>
    </main>
  );
}