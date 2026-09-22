const compactFormat = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});
const fullFormat = new Intl.NumberFormat("en");

// 1234567 -> "1.2M"
export const formatCompact = (value) =>
  compactFormat.format(Number(value) || 0);

// 1234567 -> "1,234,567"
export const formatFull = (value) => fullFormat.format(Number(value) || 0);

// 0.6 -> "+0.60", -0.4767 -> "-0.48"
export function formatScore(value) {
  const number = Number(value) || 0;
  return `${number > 0 ? "+" : ""}${number.toFixed(2)}`;
}

// 27.879999 -> "27.9", 40 -> "40", 26.67 -> "26.7"
export const formatPercent = (value) =>
  String(Math.round((Number(value) || 0) * 10) / 10);
