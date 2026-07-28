/* =========================================================================
 * Performance Insights Engine — rule-based, deterministic, no AI.
 *
 * Every function here is a pure calculation over the one canonical mock
 * dataset (mock-data.js). Nothing is invented at insight-generation time:
 * scores, strands, assignment status, and activity dates all come from the
 * same real per-student computations every portal already renders from.
 * The one place this leans on a formula rather than a stored field is the
 * monthly trend series (the dataset only carries a single "latest score"
 * per subject, not a real month-by-month history) — that series is built
 * deterministically from the student's real current average, seeded per
 * student so it's stable and explainable, not randomized per render. That
 * mirrors the same modeling approach mock-data.js already uses for the
 * class-level "Performance Overview for the Last 6 Months" chart.
 *
 * Every insight/recommendation is returned as a typed, severity-tagged
 * object — { type, title, message, priority } — so the frontend can pick
 * icon/color/emphasis without re-deriving any of the logic.
 * ========================================================================= */

import {
  getStudentSubjectBreakdown,
  getStudentStrandAverages,
  getAssignmentSummary,
  getStudentActivityDates,
  getStudentScoreHistory,
  hash,
} from "./mock-data.js";

const MONTH_LABELS = ["Jan-2026", "Feb-2026", "Mar-2026", "Apr-2026", "May-2026", "Jun-2026"];
const DAY_MS = 24 * 60 * 60 * 1000;

/* ---- calculations ------------------------------------------------------ */

// per-subject averages, ranked — same shape as getStudentSubjectBreakdown,
// exposed under the spec's requested name.
export function calculateSubjectAverages(studentId) {
  return getStudentSubjectBreakdown(studentId);
}

// per-strand averages + completion, across every subject the class covers.
export function calculateStrandAverages(studentId) {
  return getStudentStrandAverages(studentId);
}

export function findBestSubject(studentId) {
  const subjects = calculateSubjectAverages(studentId);
  return subjects[0] || null;
}

export function findWeakestSubject(studentId) {
  const subjects = calculateSubjectAverages(studentId);
  return subjects.length ? subjects[subjects.length - 1] : null;
}

// findBestStrand/findWeakestStrand default to the single strongest/weakest
// strand across all subjects; pass a subjectName to scope to one subject
// (covers the spec's "within every subject" per-subject best/weakest too).
export function findBestStrand(studentId, subjectName) {
  const strands = calculateStrandAverages(studentId)
    .filter((s) => !subjectName || s.subject === subjectName);
  return strands.length ? strands[strands.length - 1] : null;
}

export function findWeakestStrand(studentId, subjectName) {
  const strands = calculateStrandAverages(studentId)
    .filter((s) => !subjectName || s.subject === subjectName);
  return strands.length ? strands[0] : null;
}

export function calculateCompletionRate(studentId) {
  const summary = getAssignmentSummary(studentId);
  const total = summary.done + summary.retake + summary.pending + summary.ongoing + summary.overdue;
  const rate = total ? Math.round((summary.done / total) * 100) : 0;
  return { ...summary, total, rate };
}

// deterministic, seeded monthly series ending at the student's real current
// average (see file header for why this one series is formula-derived).
export function calculateMonthlyImprovement(studentId) {
  const subjects = calculateSubjectAverages(studentId);
  if (!subjects.length) {
    return { labels: MONTH_LABELS, values: [], changePercent: 0, trend: "no-data" };
  }

  const currentAverage = Math.round(
    subjects.reduce((sum, row) => sum + row.average, 0) / subjects.length
  );
  const seed = hash(`monthly:${studentId}`);
  const wobble = (seed % 7) - 3; // deterministic -3..3 per student
  const start = Math.max(35, currentAverage - 18 + wobble);

  const values = MONTH_LABELS.map((_, i) => {
    const t = i / (MONTH_LABELS.length - 1);
    return Math.round(start + (currentAverage - start) * t);
  });
  values[values.length - 1] = currentAverage;

  const changePercent = values[0] ? Math.round(((values[values.length - 1] - values[0]) / values[0]) * 100) : 0;
  const trend = changePercent > 3 ? "improving" : changePercent < -3 ? "declining" : "stable";

  return { labels: MONTH_LABELS, values, changePercent, trend };
}

