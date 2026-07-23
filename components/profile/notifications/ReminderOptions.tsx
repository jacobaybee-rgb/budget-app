"use client";

type ReminderOptionsProps = {
  label: string;
  options: number[];
  selectedDays: number[];
  disabled?: boolean;
  onToggle: (day: number) => void;
};

export default function ReminderOptions({
  label,
  options,
  selectedDays,
  disabled = false,
  onToggle,
}: ReminderOptionsProps) {
  return (
    <div>
      <p className="text-sm font-semibold text-zinc-200">
        {label}
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((day) => {
          const selected = selectedDays.includes(day);

          return (
            <button
              key={day}
              type="button"
              disabled={disabled}
              onClick={() => onToggle(day)}
              className={`rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                selected
                  ? "border-blue-400/60 bg-blue-500/15 text-blue-200"
                  : "border-zinc-700 bg-zinc-950 text-zinc-400 hover:border-zinc-600 hover:text-white"
              } disabled:cursor-not-allowed disabled:opacity-40`}
            >
              {formatReminderDay(day)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function formatReminderDay(day: number) {
  if (day === 0) {
    return "Day of";
  }

  if (day === 1) {
    return "1 day before";
  }

  return `${day} days before`;
}