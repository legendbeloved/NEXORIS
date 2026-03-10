export function formatCurrency(amount: number, currency: "USD" | "GBP" | "EUR" | "NGN" | "GHS") {
  try {
    const locales: Record<string, string> = {
      USD: "en-US",
      GBP: "en-GB",
      EUR: "de-DE",
      NGN: "en-NG",
      GHS: "en-GH",
    };
    return new Intl.NumberFormat(locales[currency] || "en-US", {
      style: "currency",
      currency,
    }).format(amount);
  } catch {
    return `$${amount.toFixed(2)}`;
  }
}

export function relativeTime(date: Date) {
  const ms = Date.now() - date.getTime();
  const s = Math.round(ms / 1000);
  if (s < 45) return "just now";
  const m = Math.round(s / 60);
  if (m < 60) return `${m} minutes ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} hours ago`;
  const d = Math.round(h / 24);
  return `${d} days ago`;
}

export function sanitizeEmail(email: string) {
  const e = (email || "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) return null;
  return e;
}