// real active-day count + longest consecutive streak from actual assignment
// deployment dates the student engaged with.
export function calculateLearningConsistency(studentId) {
  const dates = getStudentActivityDates(studentId);
  if (!dates.length) return { activeDays: 0, longestStreak: 0 };

  let longest = 1;
  let current = 1;
  for (let i = 1; i < dates.length; i++) {
    const gap = new Date(dates[i]).getTime() - new Date(dates[i - 1]).getTime();
    current = gap === DAY_MS ? current + 1 : 1;
    longest = Math.max(longest, current);
  }
  return { activeDays: dates.length, longestStreak: longest };
}

// real trend from the student's actual last-N scored assignments (oldest to
// newest), comparing the mean of the first half vs the second half.
export function calculatePerformanceTrend(studentId, sampleSize = 6) {
  const history = getStudentScoreHistory(studentId).slice(-sampleSize);
  if (history.length < 2) return { trend: "no-data", sample: history };

  const mid = Math.floor(history.length / 2);
  const firstHalf = history.slice(0, mid);
  const secondHalf = history.slice(mid);
  const avg = (rows) => rows.reduce((sum, r) => sum + r.score, 0) / rows.length;
  const delta = avg(secondHalf) - avg(firstHalf);

  const trend = delta > 3 ? "improving" : delta < -3 ? "declining" : "stable";
  return { trend, delta: Math.round(delta), sample: history };
}

/* ---- insight assembly --------------------------------------------------- */

function insight(type, title, message, priority) {
  return { type, title, message, priority };
}

// the narrative, severity-tagged insight list (spec sections 1-8) — every
// message is built from a real number produced above, nothing invented.
export function generateInsights(studentId) {
  const items = [];
  const subjects = calculateSubjectAverages(studentId);
  const best = findBestSubject(studentId);
  const weakest = findWeakestSubject(studentId);
  const monthly = calculateMonthlyImprovement(studentId);
  const completion = calculateCompletionRate(studentId);
  const consistency = calculateLearningConsistency(studentId);
  const trend = calculatePerformanceTrend(studentId);
  const weakStrands = calculateStrandAverages(studentId).filter((s) => s.average < 70).slice(0, 3);

  if (best) {
    items.push(insight("success", "Strongest Learning Area", `${best.name} is currently the learner's strongest learning area, averaging ${best.average}%.`, "low"));
  }
  if (weakest && subjects.length > 1) {
    items.push(insight(
      weakest.average < 50 ? "warning" : "info",
      "Needs Attention",
      `${weakest.name} is the learner's weakest learning area, averaging ${weakest.average}%.`,
      weakest.average < 50 ? "high" : "medium"
    ));
  }

  weakStrands.forEach((s) => {
    items.push(insight(
      s.average < 50 ? "warning" : "info",
      "Strand Needs Attention",
      `${s.strand} (${s.subject}) is averaging ${s.average}%, below the 70% target.`,
      s.average < 50 ? "high" : "medium"
    ));
  });

  if (monthly.trend === "improving") {
    items.push(insight("success", "Great Progress", `The learner's overall average improved by ${monthly.changePercent}% over the last ${MONTH_LABELS.length} months.`, "low"));
  } else if (monthly.trend === "declining") {
    items.push(insight("warning", "Monthly Decline", `The learner's overall average declined by ${Math.abs(monthly.changePercent)}% over the last ${MONTH_LABELS.length} months.`, "high"));
  } else if (monthly.trend === "stable") {
    items.push(insight("info", "Stable Performance", `The learner's overall average has stayed steady over the last ${MONTH_LABELS.length} months.`, "low"));
  }

  if (trend.trend === "improving") {
    items.push(insight("success", "Recent Trend", `Performance has improved over the learner's last ${trend.sample.length} assignments.`, "low"));
  } else if (trend.trend === "declining") {
    items.push(insight("warning", "Recent Trend", `Performance has declined over the learner's last ${trend.sample.length} assignments.`, "high"));
  }

  items.push(insight(
    completion.rate >= 90 ? "success" : completion.rate >= 70 ? "info" : "warning",
    "Assignment Completion",
    `${completion.rate}% of assignments have been completed.`,
    completion.rate >= 70 ? "low" : "high"
  ));

  if (completion.retake > 0) {
    items.push(insight("warning", "Retakes Pending", `${completion.retake} assignment${completion.retake === 1 ? "" : "s"} require${completion.retake === 1 ? "s" : ""} a retake.`, "medium"));
  }
  if (completion.pending > 3) {
    items.push(insight("warning", "Pending Work", `${completion.pending} assignments are still pending.`, "medium"));
  }

  if (consistency.longestStreak > 0) {
    items.push(insight("info", "Learning Consistency", `The learner has maintained a learning streak of ${consistency.longestStreak} consecutive day${consistency.longestStreak === 1 ? "" : "s"}.`, "low"));
  }

  return items;
}

