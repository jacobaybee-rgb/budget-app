"use client";

import { useState } from "react";
import { Bell, CalendarDays } from "lucide-react";
import CommandCenterHeader from "@/components/dashboard/CommandCenterHeader";
import FinancialCalendar from "@/components/dashboard/FinancialCalendar";
import NotificationCenter from "@/components/dashboard/NotificationCenter";
import MonthSelector from "@/components/budget/MonthSelector";
import { getTimeTheme } from "@/lib/timeTheme";
import type { FinancialStatus } from "@/lib/dashboard";
import type { AppNotification } from "@/types/notification";

type DashboardHeroProps = {
  financialStatus: FinancialStatus;
  notifications: AppNotification[];
};

export default function DashboardHero({
  financialStatus,
  notifications,
}: DashboardHeroProps) {
  const [isCalendarOpen, setIsCalendarOpen] =
    useState(false);

  const [isNotificationCenterOpen, setIsNotificationCenterOpen] =
    useState(false);

  const currentMonthYear = new Date().toLocaleDateString(
    "en-US",
    {
      month: "long",
      year: "numeric",
    }
  );

  const { bgImage, heroOverlay } = getTimeTheme();

  return (
    <>
      <section
        className="relative -mx-6 min-h-[560px] overflow-hidden bg-cover bg-center md:-mt-6 md:min-h-[620px] 2xl:min-h-[680px]"
        style={{
          backgroundImage: `${heroOverlay}, url(${bgImage})`,
          backgroundPosition: "center center",
        }}
      >
        <div className="relative min-h-[560px] px-8 pb-44 pt-24 sm:px-14 md:min-h-[620px] md:pb-52 md:pt-16 2xl:min-h-[680px]">
          <div className="relative z-30 mb-8 flex justify-end gap-2 pl-12 md:absolute md:right-8 md:top-12 md:mb-0 md:pl-0">
            <button
              type="button"
              onClick={() => setIsCalendarOpen(true)}
              className="rounded-xl border border-white/15 bg-black/45 px-3 py-3 text-sm font-semibold text-white shadow-lg backdrop-blur-md transition hover:border-blue-300/40 hover:bg-black/60 sm:px-5"
            >
              <span className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-blue-300" />

                <span className="hidden sm:inline">
                  {currentMonthYear}
                </span>
              </span>
            </button>

            <button
              type="button"
              onClick={() =>
                setIsNotificationCenterOpen(true)
              }
              aria-label={`Open notifications. ${notifications.length} active.`}
              className="relative rounded-xl border border-white/15 bg-black/45 px-4 py-3 text-white shadow-lg backdrop-blur-md transition hover:border-blue-300/40 hover:bg-black/60"
            >
              <Bell className="h-5 w-5" />

              {notifications.length > 0 && (
                <span className="absolute -right-2 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-bold text-white">
                  {notifications.length > 99
                    ? "99+"
                    : notifications.length}
                </span>
              )}
            </button>
          </div>

          <CommandCenterHeader />

          <div className="mt-8">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-white/70">
              Budget Month
            </p>

            <MonthSelector />
          </div>

          <div className="relative z-20 mt-8 w-full max-w-sm rounded-2xl border border-white/15 bg-black/50 p-6 shadow-xl backdrop-blur-md 2xl:absolute 2xl:right-8 2xl:top-24 2xl:mt-0 2xl:w-80">
            <p className="text-sm font-semibold text-zinc-300">
              Financial Status
            </p>

            <div className="mt-3 flex items-center gap-2">
              <h3
                className={`text-3xl font-bold ${financialStatus.textColor}`}
              >
                {financialStatus.title}
              </h3>

              <span
                className={`h-3 w-3 shrink-0 rounded-full ${financialStatus.dotColor}`}
              />
            </div>

            <p className="mt-3 text-sm text-zinc-200">
              {financialStatus.message}
            </p>
          </div>
        </div>
      </section>

      <FinancialCalendar
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
      />

      <NotificationCenter
        isOpen={isNotificationCenterOpen}
        onClose={() =>
          setIsNotificationCenterOpen(false)
        }
        notifications={notifications}
      />
    </>
  );
}