type PageHeaderColor =
  | "blue"
  | "green"
  | "purple"
  | "orange"
  | "red"
  | "yellow"
  | "zinc";

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  color?: PageHeaderColor;
};

const colors: Record<PageHeaderColor, string> = {
  blue: "text-blue-300",
  green: "text-green-300",
  purple: "text-purple-300",
  orange: "text-orange-300",
  red: "text-red-400",
  yellow: "text-yellow-400",
  zinc: "text-zinc-300",
};

export default function PageHeader({
  eyebrow,
  title,
  description,
  color = "zinc",
}: PageHeaderProps) {
  return (
    <div>
      <p
        className={`text-sm uppercase tracking-widest ${colors[color]}`}
      >
        {eyebrow}
      </p>

      <h1 className="mt-2 text-5xl font-bold text-white">
        {title}
      </h1>

      <p className="mt-2 text-zinc-400">
        {description}
      </p>
    </div>
  );
}