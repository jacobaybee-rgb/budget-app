export function getCategoryIcon(categoryName: string) {
  const name = categoryName.toLowerCase();

  if (name.includes("grocer") || name.includes("food")) return "🛒";
  if (name.includes("gas") || name.includes("fuel")) return "⛽";
  if (name.includes("eat") || name.includes("dining") || name.includes("restaurant")) return "🍔";
  if (name.includes("rent") || name.includes("mortgage")) return "🏠";
  if (name.includes("shop") || name.includes("amazon")) return "🛍️";
  if (name.includes("baby") || name.includes("kid")) return "🍼";
  if (name.includes("pet") || name.includes("dog") || name.includes("cat") || name.includes("animal")) return "🐶";
  if (name.includes("travel") || name.includes("vacation")) return "✈️";
  if (name.includes("health") || name.includes("medical")) return "🏥";
  if (name.includes("school") || name.includes("education")) return "🎓";
  if (name.includes("entertainment") || name.includes("game")) return "🎮";
  if (name.includes("electric") || name.includes("utility") || name.includes("power")) return "⚡";
  if (name.includes("phone") || name.includes("mobile")) return "📱";
  if (name.includes("water") || name.includes("sewer")) return "💧";
  if (name.includes("internet") || name.includes("wifi") || name.includes("wi-fi")) return "🌐";
  if (name.includes("car") || name.includes("transport") || name.includes("vehicle")) return "🚗";
  if (name.includes("garbage") || name.includes("trash")) return "🗑️";
  if (name.includes("kid") || name.includes("child") || name.includes("baby")) return "👶";
  if (name.includes("streaming") || name.includes("subscription")) return "📺";
  if (name.includes("debt") || name.includes("loan") || name.includes("pay")) return "💰";
  if (name.includes("gift") || name.includes("present") || name.includes("charity")) return "🎁";
  if (name.includes("maintenance") || name.includes("fix") || name.includes("repair")) return "🔨";
  if (name.includes("fun") || name.includes("leisure")) return "🎉";
  if (name.includes("hobbies")) return "🎸";

  return "📂";
}