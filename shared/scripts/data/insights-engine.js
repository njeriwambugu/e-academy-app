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
  getStudentAssignmentRecords,
  getStudentScoreHistory,
  hash,
} from "./mock-data.js";
import {
  COMPLETION_THRESHOLDS,
  PERFORMANCE_THRESHOLDS,
  needsUrgentSupport,
  performanceTone,
} from "../constants/academic.js";

const MONTH_LABELS = ["Jan-2026", "Feb-2026", "Mar-2026", "Apr-2026", "May-2026", "Jun-2026"];
const DAY_MS = 24 * 60 * 60 * 1000;

function usesAssignmentRecords(period) {
  return Boolean(period?.source === "assignments" || period?.start || period?.end);
}

/* kalqulations = per-subject averages, ranked same shape as getStudentSubjectBreakdown*/
export function calculateSubjectAverages(studentId, period) {
  if (!usesAssignmentRecords(period)) return getStudentSubjectBreakdown(studentId);

  const totals = new Map();
  getStudentAssignmentRecords(studentId, period).forEach((record) => {
    if (record.score == null) return;
    const current = totals.get(record.subject) || { name: record.subject, sum: 0, count: 0 };
    current.sum += record.score;
    current.count += 1;
    totals.set(record.subject, current);
  });

  const rows = [...totals.values()]
    .map((row) => ({ name: row.name, average: Math.round(row.sum / row.count) }))
    .sort((a, b) => b.average - a.average);

  return rows.map((row, index) => ({ ...row, rank: index + 1, outOf: rows.length }));
}

// per-strand averages + completion, across every subject the class covers.
export function calculateStrandAverages(studentId, period) {
  if (!usesAssignmentRecords(period)) return getStudentStrandAverages(studentId);

  const totals = new Map();
  getStudentAssignmentRecords(studentId, period).forEach((record) => {
    const key = `${record.subject}::${record.strand}`;
    const current = totals.get(key) || {
      subject: record.subject,
      strand: record.strand,
      sum: 0,
      count: 0,
      total: 0,
    };
    current.total += 1;
    if (record.score != null) {
      current.sum += record.score;
      current.count += 1;
    }
    totals.set(key, current);
  });

  return [...totals.values()]
    .filter((row) => row.count > 0)
    .map((row) => ({
      subject: row.subject,
      strand: row.strand,
      average: Math.round(row.sum / row.count),
      completion: Math.round((row.count / row.total) * 100),
    }))
    .sort((a, b) => a.average - b.average);
}

export function findBestSubject(studentId) {
  const subjects = calculateSubjectAverages(studentId);
  return subjects[0] || null;
}

export function findWeakestSubject(studentId) {
  const subjects = calculateSubjectAverages(studentId);
  return subjects.length ? subjects[subjects.length - 1] : null;
}

// findBestStrand/findWeakestStrand default to the single strongest/weakest strand across all subjects; pass a subjectName to scope to one subject
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

export function calculateCompletionRate(studentId, period) {
  const summary = usesAssignmentRecords(period)
    ? getStudentAssignmentRecords(studentId, period).reduce(
      (totals, record) => ({ ...totals, [record.category]: (totals[record.category] || 0) + 1 }),
      { done: 0, retake: 0, pending: 0, ongoing: 0, overdue: 0 }
    )
    : getAssignmentSummary(studentId);
  const total = summary.done + summary.retake + summary.pending + summary.ongoing + summary.overdue;
  const rate = total ? Math.round((summary.done / total) * 100) : 0;
  return { ...summary, total, rate };
}

// deterministic, seeded monthly series ending at the student's real current average
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

