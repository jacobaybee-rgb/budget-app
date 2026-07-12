"use client";

import { getTimeTheme } from "@/lib/timeTheme";

export default function CommandCenterHeader() {
  const { greeting } = getTimeTheme();

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="relative z-20 max-w-4xl">
      <p
        className="text-lg text-white font-bold uppercase tracking-widest drop-shadow"
      >
        Dashboard
      </p>

      <h1 className="mt-2 text-4xl font-bold leading-tight text-white sm:text-5xl">
        {greeting},
        <span className="block 2xl:inline"> Jacob</span>
      </h1>

      <p className="mt-3 text-lg text-white drop-shadow">
        {today}
      </p>
    </div>
  );
}