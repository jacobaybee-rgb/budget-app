"use client";

export default function CommandCenterHeader() {
  const hour = new Date().getHours();
  let greeting = "Good evening";
  let emoji = "🌅";

  if (hour >= 5 && hour < 12) { greeting = "Good morning"; emoji = "🌅"; }
  else if (hour >= 12 && hour < 17) { greeting = "Good afternoon"; emoji = "☀️"; }
  else if (hour >= 17 && hour < 21) { greeting = "Good evening"; emoji = "🌇"; }
  else { greeting = "Good night"; emoji = "🌙"; }

  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  return (
    <div className="relative z-20 max-w-4xl">
      <p className="text-sm uppercase tracking-[0.25em] text-blue-300 font-semibold">
        COMMAND CENTER
      </p>

      <h1 className="mt-2 text-5xl md:text-6xl font-bold tracking-tight text-white drop-shadow-lg">
        {greeting}, Jacob {emoji}
      </h1>

      <p className="text-zinc-200 mt-3 text-lg drop-shadow">
        {today}
      </p>
    </div>
  );
}