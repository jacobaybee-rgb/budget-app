"use client";

export default function CommandCenterHeader() {
  const hour = new Date().getHours();

  let greeting = "Good evening";
  let emoji = "🌅";

  if (hour >= 5 && hour < 12) {
    greeting = "Good morning";
    emoji = "🌅";
  } else if (hour >= 12 && hour < 17) {
    greeting = "Good afternoon";
    emoji = "☀️";
  } else if (hour >= 17 && hour < 21) {
    greeting = "Good evening";
    emoji = "🌇";
  } else {
    greeting = "Good night";
    emoji = "🌙";
  }

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="relative z-10">
      <p className="text-sm uppercase tracking-widest text-blue-300">COMMAND CENTER</p>

      <h1 className="mt-2 text-5xl md:text-6xl font-bold tracking-tight text-white">
        {greeting}, Jacob {emoji}
      </h1>

      <p className="mt-3 text-xl text-zinc-200">{today}</p>
    </div>
  );
}