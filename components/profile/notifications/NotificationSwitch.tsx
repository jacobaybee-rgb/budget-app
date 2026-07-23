"use client";

import { Check } from "lucide-react";

type NotificationSwitchProps = {
  checked: boolean;
  disabled?: boolean;
  label: string;
  onChange: (checked: boolean) => void;
};

export default function NotificationSwitch({
  checked,
  disabled = false,
  label,
  onChange,
}: NotificationSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative h-7 w-12 shrink-0 rounded-full transition ${
        checked ? "bg-blue-400" : "bg-zinc-700"
      } disabled:cursor-not-allowed disabled:opacity-40`}
    >
      <span
        className={`absolute top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-blue-500 shadow transition ${
          checked ? "left-6" : "left-1"
        }`}
      >
        {checked && <Check size={13} />}
      </span>
    </button>
  );
}