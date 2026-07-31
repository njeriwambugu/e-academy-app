import {
  teacherContext,
  getClassMock,
  hash,
  subjectIdsForClass,
  getStudentPerformanceProfile,
  getAssignmentSummary,
  getStudentAssignmentScore,
} from "../data/mock-data.js";
import { formatDurationCompact } from "../utils/duration.js";
import { firstName } from "../utils/string-utils.js";

const { students, subjects, classes } = teacherContext;

function subjectNameById(subjectId) {
  return subjects.find((subject) => subject.id === subjectId)?.name || subjectId;
}

function classNameById(classId) {
  return classes.find((klass) => Number(klass.id) === Number(classId))?.name || "—";
}

function buildPerformance(student) {
  const isPending = student.status === "pending";
  const rows = [];

  subjectIdsForClass(student.classId).forEach((subjectId) => {
    const classData = getClassMock(subjectId, student.classId);

    (classData.assignments || []).forEach((assignment) => {
      const { category, attempted, score } = getStudentAssignmentScore(student.id, subjectId, assignment, isPending);
      const attempts = category === "retake" ? 2 : attempted ? 1 : 0;
      const seed = hash(`${student.id}:${assignment.id}`);
      const timeTaken = attempted ? formatDurationCompact(180 + (seed % 12) * 45) : null;

      rows.push({
        uid: `${subjectId}::${student.classId}::${assignment.id}`,
        name: assignment.name,
        subjectId,
        subject: subjectNameById(subjectId),
        attempts,
        timeTaken,
        score,
        category,
      });
    });
  });

  return rows;
}

function buildStudentProfile(student, teacherSubjectIds = []) {
  if (!student) return null;
  const isPending = student.status === "pending";
  const performance = buildPerformance(student);
  const scored = performance.filter((row) => row.score != null);

  const teacherScored = scored.filter((row) => teacherSubjectIds.includes(row.subjectId));
  const teacherAverage = teacherScored.length
    ? Math.round(teacherScored.reduce((sum, row) => sum + row.score, 0) / teacherScored.length)
    : null;

  const sharedProfile = getStudentPerformanceProfile(student.id);
  const performanceAverage = sharedProfile.average || null;

  return {
    id: student.id,
    name: student.name,
    firstName: firstName(student.name),
    nickname: student.nickname || firstName(student.name),
    admissionNo: student.admissionNo || "",
    classId: student.classId,
    className: classNameById(student.classId),
    status: student.status,
    invite: student.invite || (isPending ? "Pending" : "Accepted"),
    guardianName: student.guardian || "—",
    guardianContact: student.guardianContact || "—",
    engagement: sharedProfile.engagement,
    performanceAverage,
    teacherAverage,
    strongestSubject: sharedProfile.bestSubjectName,
    summary: getAssignmentSummary(student.id),
    scores: sharedProfile.scores,
    classAverage: sharedProfile.classAverage,
    performance: performance.slice(0, 16),
  };
}

export function getStudentProfile(studentId, teacherSubjectIds = []) {
  const student = students.find((item) => String(item.id) === String(studentId));
  return buildStudentProfile(student, teacherSubjectIds);
}
