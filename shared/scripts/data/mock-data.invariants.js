import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import {
  classes,
  teachers,
  teacherContext,
  studentRows,
  subjectIdsForClass,
  getOfferedSubjectCodesForClass,
  getStudentPerformanceProfile,
  getStudentAssignmentRecords,
  getAssignmentSummary,
  getClassMock,
  classDataBySubjectClass,
  subjectLabels,
  isPastDue,
  MOCK_TODAY,
  SUBJECT_CODE_TO_SHARED,
} from "./mock-data.js";
import { calculateSubjectAverages } from "./insights-engine.js";


const failures = [];
let checks = 0;

function check(name, fn) {
  checks++;
  try {
    const detail = fn();
    if (detail) failures.push({ name, detail });
  } catch (error) {
    failures.push({ name, detail: `threw: ${error.message}` });
  }
}


function list(items, max = 5) {
  const shown = items.slice(0, max).join("; ");
  return items.length > max ? `${shown} … (+${items.length - max} more)` : shown;
}

/* shared derivations*/

// imported, not re-declared: a local copy went stale the moment a subject was added
const CODE_TO_SHARED = SUBJECT_CODE_TO_SHARED;
const CHART_SUBJECTS = new Set(Object.values(CODE_TO_SHARED));
const subjects = teacherContext.subjects;
const subjectStudentScores = teacherContext.subjectStudentScores;
const learners = studentRows.filter((s) => s.active);
const classesWithLearners = classes.filter((c) => learners.some((s) => Number(s.classId) === Number(c.id)));
const requiredFor = (classId) => getOfferedSubjectCodesForClass(classId).map((code) => CODE_TO_SHARED[code]);

const allAssignments = Object.values(classDataBySubjectClass).flatMap((d) => d.assignments || []);

/* staffing for teachers */

check("every curriculum subject a class offers has a teacher", () => {
  const bad = [];
  classes.forEach((c) => {
    const staffed = subjectIdsForClass(c.id);
    requiredFor(c.id).forEach((s) => {
      if (!staffed.includes(s)) bad.push(`${s} @ ${c.name}`);
    });
  });
  return bad.length ? `unstaffed: ${list(bad)}` : null;
});


check("insights never add a chart subject the overview omits", () => {
  const bad = [];
  classesWithLearners.forEach((c) => {
    const required = new Set(requiredFor(c.id));
    subjectIdsForClass(c.id).forEach((s) => {
      if (CHART_SUBJECTS.has(s) && !required.has(s)) bad.push(`${s} @ ${c.name}`);
    });
  });
  return bad.length ? list(bad) : null;
});


check("every timetabled subject has stored student scores", () => {
  const bad = [];
  classes.forEach((c) => subjectIdsForClass(c.id).forEach((s) => {
    if (!subjectStudentScores[s]) bad.push(`${s} @ ${c.name}`);
  }));
  return bad.length ? `would fabricate floor scores: ${list([...new Set(bad)])}` : null;
});

check("no learner is scored in a subject their class is not taught", () => {
  const bad = [];
  learners.forEach((s) => {
    const taught = new Set(subjectIdsForClass(s.classId));
    getStudentAssignmentRecords(s.id).forEach((r) => {
      if (!taught.has(r.subjectId)) bad.push(`${s.name}: ${r.subjectId}`);
    });
  });
  return bad.length ? list([...new Set(bad)]) : null;
});

check("no assignment record carries a score without being attempted", () => {
  const bad = [];
  learners.forEach((s) => getStudentAssignmentRecords(s.id).forEach((r) => {
    if (r.score != null && !r.attempted) bad.push(`${s.name}/${r.subject}`);
  }));
  return bad.length ? list(bad) : null;
});


check("learners have genuinely different subject rankings", () => {
  const best = new Set(learners.map((s) => getStudentPerformanceProfile(s.id).bestSubjectName));
  return best.size < 3
    ? `only ${best.size} distinct strongest subject(s) across ${learners.length} learners: ${[...best].join(", ")}`
    : null;
});

check("derivations are stable across calls (no Math.random)", () => {
  const source = readFileSync(fileURLToPath(new URL("./mock-data.js", import.meta.url)), "utf8");
  if (/Math\.random/.test(source)) return "mock-data.js calls Math.random — results will differ per render";
  const sample = learners.slice(0, 5);
  const once = sample.map((s) => JSON.stringify(getAssignmentSummary(s.id)));
  const twice = sample.map((s) => JSON.stringify(getAssignmentSummary(s.id)));
  return once.join() === twice.join() ? null : "repeated calls returned different summaries";
});


check("every assignment has a due date on or after its deploy date", () => {//assigments dates
  const bad = allAssignments
    .filter((a) => !a.due || !a.deployed || new Date(a.due.replace(" ", "T")) < new Date(a.deployed.replace(" ", "T")))
    .map((a) => a.id);
  return bad.length ? list(bad) : null;
});

check("every assignment records the teacher who set it", () => {
  const bad = allAssignments.filter((a) => !a.setBy).map((a) => a.id);
  return bad.length ? list(bad) : null;
});


