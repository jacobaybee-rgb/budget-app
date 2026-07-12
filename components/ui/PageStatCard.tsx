type PageStatCardColor =
  | "blue"
  | "green"
  | "purple"
  | "orange"
  | "red"
  | "yellow"
  | "zinc";

type PageStatCardProps = {
  label: string;
  value: string;
  color?: PageStatCardColor;
};

const colors: Record<
  PageStatCardColor,
  {
    border: string;
    value: string;
  }
> = {
  blue: {
    border: "border-blue-500/30",
    value: "text-blue-400",
  },
  green: {
    border: "border-green-500/30",
    value: "text-green-400",
  },
  purple: {
    border: "border-purple-500/30",
    value: "text-purple-400",
  },
  orange: {
    border: "border-orange-300/30",
    value: "text-orange-300",
  },
  red: {
    border: "border-red-500/30",
    value: "text-red-400",
  },
  yellow: {
    border: "border-yellow-400/30",
    value: "text-yellow-400",
  },
  zinc: {
    border: "border-zinc-500/30",
    value: "text-zinc-200",
  },
};

export default function PageStatCard({
  label,
  value,
  color = "zinc",
}: PageStatCardProps) {
  return (
    <section
      className={`rounded-2xl border bg-zinc-950/80 p-6 shadow-xl ${colors[color].border}`}
    >
      <p className="text-sm uppercase tracking-widest text-zinc-400">
        {label}
      </p>

      <p className={`mt-3 text-4xl font-bold ${colors[color].value}`}>
        {value}
      </p>
    </section>
  );
}