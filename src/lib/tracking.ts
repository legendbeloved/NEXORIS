export function buildTrackingPixelUrl(emailId: string, prospectId: string) {
  const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const u = new URL("/api/outreach/track/open", base);
  u.searchParams.set("emailId", emailId);
  u.searchParams.set("prospectId", prospectId);
  return u.toString();
}

export function buildClickTrackUrl(emailId: string, prospectId: string, destination: string) {
  const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const u = new URL("/api/outreach/track/click", base);
  u.searchParams.set("emailId", emailId);
  u.searchParams.set("prospectId", prospectId);
  u.searchParams.set("to", destination);
  return u.toString();
}
