/* shared string helpers used across admin/teacher/parent */

export function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) =>
    ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    })[char],
  );
}

export function normalizeName(value) {
  return String(value || "").trim().toLowerCase();
}

export function titleCaseSubject(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .replace(/\bCre\b/g, "CRE");
}
