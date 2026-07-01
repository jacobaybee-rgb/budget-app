export type TimeTheme = {
  greeting: string;
  bgImage: string;
  heroOverlay: string;
  accentText: string;
  accentBorder: string;
  accentGlow: string;
};

export function getTimeTheme(): TimeTheme {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) {
    return {
      greeting: "Good morning",
      bgImage:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=2070",
      heroOverlay:
        "linear-gradient(to bottom, rgba(0,0,0,0.15), rgba(2,6,23,0.9))",
      accentText: "text-amber-300",
      accentBorder: "border-amber-500/40",
      accentGlow: "shadow-[0_0_20px_rgba(245,158,11,0.55)]",
    };
  }

  if (hour >= 12 && hour < 17) {
    return {
      greeting: "Good afternoon",
      bgImage:
        "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070",
      heroOverlay:
        "linear-gradient(to bottom, rgba(0,0,0,0.10), rgba(2,6,23,0.85))",
      accentText: "text-sky-300",
      accentBorder: "border-sky-500/40",
      accentGlow: "shadow-[0_0_20px_rgba(56,189,248,0.55)]",
    };
  }

  if (hour >= 17 && hour < 22) {
    return {
      greeting: "Good evening",
      bgImage:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070",
      heroOverlay:
        "linear-gradient(to bottom, rgba(0,0,0,0.20), rgba(2,6,23,0.92))",
      accentText: "text-violet-300",
      accentBorder: "border-violet-500/40",
      accentGlow: "shadow-[0_0_20px_rgba(139,92,246,0.55)]",
    };
  }

  return {
    greeting: "Burning the midnight oil",
    bgImage:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2070",
    heroOverlay:
      "linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(2,6,23,0.95))",
    accentText: "text-emerald-300",
    accentBorder: "border-emerald-500/40",
    accentGlow: "shadow-[0_0_20px_rgba(16,185,129,0.55)]",
  };
}