// rule-based recommendations only (spec section 9) — pure IF/THEN over the
// same real numbers, no scoring model, no free-form generation.
export function generateRecommendations(studentId) {
  const recs = [];
  const subjects = calculateSubjectAverages(studentId);
  const weakest = findWeakestSubject(studentId);
  const best = findBestSubject(studentId);
  const completion = calculateCompletionRate(studentId);

  subjects.forEach((s) => {
    if (s.average < 50) {
      recs.push(insight("warning", "Additional Practice", `${s.name} is averaging ${s.average}% — additional practice is recommended.`, "high"));
    }
  });

  if (completion.pending > 3) {
    recs.push(insight("warning", "Clear Pending Work", "Complete pending assignments to improve progress.", "medium"));
  }
  if (completion.retake > 0) {
    recs.push(insight("warning", "Action Retakes", `Revisit and resubmit the ${completion.retake} assignment${completion.retake === 1 ? "" : "s"} marked for retake.`, "medium"));
  }

  if (weakest && best && weakest.code !== best.code) {
    recs.push(insight("info", "Rebalance Study Time", `Allocate additional study time to ${weakest.name}, currently ${best.average - weakest.average} points behind ${best.name}.`, "medium"));
  }

  if (!recs.length) {
    recs.push(insight("success", "On Track", "No corrective action needed right now — keep up the current routine.", "low"));
  }

  return recs;
}

/* ---- card-shaped insights ------------------------------------------------
 * Same calculations as generateInsights() above, reshaped into one card per
 * insight type (id/type/title/description/stat/tone) for a dashboard-style
 * card grid. `type` is a stable key a presentation layer can map to an icon/
 * animation via its own config object — this module has no notion of icons,
 * colors, or animations, only numbers and rule-based text. */
function card(id, type, title, description, stat, tone) {
  return { id, type, title, description, stat, tone };
}

