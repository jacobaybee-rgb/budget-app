"use client";

import type { ElementType, ReactNode } from "react";
import NotificationSwitch from "./NotificationSwitch";

type NotificationCardProps = {
  icon: ElementType;
  iconClassName: string;
  title: string;
  description: string;
  enabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
  children?: ReactNode;
};

export default function NotificationCard({
  icon: Icon,
  iconClassName,
  title,
  description,
  enabled,
  onEnabledChange,
  children,
}: NotificationCardProps) {
  return (
    <article
      className={`rounded-2xl border p-5 transition ${
        enabled
          ? "border-zinc-700 bg-zinc-900/70"
          : "border-zinc-800 bg-zinc-950/40 opacity-70"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <div
            className={`shrink-0 rounded-xl p-3 ${iconClassName}`}
          >
            <Icon size={20} />
          </div>

          <div>
            <h3 className="font-bold text-white">
              {title}
            </h3>

            <p className="mt-1 text-sm leading-6 text-zinc-400">
              {description}
            </p>
          </div>
        </div>

        <NotificationSwitch
          checked={enabled}
          label={`Toggle ${title}`}
          onChange={onEnabledChange}
        />
      </div>

      {children && (
        <div
          className={`mt-5 space-y-5 border-t border-zinc-800 pt-5 ${
            enabled
              ? ""
              : "pointer-events-none opacity-50"
          }`}
        >
          {children}
        </div>
      )}
    </article>
  );
}