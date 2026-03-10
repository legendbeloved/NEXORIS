import { describe, it, expect } from "vitest";
import { buildTrackingPixelUrl, buildClickTrackUrl } from "../../src/lib/tracking";

describe("Email tracking URLs", () => {
  it("pixel url contains params", () => {
    const url = buildTrackingPixelUrl("e-123", "p-456");
    expect(url).toContain("emailId=e-123");
    expect(url).toContain("prospectId=p-456");
  });
  it("click url encodes destination", () => {
    const dest = "https://example.com/path?q=hello world";
    const url = buildClickTrackUrl("e-1", "p-2", dest);
    expect(decodeURIComponent(new URL(url).searchParams.get("to") || "")).toBe(dest);
  });
});
