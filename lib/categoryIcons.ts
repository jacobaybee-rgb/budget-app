export function getCategoryIcon(categoryName: string) {
  const name = categoryName.toLowerCase();

  if (name.includes("grocer") || name.includes("food")) return "🛒";
  if (name.includes("gas") || name.includes("fuel")) return "⛽";
  if (name.includes("eat") || name.includes("dining") || name.includes("restaurant")) return "🍔";
  if (name.includes("bill") || name.includes("rent") || name.includes("mortgage")) return "🏠";
  if (name.includes("shop") || name.includes("amazon")) return "🛍️";
  if (name.includes("baby") || name.includes("kid")) return "🍼";
  if (name.includes("pet") || name.includes("dog") || name.includes("cat")) return "🐶";
  if (name.includes("travel") || name.includes("vacation")) return "✈️";
  if (name.includes("health") || name.includes("medical")) return "🏥";
  if (name.includes("school") || name.includes("education")) return "🎓";
  if (name.includes("entertainment") || name.includes("game")) return "🎮";

  return "📂";
}