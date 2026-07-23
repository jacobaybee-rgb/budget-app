type SettingSummaryProps = {
  label: string;
  value: string;
  enabled: boolean;
};

export default function SettingSummary({
  label,
  value,
  enabled,
}: SettingSummaryProps) {
  return (
    <div
      className={`rounded-xl border px-3 py-2 ${
        enabled
          ? "border-blue-500/25 bg-blue-500/10"
          : "border-zinc-800 bg-zinc-900/60"
      }`}
    >
      <p
        className={`text-xs font-bold ${
          enabled ? "text-blue-200" : "text-zinc-500"
        }`}
      >
        {label}
      </p>

      <p
        className={`mt-0.5 text-xs ${
          enabled ? "text-zinc-300" : "text-zinc-600"
        }`}
      >
        {enabled ? value : "Off"}
      </p>
    </div>
  );
}