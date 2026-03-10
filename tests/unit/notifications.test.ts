import { describe, it, expect } from "vitest";
import { getNotificationConfig, buildNotificationTitle, buildActionUrl } from "../../src/lib/notifications";

describe("Notification helpers", () => {
  it("PAYMENT_RECEIVED is URGENT", () => {
    expect(getNotificationConfig("PAYMENT_RECEIVED").priority).toBe("URGENT");
  });
  it("AGENT_ERROR requires action", () => {
    expect(getNotificationConfig("AGENT_ERROR").requiresAction).toBe(true);
  });
  it("EMAIL_SENT emailEnabled false", () => {
    expect(getNotificationConfig("EMAIL_SENT").emailEnabled).toBe(false);
  });
  it("REPLY_RECEIVED emailEnabled true", () => {
    expect(getNotificationConfig("REPLY_RECEIVED").emailEnabled).toBe(true);
  });
  it("Unknown type has default config", () => {
    expect(getNotificationConfig("FOO").priority).toBeDefined();
  });

  it("Title builders", () => {
    expect(buildNotificationTitle("PAYMENT_RECEIVED", { amount: 2400, business_name: "Acme" })).toMatch(/\$2,400/);
    expect(buildNotificationTitle("REPLY_RECEIVED", { business_name: "Acme" })).toContain("Acme");
  });

  it("Action URLs", () => {
    expect(buildActionUrl("PROSPECT_FOUND", { prospect_id: 42, project_id: null, agent_id: null })).toContain("/dashboard/prospects/42");
    expect(buildActionUrl("PAYMENT_RECEIVED", { project_id: 99, prospect_id: null, agent_id: null })).toContain("/dashboard/projects/99");
    expect(buildActionUrl("AGENT_ERROR", { agent_id: 3, prospect_id: null, project_id: null })).toContain("/dashboard/agents/3");
  });
});