check("assignment history spans more than one month", () => {
  const months = new Set(allAssignments.map((a) => a.deployed.slice(0, 7)));
  return months.size < 2 ? `all assignments deploy within ${[...months].join(", ")}` : null;
});

check("MOCK_TODAY is the newest deploy date", () => {
  const newest = allAssignments
    .map((a) => a.deployed.slice(0, 10))
    .sort()
    .at(-1);
  const today = `${MOCK_TODAY.getFullYear()}-${String(MOCK_TODAY.getMonth() + 1).padStart(2, "0")}-${String(MOCK_TODAY.getDate()).padStart(2, "0")}`;
  return newest === today ? null : `newest deploy is ${newest} but MOCK_TODAY is ${today}`;
});

check("both overdue and upcoming work exist", () => {
  const past = allAssignments.filter(isPastDue).length;
  const future = allAssignments.length - past;
  if (!past) return `nothing is past due (MOCK_TODAY = ${MOCK_TODAY.toDateString()})`;
  if (!future) return "nothing is still upcoming";
  return null;
});


check("learners collectively have both pending and overdue work", () => {
  let pending = 0, overdue = 0;
  learners.forEach((s) => {
    const x = getAssignmentSummary(s.id);
    pending += x.pending;
    overdue += x.overdue;
  });
  if (!pending) return "no learner has pending work";
  if (!overdue) return "no learner has overdue work";
  return null;
});


check("overview and all-time insights agree where subject sets match", () => {
  const bad = [];
  learners.forEach((s) => {
    const required = new Set(requiredFor(s.classId));
    const staffed = subjectIdsForClass(s.classId);
    if (staffed.some((x) => !required.has(x))) return; // off-chart subjects present

    const overview = getStudentPerformanceProfile(s.id).average;
    const rows = calculateSubjectAverages(s.id, { source: "assignments" });
    if (!rows.length) return;
    const insight = Math.round(rows.reduce((a, r) => a + r.average, 0) / rows.length);
    if (overview !== insight) bad.push(`${s.name}: overview ${overview} vs insights ${insight}`);
  });
  return bad.length ? list(bad) : null;
});

check("subject ids and names are unique", () => {
  const ids = subjects.map((s) => s.id);
  const names = subjects.map((s) => s.name);
  const dupe = (arr) => arr.filter((v, i) => arr.indexOf(v) !== i);
  const bad = [...dupe(ids), ...dupe(names)];
  return bad.length ? list([...new Set(bad)]) : null;
});

// subject abbreviation
const LABEL_ABBREVIATIONS = { CRE: "Christian Religious Education" };

check("chart labels match canonical subject names", () => {
  const bad = [];
  Object.entries(subjectLabels).forEach(([code, label]) => {
    const subject = subjects.find((s) => s.id === CODE_TO_SHARED[code]);
    if (!subject) return bad.push(`${code} has no canonical subject`);
    if (LABEL_ABBREVIATIONS[code]) {
      
      if (LABEL_ABBREVIATIONS[code] !== subject.name) {
        bad.push(`${code}: legend abbreviates "${LABEL_ABBREVIATIONS[code]}" but subject is now "${subject.name}"`);
      }
      return;
    }
    if (subject.name.toUpperCase() !== label.toUpperCase()) {
      bad.push(`${code}: "${label}" vs "${subject.name}"`);
    }
  });
  return bad.length ? list(bad) : null;
});


check("every teacher record points at a real subject and class", () => {
  const subjectIds = new Set(subjects.map((s) => s.id));
  const classIds = new Set(classes.map((c) => Number(c.id)));
  const bad = [];
  teachers.forEach((t) => (t.assignments || []).forEach((a) => {
    if (!subjectIds.has(a.subjectId)) bad.push(`${t.name}: subject ${a.subjectId}`);
    if (!classIds.has(Number(a.classId))) bad.push(`${t.name}: class ${a.classId}`);
  }));
  return bad.length ? list(bad) : null;
});

check("teacher assignment ids are unique", () => {
  const ids = teachers.flatMap((t) => (t.assignments || []).map((a) => a.id));
  const dupe = ids.filter((v, i) => ids.indexOf(v) !== i);
  return dupe.length ? list([...new Set(dupe)]) : null;
});

check("every learner belongs to a real class that has assignments", () => {
  const bad = [];
  learners.forEach((s) => {
    const klass = classes.find((c) => Number(c.id) === Number(s.classId));
    if (!klass) return bad.push(`${s.name}: class ${s.classId} missing`);
    const any = subjectIdsForClass(s.classId).some((sub) => (getClassMock(sub, s.classId).assignments || []).length);
    if (!any) bad.push(`${s.name}: ${klass.name} has no assignments`);
  });
  return bad.length ? list(bad) : null;
});


if (failures.length) {
  console.error(`\n  ${failures.length} of ${checks} invariants FAILED\n`);
  failures.forEach((f) => console.error(`  x ${f.name}\n      ${f.detail}\n`));
  process.exit(1);
}
console.log(`\n  all ${checks} mock-data invariants hold\n`);
