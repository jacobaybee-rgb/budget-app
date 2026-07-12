type TimeTheme = {
  greeting: string;
  accentText: string;
  bgImage: string;
  heroOverlay: string;
};

export function getTimeTheme(): TimeTheme {
  const hour = new Date().getHours();

  // Morning: 5:00 AM–11:59 AM
  if (hour >= 5 && hour < 12) {
    return {
      greeting: "Good morning",
      accentText: "Start the day with a clear financial plan.",
      bgImage: "/backgrounds/ocean/morning.png",
      heroOverlay:
        "linear-gradient(to bottom, rgba(9, 9, 11, 0.1), rgba(9, 9, 11, 0.15) 45%, rgba(9, 9, 11, 0.65) 100%)",
    };
  }

  // Afternoon: 12:00 PM–4:59 PM
  if (hour >= 12 && hour < 17) {
    return {
      greeting: "Good afternoon",
      accentText: "Keep your budget moving in the right direction.",
      bgImage: "/backgrounds/ocean/afternoon.png",
      heroOverlay:
        "linear-gradient(to bottom, rgba(9, 9, 11, 0.12), rgba(9, 9, 11, 0.18) 45%, rgba(9, 9, 11, 0.65) 100%)",
    };
  }

  // Evening: 5:00 PM–8:59 PM
  if (hour >= 17 && hour < 21) {
    return {
      greeting: "Good evening",
      accentText: "Review your progress and finish the day strong.",
      bgImage: "/backgrounds/ocean/evening.png",
      heroOverlay:
        "linear-gradient(to bottom, rgba(9, 9, 11, 0.12), rgba(9, 9, 11, 0.2) 45%, rgba(9, 9, 11, 0.7) 100%)",
    };
  }

  // Night: 9:00 PM–4:59 AM
  return {
    greeting: "Burning the midnight oil",
    accentText: "A quiet moment to take control of your finances.",
    bgImage: "/backgrounds/ocean/night.png",
    heroOverlay:
      "linear-gradient(to bottom, rgba(2, 6, 23, 0.15), rgba(2, 6, 23, 0.25) 45%, rgba(9, 9, 11, 0.75) 100%)",
  };
}