// real active day count + longest consecutive streak from actual assignment deployment dates the student engaged with
export function calculateLearningConsistency(studentId, period) {
  const dates = usesAssignmentRecords(period)
    ? [...new Set(
      getStudentAssignmentRecords(studentId, period)
        .filter((record) => record.attempted)
        .map((record) => record.date)
    )].sort()
    : getStudentActivityDates(studentId);
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

export function calculatePerformanceTrend(studentId, sampleSize = 6, period) {//trend
  const history = (usesAssignmentRecords(period)
    ? getStudentAssignmentRecords(studentId, period)
      .filter((record) => record.score != null)
      .map(({ date, score }) => ({ date, score }))
    : getStudentScoreHistory(studentId)
  ).slice(-sampleSize);
  if (history.length < 2) return { trend: "no-data", sample: history };

  const mid = Math.floor(history.length / 2);
  const firstHalf = history.slice(0, mid);
  const secondHalf = history.slice(mid);
  const avg = (rows) => rows.reduce((sum, r) => sum + r.score, 0) / rows.length;
  const delta = avg(secondHalf) - avg(firstHalf);

  const trend = delta > 3 ? "improving" : delta < -3 ? "declining" : "stable";
  return { trend, delta: Math.round(delta), sample: history };
}


function insight(type, title, message, priority) {
  return { type, title, message, priority };
}

// the narrative, severity-tagged insight list
export function generateInsights(studentId) {
  const items = [];
  const subjects = calculateSubjectAverages(studentId);
  const best = findBestSubject(studentId);
  const weakest = findWeakestSubject(studentId);
  const monthly = calculateMonthlyImprovement(studentId);
  const completion = calculateCompletionRate(studentId);
  const consistency = calculateLearningConsistency(studentId);
  const trend = calculatePerformanceTrend(studentId);
  const weakStrands = calculateStrandAverages(studentId)
    .filter((strand) => strand.average < PERFORMANCE_THRESHOLDS.onTrack)
    .slice(0, 3);

  if (best) {//best
    items.push(insight("success", "Strongest Learning Area", `${best.name} is currently the learner's strongest learning area, averaging ${best.average}%.`, "low"));
  }
  if (weakest && subjects.length > 1) {
    items.push(insight(
      needsUrgentSupport(weakest.average) ? "warning" : "info",
      "Needs Attention",
      `${weakest.name} is the learner's weakest learning area, averaging ${weakest.average}%.`,
      needsUrgentSupport(weakest.average) ? "high" : "medium"
    ));
  }

  weakStrands.forEach((s) => {//weak
    items.push(insight(
      needsUrgentSupport(s.average) ? "warning" : "info",
      "Strand Needs Attention",
      `${s.strand} (${s.subject}) is averaging ${s.average}%, below the ${PERFORMANCE_THRESHOLDS.onTrack}% target.`,
      needsUrgentSupport(s.average) ? "high" : "medium"
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
    completion.rate >= COMPLETION_THRESHOLDS.excellent ? "success" : completion.rate >= COMPLETION_THRESHOLDS.onTrack ? "info" : "warning",
    "Assignment Completion",
    `${completion.rate}% of assignments have been completed.`,
    completion.rate >= COMPLETION_THRESHOLDS.onTrack ? "low" : "high"
  ));

  if (completion.retake > 0) {//retakes
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

export function generateRecommendations(studentId) {
  const recs = [];
  const subjects = calculateSubjectAverages(studentId);
  const weakest = findWeakestSubject(studentId);
  const best = findBestSubject(studentId);
  const completion = calculateCompletionRate(studentId);

  subjects.forEach((s) => {
    if (needsUrgentSupport(s.average)) {
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

// same calculations as generateInsights() above, reshaped into one card per insight type (id/type/title/description/stat/tone) for a dashboard-style
 
function card(id, type, title, description, stat, tone) {
  return { id, type, title, description, stat, tone };
}

export function calculateInsightCards(studentId, period) {
  const dataPeriod = { source: "assignments", ...(period || {}) };
  const cards = [];
  const subjects = calculateSubjectAverages(studentId, dataPeriod);
  if (!subjects.length) return cards;

  const best = subjects[0];
  const weakest = subjects[subjects.length - 1];
  const trend = calculatePerformanceTrend(studentId, 6, dataPeriod);
  const completion = calculateCompletionRate(studentId, dataPeriod);
  const consistency = calculateLearningConsistency(studentId, dataPeriod);

  const overallAverage = Math.round(subjects.reduce((sum, r) => sum + r.average, 0) / subjects.length);
  const overallTone = performanceTone(overallAverage);

  const windowName = dataPeriod.label || "Period";
  const scopeNote = `Based on work marked this ${windowName.toLowerCase()}, averaged across every learning area.`;
  // "Excellent" is the 95-100 band only. Everything below it - including a very strong 90% uses the ordinary performance wording, so the celebration keeps
  // its meaning,tone still comes from performanceTone(), so a 90% average is presented as "good" (green) without being called excellent but you can change based on your scoring logic/terms
  cards.push(
    overallAverage >= PERFORMANCE_THRESHOLDS.outstanding
      ? card("overall", "excellentPerformance", `Excellent This ${windowName}`, `This learner is in the top band across all learning areas. ${scopeNote}`, `${overallAverage}%`, "good")
      : card("overall", "overallPerformance", `Performance This ${windowName}`, scopeNote, `${overallAverage}%`, overallTone)
  );

  if (best) {
    cards.push(card(
      "best-subject", "bestSubject", "Best Learning Area",
      `${best.name} is this learner's strongest learning area on work marked this ${windowName.toLowerCase()}.`,
      `${best.average}%`, best.average >= PERFORMANCE_THRESHOLDS.onTrack ? "good" : "focus"
    ));
  }

  //a card covers the lowest-scoring learning area in all three bands, always appears, because "which area needs the most practice" is useful
  // even for a learner who is doing well everywhere but a healthy score is never called "weakest". > 50 it is flagged, 50-69 it is a focus area,
  // and at 70+ the wording says outright that nothing here is a weak area.
  if (weakest && subjects.length > 1) {
    const needsWork = weakest.average < PERFORMANCE_THRESHOLDS.onTrack;
    const urgent = needsUrgentSupport(weakest.average);
    const weakestStrand = calculateStrandAverages(studentId, dataPeriod)
      .find((row) => row.subject === weakest.name);
    const strandNote = weakestStrand
      ? ` Within it, ${weakestStrand.strand} is the strand with the most room at ${weakestStrand.average}%.`
      : "";

    cards.push(card(
      "focus-subject", "weakestSubject",
      urgent ? `${weakest.name} Needs Attention` : needsWork ? "Focus Learning Area" : "Most Room to Grow",
      urgent
        ? `${weakest.name} is well below the ${PERFORMANCE_THRESHOLDS.onTrack}% support target for this period.${strandNote}`
        : needsWork
          ? `${weakest.name} is below the ${PERFORMANCE_THRESHOLDS.onTrack}% support target for this period.${strandNote}`
          : `Nothing is a weak area here — every learning area is above the ${PERFORMANCE_THRESHOLDS.onTrack}% target. ${weakest.name} is simply the lowest of a strong set.${strandNote}`,
      `${weakest.average}%`,
      urgent ? "attention" : needsWork ? "focus" : "info"
    ));
  }

  if (trend.trend !== "no-data") {
    const trendIsUp = trend.trend === "improving";
    const trendIsDown = trend.trend === "declining";
    cards.push(card(
      "momentum", trendIsUp ? "monthlyImprovement" : trendIsDown ? "performanceDecline" : "performanceStable",
      "Performance Momentum",
      trendIsUp
        ? `Scores have trended upward across the last ${trend.sample.length} scored assignments.`
        : trendIsDown
          ? `Scores have trended downward across the last ${trend.sample.length} scored assignments.`
          : `Scores have held steady across the last ${trend.sample.length} scored assignments.`,
      trendIsUp ? `+${trend.delta} pts` : trendIsDown ? `${trend.delta} pts` : "Steady",
      trendIsUp ? "good" : trendIsDown ? "attention" : "info"
    ));
  }

  if (completion.pending > 0) {
    cards.push(card(
      "pending", "pendingAssignments", "Pending Assignments",
      `${completion.pending} assignment${completion.pending === 1 ? "" : "s"} still to be started.`,
      String(completion.pending), completion.pending >= 3 ? "attention" : "focus"
    ));
  }

  //hide when no retakes exist, so parents never see an empty action
  if (completion.retake > 0) {
    cards.push(card("retake", "retakeAssignments", "Retake Assignments", `${completion.retake} assignment${completion.retake === 1 ? "" : "s"} marked for retake.`, String(completion.retake), "attention"));
  }

  if (consistency.longestStreak > 0) {
    cards.push(card("streak", "learningStreak", "Learning Consistency", "Longest run of consecutive active learning days in this period.", `${consistency.longestStreak} days`, "info"));
  }

  return cards;
}


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
