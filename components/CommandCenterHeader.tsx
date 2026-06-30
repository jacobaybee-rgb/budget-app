"use client";

export default function CommandCenterHeader() {
  const hour = new Date().getHours();

  let greeting = "Good evening";
  let emoji = "🌅";
  let background = "from-purple-950 via-orange-900/40 to-zinc-950";

  if (hour >= 5 && hour < 12) {
    greeting = "Good morning";
    emoji = "🌅";
    background = "from-orange-900/50 via-blue-900/40 to-zinc-950";
  } else if (hour >= 12 && hour < 17) {
    greeting = "Good afternoon";
    emoji = "☀️";
    background = "from-blue-900/60 via-sky-900/40 to-zinc-950";
  } else if (hour >= 17 && hour < 21) {
    greeting = "Good evening";
    emoji = "🌇";
    background = "from-purple-950 via-orange-900/40 to-zinc-950";
  } else {
    greeting = "Good night";
    emoji = "🌙";
    background = "from-slate-950 via-indigo-950 to-zinc-950";
  }

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <section
      className={`overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br ${background} p-8 shadow-2xl`}
    >
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-widest text-blue-300">
            Command Center
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight">
            {greeting}, Jacob {emoji}
          </h1>

          <p className="mt-2 text-zinc-300">{today}</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/10 px-5 py-4 text-right backdrop-blur">
          <p className="text-sm text-zinc-300">Financial Status</p>
          <p className="mt-1 text-2xl font-bold text-green-300">On Track</p>
        </div>
      </div>
    </section>
  );
}