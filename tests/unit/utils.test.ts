import { describe, it, expect } from "vitest";
import { formatCurrency, relativeTime, sanitizeEmail } from "../../src/lib/utils";

describe("Utils", () => {
  it("formatCurrency", () => {
    expect(formatCurrency(2400, "USD")).toMatch("$2,400.00");
  });
  it("relativeTime", () => {
    const now = new Date();
    expect(relativeTime(new Date(now.getTime() - 30_000))).toBe("just now");
  });
  it("sanitizeEmail", () => {
    expect(sanitizeEmail("  Test@Example.com ")).toBe("test@example.com");
    expect(sanitizeEmail("badmail")).toBeNull();
  });
});