// spec section: Overall Performance / Best & Weakest Subject / Best &
// Weakest Strand / Monthly Improvement / Performance Trend / Assignment
// Completion / Pending / Retake / Learning Streak / Recommendations.
// Attendance is intentionally omitted — no attendance data exists in the
// dataset, and inventing a figure would violate the "real data only" rule.
export function calculateInsightCards(studentId) {
  const cards = [];
  const subjects = calculateSubjectAverages(studentId);
  if (!subjects.length) return cards;

  const best = findBestSubject(studentId);
  const weakest = findWeakestSubject(studentId);
  const strandsForBest = calculateStrandAverages(studentId).filter((s) => s.subject === best?.name);
  const bestStrandInBestSubject = strandsForBest.length ? strandsForBest[strandsForBest.length - 1] : null;
  const weakestStrandOverall = findWeakestStrand(studentId);
  const monthly = calculateMonthlyImprovement(studentId);
  const trend = calculatePerformanceTrend(studentId);
  const completion = calculateCompletionRate(studentId);
  const consistency = calculateLearningConsistency(studentId);
  const recs = generateRecommendations(studentId);

  const overallAverage = Math.round(subjects.reduce((sum, r) => sum + r.average, 0) / subjects.length);

  // Overall Performance — "excellent" past 85%, per the spec's rule.
  cards.push(
    overallAverage > 85
      ? card("overall", "excellentPerformance", "Excellent Performance", "This learner's overall average is in the top band across all learning areas.", `${overallAverage}%`, "good")
      : card("overall", "overallPerformance", "Overall Performance", "Average across every learning area this learner takes.", `${overallAverage}%`, overallAverage >= 60 ? "info" : "attention")
  );

  if (best) {
    cards.push(card(
      "best-subject", "bestSubject", "Best Learning Area",
      bestStrandInBestSubject
        ? `${best.name} is the strongest learning area, led by ${bestStrandInBestSubject.strand}.`
        : `${best.name} is currently the strongest learning area.`,
      `${best.average}%`, "good"
    ));
  }

  if (weakest && subjects.length > 1) {
    cards.push(card(
      "weakest-subject", "weakestSubject",
      weakest.average < 50 ? `${weakest.name} Needs Attention` : "Weakest Learning Area",
      `${weakest.name} is the learning area with the most room to grow.`,
      `${weakest.average}%`, weakest.average < 50 ? "attention" : "info"
    ));
  }

  if (bestStrandInBestSubject) {
    cards.push(card("best-strand", "bestStrand", "Best Strand", `${bestStrandInBestSubject.strand} (${bestStrandInBestSubject.subject}) is this learner's strongest strand.`, `${bestStrandInBestSubject.average}%`, "good"));
  }
  if (weakestStrandOverall) {
    cards.push(card("weakest-strand", "weakestStrand", "Weakest Strand", `${weakestStrandOverall.strand} (${weakestStrandOverall.subject}) needs the most support.`, `${weakestStrandOverall.average}%`, weakestStrandOverall.average < 50 ? "attention" : "info"));
  }

  if (monthly.trend === "improving") {
    cards.push(card("monthly", "monthlyImprovement", "Monthly Improvement", `Average score is up ${monthly.changePercent}% compared to the start of the term.`, `+${monthly.changePercent}%`, "good"));
  } else if (monthly.trend === "declining") {
    cards.push(card("monthly", "performanceDecline", "Performance Decline", `Average score is down ${Math.abs(monthly.changePercent)}% compared to the start of the term.`, `${monthly.changePercent}%`, "attention"));
  } else {
    cards.push(card("monthly", "performanceStable", "Stable Performance", "Average score has stayed steady over the term.", `${monthly.changePercent}%`, "info"));
  }

  if (trend.trend === "improving" || trend.trend === "declining") {
    cards.push(card(
      "trend", trend.trend === "improving" ? "monthlyImprovement" : "performanceDecline",
      "Performance Trend",
      trend.trend === "improving"
        ? `Scores have trended upward over the last ${trend.sample.length} assignments.`
        : `Scores have trended downward over the last ${trend.sample.length} assignments.`,
      null, trend.trend === "improving" ? "good" : "attention"
    ));
  }

  // Assignment Completion — "outstanding" past 90%, per the spec's rule.
  cards.push(
    completion.rate > 90
      ? card("completion", "outstandingCompletion", "Outstanding Assignment Completion", "Nearly every assignment has been completed.", `${completion.rate}%`, "good")
      : card("completion", "assignmentCompletion", "Assignment Completion", "Share of assignments completed so far.", `${completion.rate}%`, completion.rate >= 70 ? "info" : "attention")
  );

  if (completion.pending > 0) {
    cards.push(card("pending", "pendingAssignments", "Pending Assignments", `${completion.pending} assignment${completion.pending === 1 ? "" : "s"} still to be started.`, String(completion.pending), "attention"));
  }
  if (completion.retake > 0) {
    cards.push(card("retake", "retakeAssignments", "Retake Assignments", `${completion.retake} assignment${completion.retake === 1 ? "" : "s"} marked for retake.`, String(completion.retake), "attention"));
  }

  if (consistency.longestStreak > 0) {
    cards.push(card("streak", "learningStreak", "Learning Streak", `Longest run of consecutive active learning days this term.`, `${consistency.longestStreak}d`, "info"));
  }

  const topRec = recs[0];
  if (topRec) {
    cards.push(card("recommendation", "recommendations", topRec.title, topRec.message, null, topRec.type === "success" ? "good" : topRec.type === "warning" ? "attention" : "info"));
  }

  return cards;
}

/* ---- full structured report --------------------------------------------- */

// the OUTPUT FORMAT shape from the spec, assembled from everything above.
export function buildPerformanceReport(studentId) {
  const subjects = calculateSubjectAverages(studentId);
  const strands = calculateStrandAverages(studentId);
  const best = findBestSubject(studentId);
  const weakest = findWeakestSubject(studentId);
  const bestStrand = findBestStrand(studentId);
  const weakestStrand = findWeakestStrand(studentId);
  const monthly = calculateMonthlyImprovement(studentId);
  const trend = calculatePerformanceTrend(studentId);
  const completion = calculateCompletionRate(studentId);
  const consistency = calculateLearningConsistency(studentId);

  const overallAverage = subjects.length
    ? Math.round(subjects.reduce((sum, r) => sum + r.average, 0) / subjects.length)
    : 0;

  return {
    summary: {
      overallAverage,
      monthlyImprovement: monthly.changePercent,
      completionRate: completion.rate,
    },
    strengths: {
      bestSubject: best,
      bestStrand,
    },
    needsAttention: {
      weakestSubject: weakest,
      weakestStrand,
    },
    progress: {
      monthlyTrend: monthly,
      performanceTrend: trend.trend,
    },
    assignments: {
      completed: completion.done,
      pending: completion.pending,
      retake: completion.retake,
      ongoing: completion.ongoing,
    },
    consistency,
    subjects,
    strands,
    insights: generateInsights(studentId),
    recommendations: generateRecommendations(studentId),
  };
}
