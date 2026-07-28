// shared UI helpers

export { escapeHTML, normalizeName, titleCaseSubject } from "../../../shared/scripts/utils/string-utils.js";

export function iconChart() {
  return '<img class="delete-icon" src="assets/icons/user-info.svg" alt="" aria-hidden="true">';
}

export function iconEdit() {
  return '<img class="delete-icon" src="assets/icons/edit.svg" alt="" aria-hidden="true">';
}

export function iconTrash() {
  return '<img class="delete-icon" src="assets/icons/delete-trash.svg" alt="" aria-hidden="true">';
}

export function iconDelete() {
  return '<img class="delete-icon" src="assets/icons/delete-trash.svg" alt="" aria-hidden="true">';
}

export function emptyTable(title, detail, colspan = 4) {
  return `<tr><td class="empty-table-cell" colspan="${colspan}"><div class="empty-state empty-table">${title}<span>${detail}</span></div></td></tr>`;
}

export function emptyState(title, detail = "Skeleton placeholders will appear here when new data is loading.") {
  return `<div class="empty-state">${title}<span>${detail}</span></div>`;
}

export function getAssignmentTeacher(row) {
  return String(row?.[0] || "").trim();
}

export function getAssignmentSubject(row) {
  return String(row?.[1] || "").trim();
}

export function getAssignmentRole(row) {
  return String(row?.[2] || "Main").trim();
}

export function getAssignmentClassName(row, fallbackClassName) {
  return String(row?.[3] || fallbackClassName || "Not recorded").trim();
}

export function getAssignmentClassId(row) {
  return Number(row?.[4]) || "";
}

export function makeAssignmentRow(teacherName, subjectName, role, className, classId) {
  return [
    String(teacherName || "").trim(),
    String(subjectName || "").trim(),
    String(role || "Main").trim(),
    String(className || "Not recorded").trim(),
    Number(classId) || "",
  ];
}