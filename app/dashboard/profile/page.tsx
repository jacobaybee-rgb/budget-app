"use client";

export default function ProfilePage() {
  return (
    <>
      <div className="px-8 py-8 space-y-8">
        <div>
          <p className="text-sm uppercase tracking-widest text-blue-300">
            Profile
          </p>
          <h1 className="mt-2 text-5xl font-bold">Jacob Bell</h1>
          <p className="mt-2 text-zinc-400">
            Manage your profile, app preferences, and budgeting setup.
          </p>
        </div>

        <section className="rounded-2xl border border-blue-500/30 bg-zinc-950/80 p-8 shadow-xl">
          <div className="flex items-center gap-6">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-500 text-3xl font-bold text-white">
              JB
            </div>

            <div>
              <h2 className="text-3xl font-bold">Jacob Bell</h2>
              <p className="mt-1 text-zinc-400">Premium Account User</p>
            </div>
          </div>
        </section>

        <div className="grid gap-6 md:grid-cols-3">
          <section className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6">
            <p className="text-sm uppercase tracking-widest text-zinc-400">
              App Name
            </p>
            <p className="mt-3 text-2xl font-bold">Bell&apos;s Budgeting</p>
          </section>

          <section className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6">
            <p className="text-sm uppercase tracking-widest text-zinc-400">
              Theme
            </p>
            <p className="mt-3 text-2xl font-bold">Dynamic</p>
          </section>

          <section className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6">
            <p className="text-sm uppercase tracking-widest text-zinc-400">
              Mode
            </p>
            <p className="mt-3 text-2xl font-bold">Command Center</p>
          </section>
        </div>
      </div>
    </>
  );
}