import {
  teacherContext,
  getClassMock,
  hash,
  subjectIdsForClass,
  getStudentPerformanceProfile,
  getAssignmentSummary,
  getStudentAssignmentScore,
} from "../../../shared/scripts/data/mock-data.js";

const { students, subjects, classes } = teacherContext;

function firstNameOf(name) {
  return String(name).trim().split(/\s+/)[0];
}

function subjectNameById(subjectId) {
  return subjects.find((s) => s.id === subjectId)?.name || subjectId;
}

function classNameById(classId) {
  return classes.find((c) => Number(c.id) === Number(classId))?.name || "\u2014";
}

function fmtDuration(totalSeconds) {//time in m and s
  const seconds = Math.max(0, Number(totalSeconds) || 0);
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m ? `${m}m ${String(s).padStart(2, "0")}s` : `${s}s`;
}

// name, subject and the learner's subject score, attempts and time taken are simulated deterministically (no per-attempt logs exist).
function buildPerformance(student) {
  const isPending = student.status === "pending";
  const rows = [];

  subjectIdsForClass(student.classId).forEach((subjectId) => {
    const classData = getClassMock(subjectId, student.classId);

    (classData.assignments || []).forEach((assignment) => {
      const { category, attempted, score } = getStudentAssignmentScore(student.id, subjectId, assignment, isPending);
      const attempts = category === "retake" ? 2 : attempted ? 1 : 0;
      const seed = hash(`${student.id}:${assignment.id}`);
      const timeTaken = attempted ? fmtDuration(180 + (seed % 12) * 45) : null;

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

  const scored = performance.filter((p) => p.score != null);

  // teacherAverage = only the subject(s) the viewing teacher teaches this
  // student \u2014 deliberately different per viewing teacher, not part of the
  // shared "overall" profile below.
  const teacherScored = scored.filter((p) => teacherSubjectIds.includes(p.subjectId));
  const teacherAverage = teacherScored.length
    ? Math.round(teacherScored.reduce((sum, p) => sum + p.score, 0) / teacherScored.length)
    : null;

  // overall performance/engagement/strongest-subject: the same shared
  // computation admin and parent use for this exact student, so all three
  // portals show the same numbers.
  const sharedProfile = getStudentPerformanceProfile(student.id);
  const performanceAverage = sharedProfile.average || null;
  const strongestSubject = sharedProfile.bestSubjectName;
  const summary = getAssignmentSummary(student.id);
  const engagement = sharedProfile.engagement;

  return {
    id: student.id,
    name: student.name,
    firstName: firstNameOf(student.name),
    nickname: student.nickname || firstNameOf(student.name),
    admissionNo: student.admissionNo || "",
    classId: student.classId,
    className: classNameById(student.classId),
    status: student.status,
    invite: student.invite || (isPending ? "Pending" : "Accepted"),
    guardianName: student.guardian || "\u2014",
    guardianContact: student.guardianContact || "\u2014",
    engagement,
    performanceAverage,
    teacherAverage,
    strongestSubject,
    summary,
    scores: sharedProfile.scores,
    classAverage: sharedProfile.classAverage,
    performance: performance.slice(0, 16), // table shows a capped preview; averages above use the full set
  };
}

export function getStudentProfile(studentId, teacherSubjectIds = []) {
  const student = students.find((s) => String(s.id) === String(studentId));
  return buildStudentProfile(student, teacherSubjectIds);
}
