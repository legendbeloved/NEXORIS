export function selectVariation(ab_ratio: number) {
  const r = Math.random();
  const p = Math.max(0, Math.min(1, ab_ratio));
  return r < p ? "A" : "B";
}

export function calculateSendTime(now: Date, hourStart: number, hourEnd: number) {
  const start = Math.max(0, Math.min(23, Math.floor(hourStart)));
  let end = Math.max(0, Math.min(23, Math.floor(hourEnd)));
  if (end <= start) end = Math.min(23, start + 1);
  const candidate = new Date(now);
  if (candidate.getHours() >= end) {
    candidate.setDate(candidate.getDate() + 1);
    candidate.setHours(start, 0, 0, 0);
  } else if (candidate.getHours() < start) {
    candidate.setHours(start, 0, 0, 0);
  }
  // Skip weekends
  while ([6, 0].includes(candidate.getDay())) {
    candidate.setDate(candidate.getDate() + 1);
    candidate.setHours(start, 0, 0, 0);
  }
  return candidate;
}
