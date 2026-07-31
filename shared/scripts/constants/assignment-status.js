export const ASSIGNMENT_CATEGORIES = Object.freeze([
  "done",
  "retake",
  "ongoing",
  "pending",//not started
  "overdue",
]);

export const LEARNER_STATUS_BY_ASSIGNMENT_CATEGORY = Object.freeze({
  done: Object.freeze({ status: "Completed", statusClass: "completed" }),
  retake: Object.freeze({ status: "Retake", statusClass: "retake" }),
  ongoing: Object.freeze({ status: "Ongoing", statusClass: "ongoing" }),
  pending: Object.freeze({ status: "Not Started", statusClass: "not-started" }),
  overdue: Object.freeze({ status: "Not Started", statusClass: "not-started" }),
});

export function assignmentUid({ subjectId, classId, assignmentId }) {
  return `${subjectId}::${classId}::${assignmentId}`;
}
