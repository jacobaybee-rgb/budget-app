"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  Banknote,
  Bell,
  CalendarClock,
  CheckCircle2,
  PiggyBank,
  ReceiptText,
  Settings,
  X,
} from "lucide-react";
import type {
  AppNotification,
  NotificationPriority,
  NotificationType,
} from "@/types/notification";

type NotificationCenterProps = {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
};

export default function NotificationCenter({
  isOpen,
  onClose,
  notifications,
}: NotificationCenterProps) {
  const router = useRouter();

  useEffect(() => {
    if (!isOpen) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  function openNotification(notification: AppNotification) {
    if (!notification.href) return;

    onClose();
    router.push(notification.href);
  }

  function openSettings() {
    onClose();
    router.push("/dashboard/profile#notifications");
  }

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[210] flex items-center justify-center bg-black/75 p-3 backdrop-blur-md sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="notification-center-title"
        className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 shadow-2xl"
      >
        <header className="flex items-start justify-between gap-4 border-b border-zinc-800 px-5 py-5 sm:px-7">
          <div className="flex items-center gap-3">
            <span className="rounded-2xl bg-blue-500/15 p-3 text-blue-300">
              <Bell className="h-6 w-6" />
            </span>

            <div>
              <h2
                id="notification-center-title"
                className="text-2xl font-bold text-white"
              >
                Notifications
              </h2>

              <p className="mt-1 text-sm text-zinc-400">
                {notifications.length === 0
                  ? "Your budget is all caught up."
                  : `${notifications.length} active ${
                      notifications.length === 1
                        ? "notification"
                        : "notifications"
                    }`}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close notifications"
            className="rounded-xl p-2 text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
          >
            <X className="h-6 w-6" />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
          {notifications.length === 0 ? (
            <div className="flex min-h-72 flex-col items-center justify-center text-center">
              <span className="rounded-full bg-emerald-500/10 p-5 text-emerald-400">
                <CheckCircle2 className="h-11 w-11" />
              </span>

              <h3 className="mt-5 text-xl font-bold text-white">
                Nothing needs your attention
              </h3>

              <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-500">
                Upcoming bills, income, category warnings, goals,
                and month-closing reminders will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => {
                const Icon = getNotificationIcon(
                  notification.type
                );

                const styles = getPriorityStyles(
                  notification.priority
                );

                return (
                  <button
                    key={notification.id}
                    type="button"
                    onClick={() =>
                      openNotification(notification)
                    }
                    disabled={!notification.href}
                    className={`w-full rounded-2xl border p-4 text-left transition sm:p-5 ${styles.container} ${
                      notification.href
                        ? "cursor-pointer hover:-translate-y-0.5 hover:shadow-lg"
                        : "cursor-default"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <span
                        className={`shrink-0 rounded-xl p-3 ${styles.icon}`}
                      >
                        <Icon className="h-5 w-5" />
                      </span>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <h3 className="font-bold text-white">
                            {notification.title}
                          </h3>

                          <PriorityBadge
                            priority={notification.priority}
                          />
                        </div>

                        <p className="mt-2 text-sm leading-6 text-zinc-400">
                          {notification.message}
                        </p>

                        {notification.eventDate && (
                          <p className="mt-3 text-xs font-medium text-zinc-500">
                            {formatEventDate(
                              notification.eventDate
                            )}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <footer className="border-t border-zinc-800 p-4 sm:px-6">
          <button
            type="button"
            onClick={openSettings}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm font-semibold text-zinc-300 transition hover:border-blue-500/40 hover:bg-zinc-800 hover:text-white"
          >
            <Settings className="h-4 w-4" />
            Customize Notifications
          </button>
        </footer>
      </div>
    </div>
  );
}

function PriorityBadge({
  priority,
}: {
  priority: NotificationPriority;
}) {
  const labels: Record<NotificationPriority, string> = {
    urgent: "Urgent",
    warning: "Warning",
    success: "Upcoming",
    info: "Info",
  };

  const styles: Record<NotificationPriority, string> = {
    urgent: "bg-red-500/15 text-red-300",
    warning: "bg-amber-500/15 text-amber-300",
    success: "bg-emerald-500/15 text-emerald-300",
    info: "bg-blue-500/15 text-blue-300",
  };

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${styles[priority]}`}
    >
      {labels[priority]}
    </span>
  );
}

function getNotificationIcon(type: NotificationType) {
  switch (type) {
    case "bill":
      return ReceiptText;

    case "income":
      return Banknote;

    case "category":
      return AlertTriangle;

    case "goal":
      return PiggyBank;

    case "month":
      return CalendarClock;
  }
}

function getPriorityStyles(
  priority: NotificationPriority
) {
  switch (priority) {
    case "urgent":
      return {
        container:
          "border-red-500/25 bg-red-950/20 hover:border-red-400/40",
        icon: "bg-red-500/15 text-red-300",
      };

    case "warning":
      return {
        container:
          "border-amber-500/25 bg-amber-950/20 hover:border-amber-400/40",
        icon: "bg-amber-500/15 text-amber-300",
      };

    case "success":
      return {
        container:
          "border-emerald-500/25 bg-emerald-950/20 hover:border-emerald-400/40",
        icon: "bg-emerald-500/15 text-emerald-300",
      };

    case "info":
      return {
        container:
          "border-blue-500/25 bg-blue-950/20 hover:border-blue-400/40",
        icon: "bg-blue-500/15 text-blue-300",
      };
  }
}

function formatEventDate(dateKey: string) {
  const [year, month, day] = dateKey
    .split("-")
    .map(Number);

  return new Date(year, month - 1, day).toLocaleDateString(
    "en-US",
    {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );
}