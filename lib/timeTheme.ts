export function getTimeTheme() {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) {
    return {
      greeting: "Good morning",
      emoji: "🌅",
      bgImage:
        "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?q=80&w=2070",
    };
  }

  if (hour >= 12 && hour < 17) {
    return {
      greeting: "Good afternoon",
      emoji: "☀️",
      bgImage:
        "https://images.unsplash.com/photo-1519904985650-2c3c3e2c5c3b?q=80&w=2070",
    };
  }

  if (hour >= 17 && hour < 21) {
    return {
      greeting: "Good evening",
      emoji: "🌇",
      bgImage:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070",
    };
  }

  return {
    greeting: "Good night",
    emoji: "🌙",
    bgImage:
      "https://images.unsplash.com/photo-1531366936337-7c912a4589a3?q=80&w=2070",
  };
}