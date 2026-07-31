/* academic rules/terms shared by every dashboard. */

export const PERFORMANCE_THRESHOLDS = Object.freeze({ //95-100. Reserved for the "Excellent" hero card, which is meant to be rare 
  outstanding: 95,
  excellent: 85,
  onTrack: 70,
  urgentSupport: 50,
});

export const COMPLETION_THRESHOLDS = Object.freeze({
  excellent: 90,
  onTrack: 70,
});

export function performanceTone(average) {
  const value = Number(average) || 0;
  if (value >= PERFORMANCE_THRESHOLDS.excellent) return "good";
  if (value >= PERFORMANCE_THRESHOLDS.onTrack) return "info";
  return "focus";
}

export function needsUrgentSupport(average) {
  return (Number(average) || 0) < PERFORMANCE_THRESHOLDS.urgentSupport;
}
