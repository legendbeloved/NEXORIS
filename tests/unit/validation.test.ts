import { describe, it, expect } from "vitest";
import { agent1ConfigSchema, agent2ConfigSchema, agent3ConfigSchema, createPaymentLinkSchema, clientMessageSchema } from "../../src/lib/validations";

describe("Validations", () => {
  it("Agent1 valid passes", () => {
    const data = {
      target_cities: ["Lagos"],
      categories: ["Health"],
      max_per_run: 20,
      min_score: 60,
      radius_km: 10,
      frequency: "12h",
      skip_has_website: false,
      skip_has_social: false,
      require_email: true,
    };
    expect(() => agent1ConfigSchema.parse(data)).not.toThrow();
  });

  it("Agent1 empty target_cities fails", () => {
    expect(() => agent1ConfigSchema.parse({ target_cities: [], categories: ["Cat"], max_per_run: 10, min_score: 0, radius_km: 1, frequency: "6h", skip_has_website: false, skip_has_social: false, require_email: true })).toThrow();
  });

  it("Agent1 min_score above 100 fails", () => {
    expect(() => agent1ConfigSchema.parse({ target_cities: ["X"], categories: ["Cat"], max_per_run: 10, min_score: 101, radius_km: 1, frequency: "6h", skip_has_website: false, skip_has_social: false, require_email: true })).toThrow();
  });

  it("Agent2 valid passes", () => {
    const d = { sender_name: "Sarah", sender_email: "sarah@example.com", reply_to: "sarah@example.com", ab_ratio: 0.5, send_hour_start: 9, send_hour_end: 17, max_daily_emails: 50, followup_days: 3, max_followups: 2, tone: "professional" };
    expect(() => agent2ConfigSchema.parse(d)).not.toThrow();
  });

  it("Agent2 ab_ratio > 1 fails", () => {
    const d = { sender_name: "Sarah", sender_email: "sarah@example.com", reply_to: "sarah@example.com", ab_ratio: 1.2, send_hour_start: 9, send_hour_end: 17, max_daily_emails: 50, followup_days: 3, max_followups: 2, tone: "professional" };
    expect(() => agent2ConfigSchema.parse(d)).toThrow();
  });

  it("Agent3 max_price below min_price fails", () => {
    const d = { services: [{ name: "SEO", min_price: 500, max_price: 400, default_price: 500, max_discount_pct: 10 }], max_rounds: 5, approval_threshold: 1000 };
    expect(() => agent3ConfigSchema.parse(d)).toThrow();
  });

  it("Payment validation", () => {
    expect(() => createPaymentLinkSchema.parse({ prospect_id: "00000000-0000-0000-0000-000000000000", amount: 100, currency: "USD", description: "Deposit" })).not.toThrow();
    expect(() => createPaymentLinkSchema.parse({ prospect_id: "00000000-0000-0000-0000-000000000000", amount: 0, currency: "USD", description: "short" })).toThrow();
  });

  it("Client message validation", () => {
    expect(() => clientMessageSchema.parse({ message: "Hello" })).not.toThrow();
    expect(() => clientMessageSchema.parse({ message: "" })).toThrow();
  });
});
