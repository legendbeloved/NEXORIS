import { describe, it, expect } from "vitest";
import { selectVariation, calculateSendTime } from "../../src/lib/scheduler";

describe("Scheduler", () => {
  it("selectVariation extremes", () => {
    // ab_ratio 1 → always A
    for (let i = 0; i < 10; i++) expect(selectVariation(1)).toBe("A");
    // ab_ratio 0 → always B
    for (let i = 0; i < 10; i++) expect(selectVariation(0)).toBe("B");
  });

  it("calculateSendTime window", () => {
    const now = new Date("2025-06-02T20:00:00Z"); // 8pm UTC
    const t = calculateSendTime(now, 9, 17);
    const h = t.getHours();
    expect(h >= 9 && h <= 17).toBe(true);
    // Not weekend
    expect([0, 6].includes(t.getDay())).toBe(false);
  });
});
