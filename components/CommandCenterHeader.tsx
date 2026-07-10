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

      <h1 className="text-5xl font-bold text-white">
        {greeting},
        <span className="block 2xl:inline"> Jacob</span>
      </h1>

      <p className="text-zinc-200 mt-3 text-lg drop-shadow">
        {today}
      </p>
    </div>
  );
}