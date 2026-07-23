"use client";

import NotificationSwitch from "./NotificationSwitch";

type ToggleRowProps = {
  label: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
};

export default function ToggleRow({
  label,
  description,
  checked,
  disabled = false,
  onChange,
}: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-semibold text-zinc-200">
          {label}
        </p>

        <p className="mt-1 text-xs leading-5 text-zinc-500">
          {description}
        </p>
      </div>

      <NotificationSwitch
        checked={checked}
        disabled={disabled}
        label={`Toggle ${label}`}
        onChange={onChange}
      />
    </div>
  );
}