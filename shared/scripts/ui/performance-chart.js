/*
 * One shared "student scores vs class average by subject" chart — the exact
 * SVG design originally built for admin's student-profile page. Admin,
 * teacher, and parent all render this same chart (same structure, same
 * colors, same layout) for the same student instead of three different
 * chart implementations (admin: this SVG; parent: CSS div bars; teacher:
 * no chart at all).
 *
 * labels/scores/classAverage all key off the same 8 subject codes
 * shared/scripts/data/mock-data.js's getStudentPerformanceProfile() already
 * returns, so the numbers plotted are guaranteed to match what admin/parent/
 * teacher show elsewhere for this student.
 */

export function hasAnyScore(labels, scores) {
  return labels.some((label) => Number(scores[label]) > 0);
}

/*
 * The "performance panel" wrapper (heading + badge + chart + legend) was
 * hand-duplicated as static HTML in admin/teacher/parent's index.html (and
 * parent's used a different, unstyled wrapper). This builds that markup
 * once and injects it into whatever empty container each portal points at
 * it — same ids as before (profileChartTitle/profileChart/subjectKey by
 * default) so existing getElementById/$ lookups in each portal's render
 * code keep working unchanged.
 */
export function mountPerformancePanel(container, {
  title = "",
  badge = "Student vs class average",
  titleId = "profileChartTitle",
  chartId = "profileChart",
  keyId = "subjectKey",
} = {}) {
  if (!container) return;
  container.innerHTML = `
    <section class="performance-panel">
      <div class="panel-head">
        <h2 id="${titleId}"></h2>
        <span class="profile-badge">${badge}</span>
      </div>
      <div class="chart-wrap" id="${chartId}"></div>
      <div class="subject-key" id="${keyId}"></div>
    </section>
  `;
  const titleEl = document.getElementById(titleId);
  if (titleEl) titleEl.textContent = title;
}

export function buildPerformanceChartSVG({ labels, scores, classAverage, ariaLabel }) {
  const width = 900;
  const height = 340;
  const pad = { left: 54, right: 26, top: 34, bottom: 48 };
  const chartWidth = width - pad.left - pad.right;
  const chartHeight = height - pad.top - pad.bottom;
  const step = chartWidth / (labels.length - 1);
  const y = (value) => pad.top + chartHeight - ((Number(value) || 0) / 100) * chartHeight;
  const x = (index) => pad.left + index * step;

  const avgPoints = labels.map((label, index) => `${x(index)},${y(classAverage[label])}`).join(" ");

  const bars = labels.map((label, index) => {
    const value = Number(scores[label]) || 0;
    const barHeight = Math.max(0, chartHeight - (y(value) - pad.top));
    const barWidth = 58;
    return `
      <rect x="${x(index) - barWidth / 2}" y="${y(value)}" width="${barWidth}" height="${barHeight}" rx="4" fill="#b66b56" opacity=".86"/>
      <text x="${x(index)}" y="${height - 15}" text-anchor="middle" fill="#20284f" font-size="13" font-weight="800">${label}</text>
    `;
  }).join("");

  const grid = [0, 20, 40, 60, 80, 100].map((value) => `
    <line x1="${pad.left}" x2="${width - pad.right}" y1="${y(value)}" y2="${y(value)}" stroke="#e2e6ef"/>
    <text x="${pad.left - 10}" y="${y(value) + 4}" text-anchor="end" fill="#59617f" font-size="11" font-weight="800">${value}</text>
  `).join("");

  const avgDots = labels.map((label, index) => `
    <circle cx="${x(index)}" cy="${y(classAverage[label])}" r="5" fill="#f48221" stroke="#fff" stroke-width="2"/>
  `).join("");

  return `
    <svg class="performance-chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="${ariaLabel || "Student scores and class average by subject"}">
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

export function buildSubjectKeyHTML(subjectLabels) {
  return Object.entries(subjectLabels).map(([code, label]) => `
    <div class="subject-pill"><span>${code}:</span><span>${label}</span></div>
  `).join("");
}
