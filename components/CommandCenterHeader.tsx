"use client";

import { getTimeTheme } from "@/lib/timeTheme";

export default function CommandCenterHeader() {
  const { greeting, accentText } = getTimeTheme();

  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  return (
    <div className="relative z-20 max-w-4xl">
      <p className={'text-sm uppercase tracking-widest ${accentText} font-semibold'}>
        Dashboard
      </p>

      <h1 className="mt-2 text-5xl md:text-6xl font-bold tracking-tight text-white drop-shadow-lg">
        {greeting}, Jacob
      </h1>

      <p className="text-zinc-200 mt-3 text-lg drop-shadow">
        {today}
      </p>
    </div>
  );
}