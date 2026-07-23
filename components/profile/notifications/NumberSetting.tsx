"use client";

type NumberSettingProps = {
  id: string;
  label: string;
  description: string;
  value: number;
  disabled?: boolean;
  min: number;
  max: number;
  suffix: string;
  onChange: (value: number) => void;
};

export default function NumberSetting({
  id,
  label,
  description,
  value,
  disabled = false,
  min,
  max,
  suffix,
  onChange,
}: NumberSettingProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <label
          htmlFor={id}
          className="text-sm font-semibold text-zinc-200"
        >
          {label}
        </label>

        <p className="mt-1 text-xs leading-5 text-zinc-500">
          {description}
        </p>
      </div>

      <div className="relative w-24 shrink-0">
        <input
          id={id}
          type="number"
          min={min}
          max={max}
          disabled={disabled}
          value={value}
          onChange={(event) => {
            const parsedValue = Number(
              event.target.value
            );

            if (Number.isNaN(parsedValue)) {
              return;
            }

            onChange(
              Math.min(
                Math.max(parsedValue, min),
                max
              )
            );
          }}
          className="w-full rounded-xl border border-zinc-700 bg-zinc-950 py-2.5 pl-3 pr-8 text-white outline-none transition focus:border-blue-400 disabled:cursor-not-allowed disabled:opacity-40"
        />

        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-zinc-500">
          {suffix}
        </span>
      </div>
    </div>
  );
}