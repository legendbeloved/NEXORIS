import { describe, it, expect } from "vitest";
import { parseGeminiAnalysis, parseNegotiationResponse } from "../../src/lib/ai/parsers";

describe("AI parsers", () => {
  it("parseGeminiAnalysis ok", () => {
    const raw = JSON.stringify({ gaps: "Issues", painPoints: ["Slow"], score: 88, signals: { seoIssues: true } });
    const r = parseGeminiAnalysis(raw);
    expect(r.score).toBe(88);
    expect(r.painPoints.length).toBe(1);
  });
  it("parseGeminiAnalysis malformed", () => {
    const r = parseGeminiAnalysis("{");
    expect(r.score).toBe(0);
    expect(r.painPoints).toEqual([]);
  });
  it("parseNegotiationResponse guardrail", () => {
    const raw = JSON.stringify({ response: "ok", action: "agreed", agreed_price: 100, service_name: "SEO" });
    const r = parseNegotiationResponse(raw, 500);
    expect(r.action).toBe("escalate");
  });
  it("parseNegotiationResponse malformed", () => {
    const r = parseNegotiationResponse("{", 300);
    expect(r.action).toBe("escalate");
  });
});
