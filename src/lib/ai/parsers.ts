export function parseGeminiAnalysis(raw: string) {
  try {
    const j = JSON.parse(raw || "{}");
    const painPoints = Array.isArray(j.painPoints) ? j.painPoints.filter(Boolean) : [];
    let score = Number(j.score ?? 0);
    if (Number.isNaN(score)) score = 0;
    score = Math.max(0, Math.min(100, Math.round(score)));
    return {
      gaps: String(j.gaps || ""),
      painPoints,
      score,
      signals: typeof j.signals === "object" && j.signals ? j.signals : {},
    };
  } catch {
    return { gaps: "", painPoints: [], score: 0, signals: {} };
  }
}

export function parseNegotiationResponse(raw: string, min_price: number) {
  try {
    const j = JSON.parse(raw || "{}");
    let action = String(j.action || "reply").toLowerCase();
    if (!["reply", "agreed", "book_meeting", "escalate", "declined"].includes(action)) {
      action = "escalate";
    }
    let agreed_price = j.agreed_price;
    if (agreed_price != null && Number(agreed_price) < min_price) {
      action = "escalate";
    }
    return {
      response: String(j.response || ""),
      action,
      agreed_price: agreed_price != null ? Number(agreed_price) : null,
      service_name: j.service_name || null,
      escalation_reason: j.escalation_reason || null,
    };
  } catch {
    return {
      response: "",
      action: "escalate",
      agreed_price: null,
      service_name: null,
      escalation_reason: "parse_error",
    };
  }
}
