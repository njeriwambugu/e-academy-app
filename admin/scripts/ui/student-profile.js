// student profile UI: profile panel + assignment summary + performance chart.

import { emptyState } from "../utils/ui.js";

export function initStudentProfileUI({
  subjectLabels,
  elements,
  helpers,
}) {
  const {
    profileName,
    profileSummary,
    profileClassBadge,
    profileInviteBadge,
    profileActiveBadge,
    profileInfoName,
    profileGuardian,
    profileContact,
    profileClassName,
    profileEngagement,
    profilePerformance,
    profileBestSubject,
    profileChartTitle,
    profileChart,
    subjectKey,
  } = elements;

  const { getStudentClassName } = helpers;

  function getBestSubject(student) {
    // real canonical subject name — same one teacher/parent show for this
    // student, not the short admin chart code (e.g. "CAS").
    return student.bestSubjectName || "-";
  }

  function getAssignmentValue(student, key) {
    const summary = student?.assignmentSummary || {};
    const value = summary?.[key];
    return Number.isFinite(Number(value)) ? Number(value) : 0;
  }

  function renderAssignmentSummary(student) {
    const doneEl = document.getElementById("assignmentDone");
    const retakeEl = document.getElementById("assignmentRetake");
    const pendingEl = document.getElementById("assignmentPending");
    const ongoingEl = document.getElementById("assignmentOngoing");
    const overdueEl = document.getElementById("assignmentOverdue");

    if (doneEl) doneEl.textContent = getAssignmentValue(student, "done");
    if (retakeEl) retakeEl.textContent = getAssignmentValue(student, "retake");
    if (pendingEl) pendingEl.textContent = getAssignmentValue(student, "pending");
    if (ongoingEl) ongoingEl.textContent = getAssignmentValue(student, "ongoing");
    if (overdueEl) overdueEl.textContent = getAssignmentValue(student, "overdue");
  }

  function renderPerformanceChart(student) {
    const labels = Object.keys(subjectLabels);
    const scores = student.scores || {};
    const averages = student.classAverage || {};
    const hasScores = labels.some((label) => Number(scores[label]) > 0);

    if (!hasScores && !(student.performance > 0)) {
      profileChart.innerHTML = emptyState(
        "No performance data yet",//
        "Scores will load here once this child has completed activities.",//
      );
      return;
    }

    const width = 900;
    const height = 340;
    const pad = { left: 54, right: 26, top: 34, bottom: 48 };
    const chartWidth = width - pad.left - pad.right;
    const chartHeight = height - pad.top - pad.bottom;
    const step = chartWidth / (labels.length - 1);
    const y = (value) =>
      pad.top + chartHeight - ((Number(value) || 0) / 100) * chartHeight;
    const x = (index) => pad.left + index * step;

    const avgPoints = labels
      .map((label, index) => `${x(index)},${y(averages[label])}`)
      .join(" ");

    const bars = labels
      .map((label, index) => {
        const value = Number(scores[label]) || 0;
        const barHeight = Math.max(0, chartHeight - (y(value) - pad.top));
        const barWidth = 58;
        return `
          <rect x="${x(index) - barWidth / 2}" y="${y(value)}" width="${barWidth}" height="${barHeight}" rx="4" fill="#b66b56" opacity=".86"/>
          <text x="${x(index)}" y="${height - 15}" text-anchor="middle" fill="#20284f" font-size="13" font-weight="800">${label}</text>
        `;
      })
      .join("");

    const grid = [0, 20, 40, 60, 80, 100]
      .map(
        (value) => `
        <line x1="${pad.left}" x2="${width - pad.right}" y1="${y(value)}" y2="${y(value)}" stroke="#e2e6ef"/>
        <text x="${pad.left - 10}" y="${y(value) + 4}" text-anchor="end" fill="#59617f" font-size="11" font-weight="800">${value}</text>
      `,
      )
      .join("");

    const avgDots = labels
      .map(
        (label, index) => `
        <circle cx="${x(index)}" cy="${y(averages[label])}" r="5" fill="#f48221" stroke="#fff" stroke-width="2"/>
      `,
      )
      .join("");

    profileChart.innerHTML = `
        <svg class="performance-chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="Student scores and class average by subject">
          ${grid}
          <text x="${pad.left}" y="17" fill="#20284f" font-size="12" font-weight="900">Scores (%)</text>
          ${bars}
          <polyline points="${avgPoints}" fill="none" stroke="#f48221" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
          ${avgDots}
          <g transform="translate(${width / 2 - 145} 18)">
            <circle cx="0" cy="0" r="6" fill="#b66b56"/>
            <text x="12" y="4" fill="#20284f" font-size="12" font-weight="800">Individual Student Scores</text>
            <circle cx="190" cy="0" r="6" fill="#f48221"/>
            <text x="202" y="4" fill="#20284f" font-size="12" font-weight="800">Class Average</text>
          </g>
        </svg>
      `;
  }

  function renderSubjectKey() {
    subjectKey.innerHTML = Object.entries(subjectLabels)
      .map(
        ([code, label]) => `
        <div class="subject-pill"><span>${code}:</span><span>${label}</span></div>
      `,
      )
      .join("");
  }

  function renderProfile(student) {
    const bestSubject = getBestSubject(student);
    const className = getStudentClassName(student);

    profileName.textContent = student.nickname || student.name;
    profileSummary.textContent =
      student.summary || "Student information is ready for review.";
    profileClassBadge.textContent = className;
    profileInviteBadge.textContent = `Invite ${student.inviteStatus}`;
    profileActiveBadge.textContent = student.active ? "Active" : "Pending";

    profileInfoName.textContent = student.nickname || student.name;
    profileGuardian.textContent = student.guardian || "Not recorded";
    profileContact.textContent = student.contact || "Not recorded";
    profileClassName.textContent = className;

    profileEngagement.textContent = student.engagement || "-";
    profilePerformance.textContent = `${student.performance || 0}%`;
    profileBestSubject.textContent = bestSubject;

    profileChartTitle.textContent = `${student.nickname || student.name}'s Overall Performance`;

    renderAssignmentSummary(student);
    renderPerformanceChart(student);
    renderSubjectKey();
  }

  return {
    renderProfile,
    renderPerformanceChart,
    renderSubjectKey,
    renderAssignmentSummary,
  };
}