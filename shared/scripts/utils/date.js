export const MONTH_ABBREVIATIONS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

// "2026-06-09 09:30:00" or an ISO string -> "09 Jun 2026".
export function formatDate(value) {
  if (!value) return "—";
  const datePart = String(value).slice(0, 10);
  const [y, m, d] = datePart.split("-").map(Number);
  if (!y || !m || !d) return String(value);
  return `${String(d).padStart(2, "0")} ${MONTH_ABBREVIATIONS[m - 1]} ${y}`;
}

// Date object -> "YYYY-MM-DD", using local calendar fields rather than toISOString(), which shifts the day for anyone east of UTC.UI only
export function dateOnly(date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}
