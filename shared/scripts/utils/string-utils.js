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

export function firstName(name) {
  return String(name || "").trim().split(/\s+/)[0] || name;
}

// "Timothy Kamau" -> "TK". Two letters at most.
export function initials(name = "") {
  return String(name)
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}

export function titleCaseSubject(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .replace(/\bCre\b/g, "CRE");
}
