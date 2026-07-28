import {
  filters,
  themes,
  heroImages,
  classes as initialClasses,
  teacherRows as initialTeacherRows,
  subjectLabels,
  subjectOptions,
  studentRows as initialStudentRows,
  teacherDirectory as initialTeachers,
  getOfferedSubjectCodesForClass
} from "../../shared/scripts/data/mock-data.js";

import { state, setState, initState } from "./state.js";

import { initDashboardUI } from "./ui/dashboard.js";
import { initClassDetailUI } from "./ui/class-detail.js";
import { initStudentProfileUI } from "./ui/student-profile.js";
import { initTeachersUI } from "./ui/teachers.js";
import { initBulkImportUI } from "./ui/bulk-import.js";
import { initBulkImportParseUI } from "./ui/bulk-import-parse.js";
import { initBulkImportActions } from "./ui/bulk-import-actions.js";

import { navigate } from "./router.js";

import { buildPerformanceChartSVG, buildSubjectKeyHTML, hasAnyScore, mountPerformancePanel } from "../../shared/scripts/ui/performance-chart.js";
import { createLoginGate } from "../../shared/scripts/ui/login-gate.js";
import { maxId } from "../../shared/scripts/utils/id-gen.js";

import {
  iconChart,
  iconEdit,
  iconTrash,
  iconDelete,
  emptyState,
  emptyTable,
  escapeHTML,
  titleCaseSubject,
  normalizeName,
  getAssignmentTeacher,
  getAssignmentSubject,
  getAssignmentRole,
  getAssignmentClassName,
  getAssignmentClassId,
  makeAssignmentRow,
} from "./utils/ui.js";

// working copies (mutated by UI actions). Later, API calls will replace these.
let classes = initialClasses.map(item => ({ ...item }));
export { classes };
const teacherRows = initialTeacherRows.map(row => [...row]);
const studentRows = initialStudentRows.map(item => ({ ...item }));
let teachers = initialTeachers.map(item => ({ ...item }));

initState({ classes });

//change if you want to
const loginIdentity = document.getElementById("loginIdentity");
const forgotPasswordModal = document.getElementById("forgotPasswordModal");
const gradeTabs = document.getElementById("gradeTabs");
const classGrid = document.getElementById("classGrid");
const searchInput = document.getElementById("searchInput");
const breadcrumb = document.getElementById("breadcrumb");
const dashboardView = document.getElementById("dashboardView");
const detailView = document.getElementById("detailView");
const studentProfileView = document.getElementById("studentProfileView");
const teacherProfileView = document.getElementById("teacherProfileView");
const teachersManagementView = document.getElementById("teachersManagementView");
const classSwitcherWrap = document.getElementById("classSwitcherWrap");
const classSwitcher = document.getElementById("classSwitcher");
const tableHead = document.getElementById("tableHead");
const detailTable = document.getElementById("detailTable");
const detailTableWrap = document.getElementById("detailTableWrap");
const studentPanel = document.getElementById("studentPanel");
const detailSearchInput = document.getElementById("detailSearchInput");
const studentStatusFilterInput = document.getElementById("studentStatusFilter");
const addClassModal = document.getElementById("addClassModal");
const addTeacherModal = document.getElementById("addTeacherModal");
const addClassTeacherModal = document.getElementById("addClassTeacherModal");
const addChildModal = document.getElementById("addChildModal");
const editTeacherModal = document.getElementById("editTeacherModal");
const editClassTeacherModal = document.getElementById("editClassTeacherModal");
const editStudentModal = document.getElementById("editStudentModal");
const deleteTeacherModal = document.getElementById("deleteTeacherModal");
const deleteStudentModal = document.getElementById("deleteStudentModal");
const teacherActionsModal = document.getElementById("teacherActionsModal");
const studentActionsModal = document.getElementById("studentActionsModal");
const actionSuccessModal = document.getElementById("actionSuccessModal");
const addClassForm = document.getElementById("addClassForm");
const addTeacherForm = document.getElementById("addTeacherForm");
const addClassTeacherForm = document.getElementById("addClassTeacherForm");
const addChildForm = document.getElementById("addChildForm");
const editTeacherForm = document.getElementById("editTeacherForm");
const editClassTeacherForm = document.getElementById("editClassTeacherForm");
const editStudentForm = document.getElementById("editStudentForm");
const deleteStudentForm = document.getElementById("deleteStudentForm");
const deleteTeacherForm = document.getElementById("deleteTeacherForm");
const teachersTable = document.getElementById("teachersTable");
const teacherSearchInput = document.getElementById("teacherSearchInput");
const teacherSearchBtn = document.getElementById("teacherSearchBtn");
const addTeacherFormBtn = document.getElementById("addTeacherFormBtn");
const teachersManagementBtn = document.getElementById("teachersManagementBtn");
const bulkImportModal = document.getElementById("bulkImportModal");

const importStudentsBtn = document.getElementById("importStudentsBtn");
const bulkImportTeachersBtn = document.getElementById("bulkImportTeachersBtn");

const managedModals = [//all modals
  forgotPasswordModal,
  addClassModal,
  addTeacherModal,
  addClassTeacherModal,
  addChildModal,
  editTeacherModal,
  editClassTeacherModal,
  editStudentModal,
  deleteTeacherModal,
  deleteStudentModal,
  teacherActionsModal,
  studentActionsModal,
  bulkImportModal
];

Modals.configure({
  modals: managedModals,
  beforeOpen: () => closeProfileMenu()
});

mountPerformancePanel(document.getElementById("profilePerformancePanel"));

function iconGrid() {
  return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" aria-hidden="true"><rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/></svg>';
}


function setTheme(themeKey) {
  const theme = themes[themeKey] || themes["grade-1"];
  document.documentElement.style.setProperty("--theme", theme.color);
  document.documentElement.style.setProperty("--theme-soft", theme.soft);
  document.documentElement.style.setProperty("--theme-deep", theme.deep);
}

function renderTabs() {
  gradeTabs.innerHTML = filters.map(filter => `
        <button class="tab ${filter === state.activeFilter ? "active" : ""}" data-filter="${filter}">${filter}</button>
      `).join("");
}

function getVisibleClasses() {
  return classes.filter(item => {
    const matchesFilter = state.activeFilter === "All Classes" || item.group === state.activeFilter;
    const matchesSearch = item.name.toLowerCase().includes(state.activeSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });
}

function renderCards() {
  const visible = getVisibleClasses();
  classGrid.innerHTML = visible.map((item, index) => {
    const theme = themes[item.theme];
    const delay = Math.min(index * 45, 360);
    return `
          <button class="class-card ${theme.className}" data-class-id="${item.id}">
            <span class="shape" aria-hidden="true"></span>
            <span class="shape small" aria-hidden="true"></span>
            <span class="shape tiny" aria-hidden="true"></span>
            <span class="shape ghost" aria-hidden="true"></span>
            <span class="class-name tracking-in-expand anim-delay-${delay}">${item.name}</span>
            <span class="student-count">${item.students} students</span>
          </button>
        `;
  }).join("");

  if (!visible.length) {
    classGrid.innerHTML = emptyState("No class found", "Try another search or add a class.");
  }
}

function updateStats() {
  document.getElementById("totalClasses").textContent = classes.length;
  document.getElementById("totalStudents").textContent = classes.reduce((sum, item) => sum + item.students, 0);
}

function setActiveView(view) {

  [dashboardView, detailView, studentProfileView, teacherProfileView, teachersManagementView].forEach(item => {
    item.classList.toggle("active", item === view);
    item.classList.remove("loading");
  });

  view.classList.add("loading");
  window.setTimeout(() => view.classList.remove("loading"), 1000);
}

function setBreadcrumb(items) {
  breadcrumb.innerHTML = items.map((item, index) => {
    const isLast = index === items.length - 1;
    const separator = index < items.length - 1 ? "<span>/</span>" : "";
    if (item.action && !isLast) {
      return `<button type="button" data-breadcrumb="${item.action}">${item.label}</button>${separator}`;
    }
    return `<span class="${isLast ? "current" : ""}">${item.label}</span>${separator}`;
  }).join("");
}


function getUniqueDetailCount(cellIndex) {
  return new Set(
    teacherRows
      .map(row => String(row[cellIndex] || "").trim())
      .filter(Boolean)
  ).size;
}

function updateDetailStats() {
  const studentTotal = state.currentClass ? state.currentClass.students : studentRows.length;
  document.getElementById("detailStudentNumber").textContent = studentTotal;
  document.getElementById("detailSubjectNumber").textContent = getUniqueDetailCount(1);
  document.getElementById("detailTeacherNumber").textContent = getUniqueDetailCount(0);
}


function addUnique(list, value) {
  const cleanValue = String(value || "").trim();
  if (!cleanValue) return list || [];
  const nextList = Array.isArray(list) ? list : [];
  if (!nextList.some(item => normalizeName(item) === normalizeName(cleanValue))) {
    nextList.push(cleanValue);
  }
  return nextList;
}

function uniqueValues(values) {
  const seen = new Set();
  return values
    .map(value => String(value || "").trim())
    .filter(value => {
      const key = normalizeName(value);
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

function getTeacherRowAssignments(teacher) {
  return teacherRows
    .filter(row => normalizeName(getAssignmentTeacher(row)) === normalizeName(teacher?.name))
    .map(row => ({
      subject: getAssignmentSubject(row),
      className: getAssignmentClassName(row, state.currentClass?.name),
      classId: getAssignmentClassId(row),
      role: getAssignmentRole(row)
    }));
}

function getTeacherBaseAssignments(teacher) {
  return (teacher?.assignments || []).map(item => ({
    subject: String(item.subject || "").trim(),
    className: String(item.className || "").trim(),
    classId: Number(item.classId) || "",
    role: String(item.role || "Main").trim()
  }));
}

function getTeacherAssignments(teacher) {
  const seen = new Set();
  return [...getTeacherBaseAssignments(teacher), ...getTeacherRowAssignments(teacher)]
    .filter(item => item.subject && item.className)
    .filter(item => {
      const key = `${normalizeName(item.subject)}|${normalizeName(item.className)}|${normalizeName(item.role)}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

function getTeacherSubjectNames(teacher) {
  return uniqueValues([
    ...(teacher?.subjects || []),
    ...getTeacherAssignments(teacher).map(item => item.subject)
  ]);
}

function getTeacherClassNames(teacher) {
  return uniqueValues([
    ...(teacher?.classes || []),
    ...getTeacherAssignments(teacher).map(item => item.className)
  ]);
}

function getTeacherSubjectGroups(teacher) {
  const assignments = getTeacherAssignments(teacher);
  const allClasses = getTeacherClassNames(teacher);
  return getTeacherSubjectNames(teacher).map(subject => {
    let subjectAssignments = assignments.filter(item => normalizeName(item.subject) === normalizeName(subject));
    if (!subjectAssignments.length && allClasses.length) {
      subjectAssignments = allClasses.map(className => ({ subject, className, role: "Main" }));
    }
    return {
      subject,
      assignments: subjectAssignments
    };
  });
}

function findTeacherIndexByName(name) {
  const target = normalizeName(name);
  return teachers.findIndex(teacher => normalizeName(teacher.name) === target);
}

function ensureTeacherProfileFromAssignment(assignmentIndex) {
  const row = teacherRows[Number(assignmentIndex)];
  if (!row) return -1;
  const teacherName = getAssignmentTeacher(row);
  let teacherIndex = findTeacherIndexByName(teacherName);
  if (teacherIndex === -1) {
    teachers.push({
      id: maxId(teachers) + 1,
      name: teacherName,
      contact: "Not recorded",
      email: "",
      subjects: [],
      classes: [],
      assignments: []
    });
    teacherIndex = teachers.length - 1;
  }
  return teacherIndex;
}

function openTeacherProfileFromAssignment(assignmentIndex) {
  const teacherIndex = ensureTeacherProfileFromAssignment(assignmentIndex);
  if (teacherIndex >= 0) showTeacherProfile(teacherIndex);
}

function getStudentClassId(student) {
  return Number(student?.classId) || state.currentClass?.id || classes[0]?.id || "";
}

function getStudentClassName(student) {
  const studentClass = classes.find(item => item.id === Number(getStudentClassId(student)));
  return studentClass?.name || state.currentClass?.name || "Not recorded";
}

function renderStudentClassOptions(selectedClassId) {
  editStudentForm.elements.classId.innerHTML = classes.map(item => `
        <option value="${item.id}" ${Number(selectedClassId) === item.id ? "selected" : ""}>${item.name}</option>
      `).join("");
}

function getTeacherNameOptions() {
  return uniqueValues([
    ...teachers.map(teacher => teacher.name),
    ...teacherRows.map(row => getAssignmentTeacher(row))
  ]);
}

function getSubjectNameOptions() {
  return uniqueValues([
    ...subjectOptions,
    ...Object.values(subjectLabels).map(titleCaseSubject),
    ...teachers.flatMap(teacher => teacher.subjects || []),
    ...teacherRows.map(row => getAssignmentSubject(row))
  ]);
}

function getAutocompleteMatches(term, options) {
  const searchTerm = normalizeName(term);
  if (!searchTerm) return [];
  return uniqueValues(options)
    .filter(value => normalizeName(value).includes(searchTerm))
    .sort((first, second) => {
      const firstName = normalizeName(first);
      const secondName = normalizeName(second);
      const firstStarts = firstName.startsWith(searchTerm) ? 0 : 1;
      const secondStarts = secondName.startsWith(searchTerm) ? 0 : 1;
      if (firstStarts !== secondStarts) return firstStarts - secondStarts;
      return first.localeCompare(second);
    })
    .slice(0, 5);
}

const suggestionLists = [];

function closeSuggestionList(list) {
  if (!list) return;
  list.classList.remove("open");
  list.innerHTML = "";
  const input = document.querySelector(`[aria-controls="${list.id}"]`);
  input?.setAttribute("aria-expanded", "false");
}

function closeAllSuggestions(exceptList = null) {
  suggestionLists.forEach(list => {
    if (list !== exceptList) closeSuggestionList(list);
  });
}

function attachAutocomplete(input, list, getOptions) {
  if (!input || !list) return;
  suggestionLists.push(list);
  let activeIndex = -1;

  function choose(value) {
    input.value = value;
    closeSuggestionList(list);
    input.dispatchEvent(new Event("change", { bubbles: true }));
  }

  function render() {
    const matches = getAutocompleteMatches(input.value, getOptions());
    activeIndex = matches.length ? Math.min(activeIndex, matches.length - 1) : -1;
    closeAllSuggestions(list);
    if (!matches.length) {
      closeSuggestionList(list);
      return;
    }
    list.innerHTML = matches.map((value, index) => `
          <button class="suggestion-option ${index === activeIndex ? "active" : ""}" type="button" role="option" data-value="${escapeHTML(value)}">
            ${escapeHTML(value)}
          </button>
        `).join("");
    const inputRect = input.getBoundingClientRect();
    const modal = input.closest(".modal-form");
    const modalRect = modal ? modal.getBoundingClientRect() : null;

    const viewportSpaceBelow = window.innerHeight - inputRect.bottom;
    const modalSpaceBelow = modalRect ? (modalRect.bottom - inputRect.bottom) : viewportSpaceBelow;
    const spaceBelow = Math.min(viewportSpaceBelow, modalSpaceBelow);

    if (spaceBelow < 220) {
      list.classList.add("upward");
    } else {
      list.classList.remove("upward");
    }

    list.classList.add("open");
    input.setAttribute("aria-expanded", "true");
  }

  input.setAttribute("aria-expanded", "false");
  input.addEventListener("input", render);
  input.addEventListener("focus", render);
  input.addEventListener("keydown", event => {
    const options = Array.from(list.querySelectorAll(".suggestion-option"));
    if (!options.length && !["Escape", "Tab"].includes(event.key)) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      activeIndex = (activeIndex + 1) % options.length;
      render();
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      activeIndex = activeIndex <= 0 ? options.length - 1 : activeIndex - 1;
      render();
      return;
    }

    if (event.key === "Enter" && activeIndex >= 0 && options[activeIndex]) {
      event.preventDefault();
      choose(options[activeIndex].dataset.value);
      return;
    }

    if (event.key === "Escape" || event.key === "Tab") {
      closeSuggestionList(list);
    }
  });

  list.addEventListener("mousedown", event => {
    const option = event.target.closest(".suggestion-option");
    if (!option) return;
    event.preventDefault();
    choose(option.dataset.value);
  });
}

attachAutocomplete(addClassTeacherForm?.elements.teacherName, document.getElementById("addTeacherNameSuggestions"), getTeacherNameOptions);
attachAutocomplete(addClassTeacherForm?.elements.subjectName, document.getElementById("addSubjectNameSuggestions"), getSubjectNameOptions);
attachAutocomplete(editClassTeacherForm?.elements.teacherName, document.getElementById("editTeacherNameSuggestions"), getTeacherNameOptions);
attachAutocomplete(editClassTeacherForm?.elements.subjectName, document.getElementById("editSubjectNameSuggestions"), getSubjectNameOptions);

document.addEventListener("click", event => {
  if (!event.target.closest(".suggest-field")) closeAllSuggestions();
});

export function showDashboard() {
  navigate({ view: null }, { replace: true });
  setTheme("grade-1");
  setActiveView(dashboardView);
  setBreadcrumb([{ label: "Dashboard" }, { label: "All Classes" }]);
}

export function openClass(item, options = {}) {
  setState({ currentClass: item });
  navigate({ view: "class", classId: item.id, panel: options.panel || null }, { replace: false });
  const theme = themes[item.theme];
  setTheme(item.theme);
  if (options.panel) {
    setState({ activePanel: options.panel });
    document.querySelectorAll(".segment").forEach(segment => segment.classList.toggle("active", segment.dataset.panel === state.activePanel));
  }
  setActiveView(detailView);
  setBreadcrumb([
    { label: "Dashboard", action: "dashboard" },
    { label: item.name }
  ]);
  const detailTitle = document.getElementById("detailTitle");
  detailTitle.textContent = item.name;
  detailTitle.classList.remove("title-animate");
  void detailTitle.offsetWidth;
  detailTitle.classList.add("title-animate");
  const detailStudents = document.getElementById("detailStudents");
  if (detailStudents) detailStudents.textContent = `${item.students} Students`;
  document.getElementById("detailStudentNumber").textContent = item.students;
  const heroArt = document.getElementById("heroArt");
  if (heroImages[item.theme]) {
    heroArt.style.display = "block";
    heroArt.src = heroImages[item.theme];
    heroArt.alt = `${item.group} artwork`;
  } else {
    heroArt.style.display = "none";
  }
  document.querySelectorAll(".hero .shape").forEach(shape => {
    const waveClass = ["one", "two", "three", "four", "five", "six"].find(name => shape.classList.contains(name)) || "one";
    shape.className = `shape hero-shape ${waveClass}`;
    shape.classList.add(theme.className);
  });
  const studentMark = document.getElementById("studentMark");
  studentMark.className = "stat-mark";
  renderDetailTable();
}

export function openClassById(classId, options = {}) {
  const item = classes.find(c => c.id === Number(classId));
  if (!item) {
    showDashboard();
    return;
  }
  openClass(item, options);
}

function renderDetailTable() {
  const addButton = document.getElementById("detailAddBtn");
  const isTeacherPanel = state.activePanel === "teachers";
  detailTableWrap.dataset.panel = state.activePanel;
  updateDetailStats();
  studentPanel.classList.toggle("active", !isTeacherPanel);
  studentStatusFilterInput.disabled = isTeacherPanel;
  detailSearchInput.placeholder = isTeacherPanel ? "Search teachers or subjects" : "Search students";
  if (state.activePanel === "teachers") {
    addButton.textContent = "Add teacher to subjects +";
    if (importStudentsBtn) importStudentsBtn.hidden = true;
    tableHead.innerHTML = '<th>Teacher Name</th><th>Subject</th><th>Actions</th>';
    const visibleTeachers = getVisibleTeachers();
    detailTable.innerHTML = visibleTeachers.map(({ row, index }) => {
      const teacherName = getAssignmentTeacher(row);
      const subjectName = getAssignmentSubject(row);
      return `
            <tr>
              <td data-label="Teacher Name"><button class="teacher-name-link" type="button" data-teacher-profile="${index}" data-teacher-name="${escapeHTML(teacherName)}" data-teacher-subject="${escapeHTML(subjectName)}">${escapeHTML(teacherName)}</button></td>
              <td data-label="Subject">${escapeHTML(subjectName)}</td>
              <td data-label="Actions"><button class="remove" data-teacher-index="${index}" data-teacher-action="delete" data-teacher-name="${escapeHTML(teacherName)}" title="Delete teacher" aria-label="Delete ${escapeHTML(teacherName)}">${iconDelete()}</button></td>
            </tr>
          `;
    }).join("");
    if (!visibleTeachers.length) {
      detailTable.innerHTML = emptyTable("No subject found", "Try another search or add a teacher to this subject list.", 3);
    }
  } else {
    addButton.textContent = "Add student +";
    if (importStudentsBtn) importStudentsBtn.hidden = false;
    tableHead.innerHTML = '<th class="col-name">Name</th><th class="col-invite">Invite Status</th><th class="col-active">Active</th><th class="col-actions">Actions</th>';
    renderStudentSummary();
    const visibleStudents = getVisibleStudents();
    detailTable.innerHTML = visibleStudents.map(({ student, index }) => {
      const invitePending = student.inviteStatus !== "Accepted";
      return `
            <tr>
              <td class="col-name" data-label="Name">
                <button class="student-link" data-student-profile="${student.id}">
                  <!--<span aria-hidden="true">🎓</span> add a profile avatar if you need to-->
                  <span>${student.name}</span>
                </button>
              </td>
              <td class="col-invite" data-label="Invite Status"><span class="invite-icon ${invitePending ? "pending" : ""}">${invitePending ? "⧖" : "✓"}</span></td>
              <td class="col-active" data-label="Active"><span class="student-chip"><span class="status-dot ${student.active ? "" : "pending"}"></span>${student.active ? "Active" : "Pending"}</span></td>
              <td class="col-actions">
                <div class="student-actions">
                  <button class="icon-action" data-student-profile="${student.id}" title="View progress" aria-label="View ${student.name} progress">${iconChart()}</button>
                  <button class="icon-action muted" data-edit-student="${index}" title="Edit student" aria-label="Edit ${student.name}">${iconEdit()}</button>
                  <button class="icon-action danger" data-remove-student="${index}" title="Delete student" aria-label="Delete ${student.name}">${iconTrash()}</button>
                </div>
              </td>
            </tr>
          `;
    }).join("");
    if (!visibleStudents.length) {
      detailTable.innerHTML = emptyTable("No student found", "Adjust the filter, clear search, or add a student.", 4);
    }
  }
}

function getVisibleTeachers() {
  return teacherRows.map((row, index) => ({ row, index })).filter(({ row }) => {
    const text = `${getAssignmentTeacher(row)} ${getAssignmentSubject(row)} ${getAssignmentClassName(row, state.currentClass?.name)}`.toLowerCase();
    return text.includes(state.detailSearch.toLowerCase());
  });
}

function getVisibleStudents() {
  return studentRows.map((student, index) => ({ student, index })).filter(({ student }) => {
    const status = student.active ? "active" : "pending";
    const matchesSearch = student.name.toLowerCase().includes(state.detailSearch.toLowerCase());
    const matchesStatus = state.studentStatusFilter === "all" || state.studentStatusFilter === status;
    return matchesSearch && matchesStatus;
  });
}

function renderStudentSummary() {
  document.getElementById("studentInvitesSent").textContent = studentRows.length;
  document.getElementById("studentInvitesAccepted").textContent = studentRows.filter(student => student.inviteStatus === "Accepted").length;
  document.getElementById("studentActiveTotal").textContent = studentRows.filter(student => student.active).length;
  renderClassAssignmentSummary();
  document.querySelectorAll(".student-summary-card").forEach(card => {
    card.classList.remove("summary-animate");
    void card.offsetWidth;
    card.classList.add("summary-animate");
  });
}

function sumAssignment(studentList, key) {
  return (studentList || []).reduce((acc, student) => acc + getAssignmentValue(student, key), 0);
}

function renderClassAssignmentSummary() {
  const summaryWrap = document.getElementById("classAssignmentSummary");
  if (!summaryWrap) return;

  // For now: treat as class-level total using current mock studentRows
  const list = studentRows;

  const doneEl = document.getElementById("classAssignmentDone");
  const retakeEl = document.getElementById("classAssignmentRetake");
  const pendingEl = document.getElementById("classAssignmentPending");
  const ongoingEl = document.getElementById("classAssignmentOngoing");
  const overdueEl = document.getElementById("classAssignmentOverdue");

  if (doneEl) doneEl.textContent = sumAssignment(list, "done");
  if (retakeEl) retakeEl.textContent = sumAssignment(list, "retake");
  if (pendingEl) pendingEl.textContent = sumAssignment(list, "pending");
  if (ongoingEl) ongoingEl.textContent = sumAssignment(list, "ongoing");
  if (overdueEl) overdueEl.textContent = sumAssignment(list, "overdue");
}

export function openStudentProfile(studentId) {
  const studentIndex = studentRows.findIndex(row => row.id === Number(studentId));
  const student = studentRows[studentIndex];
  if (!student) return;
  setState({ currentStudentIndex: studentIndex });
  navigate({ view: "student", classId: state.currentClass?.id || null, studentId: student.id, panel: "students" }, { replace: false });
  setActiveView(studentProfileView);
  const classLabel = state.currentClass?.name || getStudentClassName(student);
  setBreadcrumb([
    { label: "Dashboard", action: "dashboard" },
    { label: classLabel, action: "class" },
    { label: student.name }
  ]);
  renderProfile(student);
}

export function showTeachersManagement() {
  navigate({ view: "teachers" }, { replace: false });
  setTheme("teacher");
  setActiveView(teachersManagementView);
  setBreadcrumb([{ label: "Dashboard", action: "dashboard" }, { label: "Teachers Management" }]);
  renderTeachersTable();
}

function renderTeachersTable() {
  const searchTerm = teacherSearchInput.value.toLowerCase();
  const filtered = teachers.filter(teacher => {
    const searchText = `${teacher.name} ${teacher.contact} ${getTeacherSubjectNames(teacher).join(" ")}`.toLowerCase();
    return searchText.includes(searchTerm);
  });

  teachersTable.innerHTML = filtered.map((teacher, displayIndex) => {
    const actualIndex = teachers.indexOf(teacher);
    return `
          <tr>
            <td data-label="Teacher Name">
              <button class="teacher-name-link" type="button" data-view-teacher="${actualIndex}">${escapeHTML(teacher.name)}</button>
            </td>
            <td data-label="Contact">
              <span class="inline-value">${escapeHTML(teacher.contact || "—")}</span>
            </td>
            <td data-label="Actions">
              <div class="mgmt-actions">
                <button class="icon-action" type="button" data-edit-teacher="${actualIndex}" title="Edit teacher" aria-label="Edit ${escapeHTML(teacher.name)}">${iconEdit()}</button>
                <button class="icon-action danger" type="button" data-delete-teacher="${actualIndex}" title="Delete teacher" aria-label="Delete ${escapeHTML(teacher.name)}">${iconTrash()}</button>
              </div>
            </td>
          </tr>
        `;
  }).join("");

  if (!filtered.length) {
    teachersTable.innerHTML = emptyTable("No teacher found", "Try another search or add a teacher.", 3);
  }
}

let editingTeacherIndexManagement = null;
let pendingDeleteTeacherIndex = null;

function openTeacherManagementEditModal(index, field = "name") {
  const teacher = teachers[index];
  if (!teacher) return;
  editingTeacherIndexManagement = index;
  document.getElementById("editTeacherName").value = teacher.name;
  document.getElementById("editTeacherContact").value = teacher.contact;
  Modals.open(editTeacherModal);
  const focusTarget = field === "contact" ? document.getElementById("editTeacherContact") : document.getElementById("editTeacherName");
  window.setTimeout(() => focusTarget?.focus(), 80);
}

function openDeleteTeacherModal(index) {
  const teacher = teachers[index];
  if (!teacher) return;
  pendingDeleteTeacherIndex = index;
  const message = document.getElementById("deleteTeacherMessage");
  if (message) message.textContent = `Are you sure you want to delete ${teacher.name}?`;
  Modals.open(deleteTeacherModal);
}

function showTeacherProfile(index) {
  const teacher = teachers[index];
  if (!teacher) return;
  setState({ currentTeacherIndex: index });
  setTheme("teacher");
  setActiveView(teacherProfileView);
  setBreadcrumb([{ label: "Dashboard", action: "dashboard" }, { label: "Teachers", action: "teachers" }, { label: teacher.name }]);
  renderTeacherProfile(teacher);
}

function renderTeacherProfile(teacher) {
  document.getElementById("teacherProfileName").textContent = teacher.name;
  document.getElementById("teacherProfileInfoContact").textContent = teacher.contact || "—";
  document.getElementById("teacherProfileInfoEmail").textContent = teacher.email || "—";
  const subjectGroups = getTeacherSubjectGroups(teacher);
  const classNames = getTeacherClassNames(teacher);
  document.getElementById("teacherProfileSubjectBadge").textContent = `${subjectGroups.length} Subjects`;
  document.getElementById("teacherProfileClassBadge").textContent = `${classNames.length} Classes`;

  const subjectsContainer = document.getElementById("teacherProfileSubjects");
  if (subjectGroups.length > 0) {
    subjectsContainer.innerHTML = subjectGroups.map(group => `
          <section class="profile-subject-card">
            <div class="profile-subject-title">${escapeHTML(group.subject)}</div>
            <div class="profile-class-list">
              ${group.assignments.length ? group.assignments.map(assignment => `
                <div class="profile-class-row">
                  <button class="class-nav-btn" data-class-name="${escapeHTML(assignment.className)}">${escapeHTML(assignment.className)}</button>
                  <strong>${escapeHTML(assignment.role)}</strong>
                </div>
              `).join("") : `<div class="profile-class-empty">No class connected yet</div>`}
            </div>
          </section>
        `).join("");

    // Add event listeners to class navigation buttons
    subjectsContainer.querySelectorAll(".class-nav-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const className = btn.dataset.className;
        navigateToClass(className);
      });
    });
  } else {
    subjectsContainer.innerHTML = "<div class='profile-tag'>No subjects assigned</div>";
  }
}

function navigateToClass(className) {
  const classItem = classes.find(c => c.name === className);
  if (classItem) {
    openClass(classItem);
  }
}

function renderProfile(student) {
  const bestSubject = getBestSubject(student);
  const className = getStudentClassName(student);
  document.getElementById("profileName").textContent = student.nickname || student.name;
  document.getElementById("profileSummary").textContent = student.summary || "Student information is ready for review.";
  document.getElementById("profileClassBadge").textContent = className;
  document.getElementById("profileInviteBadge").textContent = `Invite ${student.inviteStatus}`;
  document.getElementById("profileActiveBadge").textContent = student.active ? "Active" : "Pending";
  document.getElementById("profileInfoName").textContent = student.nickname || student.name;
  document.getElementById("profileGuardian").textContent = student.guardian || "Not recorded";
  document.getElementById("profileContact").textContent = student.contact || "Not recorded";
  document.getElementById("profileClassName").textContent = className;
  document.getElementById("profileEngagement").textContent = student.engagement || "-";
  document.getElementById("profilePerformance").textContent = `${student.performance || 0}%`;
  document.getElementById("profileBestSubject").textContent = bestSubject;
  document.getElementById("profileChartTitle").textContent = `${student.nickname || student.name}'s Overall Performance`;
  renderAssignmentSummary(student);
  renderPerformanceChart(student);
  renderSubjectKey(student);
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

function getBestSubject(student) {
  // real canonical subject name — same one teacher/parent show for this
  // student, not the short admin chart code (e.g. "CAS").
  return student.bestSubjectName || "-";
}

function renderPerformanceChart(student) {
  // only the subjects this student's grade band actually offers — a PP1/
  // lower-primary student never had SS/SCI/AGRI scores to begin with.
  const labels = getOfferedSubjectCodesForClass(student.classId);
  const scores = student.scores || {};
  const averages = student.classAverage || {};
  if (!hasAnyScore(labels, scores) && !(student.performance > 0)) {
    document.getElementById("profileChart").innerHTML = emptyState("No performance data yet", "Scores will load here once this child has completed activities.");
    return;
  }
  document.getElementById("profileChart").innerHTML = buildPerformanceChartSVG({ labels, scores, classAverage: averages });
}

function renderSubjectKey(student) {
  const offered = getOfferedSubjectCodesForClass(student.classId);
  const filteredLabels = Object.fromEntries(
    Object.entries(subjectLabels).filter(([code]) => offered.includes(code))
  );
  document.getElementById("subjectKey").innerHTML = buildSubjectKeyHTML(filteredLabels);
}

function createDefaultStudent() {
  return {
    id: Date.now(),
    name: "New Student",
    nickname: "New Student",
    guardian: "Not recorded",
    contact: "Not recorded",
    inviteStatus: "Pending",
    active: false,
    engagement: "-",
    performance: 0,
    summary: "Invite is pending. Performance and engagement data will appear after class activity begins.",
    scores: { MAT: 0, ENG: 0, KIS: 0, CRE: 0, CAS: 0, SS: 0, SCI: 0, AGRI: 0 },
    classAverage: { MAT: 68, ENG: 74, KIS: 78, CRE: 80, CAS: 72, SS: 66, SCI: 77, AGRI: 71 }
  };
}

function groupToTheme(group) {
  return group.toLowerCase().replace(" ", "-");
}

let pendingDeleteIndex = null;
let editingTeacherIndex = null;
let editingStudentIndex = null;

function showActionSuccess(title, subtitle, isError = false) {
  const modal = document.getElementById("actionSuccessModal");
  const titleEl = document.getElementById("actionSuccessTitle");
  const subtitleEl = document.getElementById("actionSuccessSubtitle");
  const tickEl = modal?.querySelector(".login-success-tick img");

  titleEl.textContent = title;
  subtitleEl.textContent = subtitle;

  if (isError) {
    if (tickEl) tickEl.src = "assets/icons/alert.svg"; // or you can use a different icon
    modal?.classList.add("error-modal");
  } else {
    if (tickEl) tickEl.src = "assets/icons/check-mark.svg";
    modal?.classList.remove("error-modal");
  }

  Modals.showTransient(actionSuccessModal, { duration: 1100 });
}

function refreshStudentCountsAfterDelete() {
  if (!state.currentClass) return;
  state.currentClass.students = Math.max(0, state.currentClass.students - 1);
  document.getElementById("detailStudentNumber").textContent = state.currentClass.students;
  const detailStudents = document.getElementById("detailStudents");
  if (detailStudents) detailStudents.textContent = `${state.currentClass.students} Students`;
  renderCards();
  updateStats();
}

function setTeacherActionsMode(mode, teacherIndex) {
  const row = teacherRows[Number(teacherIndex)];
  if (!row) return false;

  const isDelete = mode === "delete";
  const title = document.getElementById("teacherActionsTitle");
  const meta = document.getElementById("teacherActionsMeta");
  const menu = document.getElementById("teacherActionsMenu");
  const deleteConfirm = document.getElementById("teacherDeleteConfirm");
  const actionsFooter = document.getElementById("teacherActionsFooter");
  const deleteFooter = document.getElementById("teacherDeleteFooter");
  const editButton = document.getElementById("editTeacherBtn");
  const deleteButton = document.getElementById("deleteTeacherBtn");
  const confirmButton = document.getElementById("confirmTeacherDeleteBtn");

  teacherActionsModal.dataset.mode = isDelete ? "delete" : "menu";
  title.textContent = isDelete ? "Delete Teacher" : getAssignmentTeacher(row);
  meta.textContent = isDelete ? `Are you sure you want to delete ${getAssignmentTeacher(row)}?` : getAssignmentSubject(row);
  menu.hidden = isDelete;
  deleteConfirm.hidden = !isDelete;
  actionsFooter.hidden = isDelete;
  deleteFooter.hidden = !isDelete;
  editButton.dataset.teacherIndex = teacherIndex;
  deleteButton.dataset.teacherIndex = teacherIndex;
  confirmButton.dataset.teacherIndex = teacherIndex;
  confirmButton.disabled = false;
  return true;
}

function openTeacherActionsModal(button) {
  const teacherIndex = Number(button.dataset.teacherIndex);
  const row = teacherRows[teacherIndex];
  if (!row) return;

  setTeacherActionsMode(button.dataset.teacherAction === "delete" ? "delete" : "menu", teacherIndex);
  Modals.open(teacherActionsModal);
}

function openEditClassTeacherModal(teacherIndex) {
  const row = teacherRows[Number(teacherIndex)];
  if (!row) return;

  editingTeacherIndex = Number(teacherIndex);
  editClassTeacherForm.elements.teacherName.value = getAssignmentTeacher(row);
  editClassTeacherForm.elements.subjectName.value = getAssignmentSubject(row);
  editClassTeacherForm.elements.teacherRole.value = getAssignmentRole(row);
  closeAllSuggestions();
  Modals.open(editClassTeacherModal);
}

function openStudentActionsModal(button) {
  const studentIndex = button.dataset.studentIndex ?? button.dataset.removeStudent ?? button.dataset.editStudent;
  const student = studentRows[Number(studentIndex)];
  if (!student) return;

  document.getElementById("studentActionsName").textContent = student.name;
  document.getElementById("studentActionsStatus").textContent = student.active ? "Active" : "Pending";
  document.getElementById("editStudentBtn").dataset.studentIndex = studentIndex;
  document.getElementById("deleteStudentBtn").dataset.studentIndex = studentIndex;
  document.getElementById("deleteStudentBtn").dataset.studentName = student.name;

  Modals.open(studentActionsModal);
}

function openDeleteStudentModal(button) {
  const studentIndex = button.dataset.removeStudent;
  const student = studentRows[Number(studentIndex)];
  if (!student) return;
  pendingDeleteIndex = studentIndex;
  document.getElementById("deleteStudentMessage").textContent = `Are you sure you want to delete ${student.name}?`;
  Modals.open(deleteStudentModal);
}

function openEditStudentModal(studentIndex, field = "name") {
  const student = studentRows[Number(studentIndex)];
  if (!student) return;

  editingStudentIndex = Number(studentIndex);
  editStudentForm.elements.studentName.value = student.name || "";
  editStudentForm.elements.nickname.value = student.nickname || "";
  renderStudentClassOptions(getStudentClassId(student));
  Modals.open(editStudentModal);
  const focusTarget = field === "class" ? editStudentForm.elements.classId : editStudentForm.elements.studentName;
  window.setTimeout(() => focusTarget?.focus(), 80);
}

deleteStudentForm.addEventListener("submit", event => {
  event.preventDefault();
  if (pendingDeleteIndex !== null) {
    studentRows.splice(Number(pendingDeleteIndex), 1);
    refreshStudentCountsAfterDelete();
    renderDetailTable();
    Modals.close(deleteStudentModal);
    showActionSuccess("Student Deleted", "The student profile was removed.");
    pendingDeleteIndex = null;
  }
});

document.getElementById("editTeacherBtn").addEventListener("click", () => {
  const teacherIndex = document.getElementById("editTeacherBtn").dataset.teacherIndex;
  Modals.close(teacherActionsModal, { immediate: true, restoreFocus: false });
  openEditClassTeacherModal(teacherIndex);
});

document.getElementById("deleteTeacherBtn").addEventListener("click", () => {
  const deleteBtn = document.getElementById("deleteTeacherBtn");
  const teacherIndex = deleteBtn.dataset.teacherIndex;
  setTeacherActionsMode("delete", teacherIndex);
});

document.getElementById("confirmTeacherDeleteBtn").addEventListener("click", event => {
  const confirmBtn = event.currentTarget;
  const teacherIndex = Number(confirmBtn.dataset.teacherIndex);
  if (!teacherRows[teacherIndex]) return;

  confirmBtn.disabled = true;
  teacherRows.splice(teacherIndex, 1);
  renderDetailTable();
  Modals.close(teacherActionsModal);
  showActionSuccess("Teacher Deleted", "The teacher assignment was removed.");
  confirmBtn.disabled = false;
});

document.getElementById("editStudentBtn").addEventListener("click", () => {
  const studentIndex = document.getElementById("editStudentBtn").dataset.studentIndex;
  Modals.close(studentActionsModal, { immediate: true, restoreFocus: false });
  openEditStudentModal(studentIndex);
});

document.getElementById("deleteStudentBtn").addEventListener("click", () => {
  const deleteBtn = document.getElementById("deleteStudentBtn");
  const studentIndex = deleteBtn.dataset.studentIndex;
  const studentName = deleteBtn.dataset.studentName;
  Modals.close(studentActionsModal, { immediate: true, restoreFocus: false });

  pendingDeleteIndex = studentIndex;
  const message = document.getElementById("deleteStudentMessage");
  if (message) message.textContent = `Are you sure you want to delete ${studentName}?`;

  Modals.open(deleteStudentModal);
});

editClassTeacherForm.addEventListener("submit", event => {
  event.preventDefault();
  if (editingTeacherIndex === null) return;

  const data = new FormData(editClassTeacherForm);
  const teacherName = String(data.get("teacherName") || "").trim();
  const subjectName = String(data.get("subjectName") || "").trim();
  const teacherRole = String(data.get("teacherRole") || "").trim();
  if (!teacherName || !subjectName || !teacherRole) return;

  const currentRow = teacherRows[editingTeacherIndex];
  teacherRows[editingTeacherIndex] = makeAssignmentRow(
    teacherName,
    subjectName,
    teacherRole,
    getAssignmentClassName(currentRow, state.currentClass?.name),
    getAssignmentClassId(currentRow)
  );
  renderDetailTable();
  if (teacherProfileView.classList.contains("active") && state.currentTeacherIndex !== null) {
    renderTeacherProfile(teachers[state.currentTeacherIndex]);
  }
  editClassTeacherForm.reset();
  closeAllSuggestions();
  Modals.close(editClassTeacherModal);
  showActionSuccess("Teacher Updated", "The teacher assignment was saved.");
  editingTeacherIndex = null;
});

editStudentForm.addEventListener("submit", event => {
  event.preventDefault();
  if (editingStudentIndex === null) return;

  const student = studentRows[editingStudentIndex];
  if (!student) return;

  const data = new FormData(editStudentForm);
  student.name = String(data.get("studentName") || "").trim();
  if (!student.name) return;
  student.nickname = String(data.get("nickname") || student.name).trim();
  student.classId = Number(data.get("classId")) || getStudentClassId(student);
  const selectedClass = classes.find(item => item.id === Number(student.classId));
  if (selectedClass) setState({ currentClass: selectedClass });

  renderDetailTable();
  if (studentProfileView.classList.contains("active")) {
    renderProfile(student);
    setBreadcrumb([
      { label: "Dashboard", action: "dashboard" },
      { label: getStudentClassName(student), action: "class" },
      { label: student.name }
    ]);
  }
  editStudentForm.reset();
  Modals.close(editStudentModal);
  showActionSuccess("Student Updated", "The student profile was saved.");
  editingStudentIndex = null;
});

gradeTabs.addEventListener("click", event => {
  const button = event.target.closest(".tab");
  if (!button) return;
  setState({ activeFilter: button.dataset.filter });
  renderTabs();
  renderCards();
});

classGrid.addEventListener("click", event => {
  const card = event.target.closest(".class-card");
  if (!card) return;
  const item = classes.find(entry => entry.id === Number(card.dataset.classId));
  if (item) openClass(item);
});

/*document.getElementById("searchBtn").addEventListener("click", () => {
  setState({ activeSearch: searchInput.value.trim() });
  renderCards();
});*/

searchInput.addEventListener("input", () => {
  setState({ activeSearch: searchInput.value.trim() });
  renderCards();
});

detailSearchInput.addEventListener("input", () => {
  setState({ detailSearch: detailSearchInput.value.trim() });
  renderDetailTable();
});

studentStatusFilterInput.addEventListener("change", () => {
  setState({ studentStatusFilter: studentStatusFilterInput.value });
  renderDetailTable();
});

document.getElementById("addClassBtn").addEventListener("click", () => {
  Modals.open(addClassModal);
});

addClassForm.addEventListener("submit", event => {
  event.preventDefault();
  const data = new FormData(addClassForm);
  const group = data.get("classGroup");
  const newClass = {
    id: maxId(classes) + 1,
    name: String(data.get("className") || "").trim(),
    group,
    theme: groupToTheme(group),
    students: Number(data.get("studentCount")) || 0
  };
  if (!newClass.name) return;
  classes.push(newClass);
  setState({ activeFilter: "All Classes", activeSearch: "" });
  searchInput.value = "";
  renderTabs();
  renderCards();
  updateStats();
  addClassForm.reset();
  Modals.close(addClassModal);
  showActionSuccess("Class Added", `${newClass.name} was added successfully.`);
});

addClassTeacherForm.addEventListener("submit", event => {
  event.preventDefault();
  const data = new FormData(addClassTeacherForm);
  const teacherName = String(data.get("teacherName") || "").trim();
  const subjectName = String(data.get("subjectName") || "").trim();
  const teacherRole = String(data.get("teacherRole") || "").trim();
  if (!teacherName || !subjectName || !teacherRole) return;

  const teacherExists = findTeacherIndexByName(teacherName) !== -1;
  if (!teacherExists) {
    showActionSuccess("Teacher Not Found", `Teacher "${teacherName}" does not exist. Please add them first.`, true);
    return;
  }

  const className = state.currentClass?.name || "";
  const classId = state.currentClass?.id || "";
  teacherRows.push(makeAssignmentRow(teacherName, subjectName, teacherRole, className, classId));
  setState({ detailSearch: "" });
  detailSearchInput.value = "";
  setState({ activePanel: "teachers" });
  document.querySelectorAll(".segment").forEach(item => item.classList.toggle("active", item.dataset.panel === "teachers"));
  renderDetailTable();
  addClassTeacherForm.reset();
  closeAllSuggestions();
  Modals.close(addClassTeacherModal);
  showActionSuccess("Teacher Added to Subject", `${teacherName} was added to ${subjectName}.`);
});

addChildForm.addEventListener("submit", event => {
  event.preventDefault();
  const data = new FormData(addChildForm);
  const name = String(data.get("studentName") || "").trim();
  if (!name) return;
  const student = createDefaultStudent();
  student.id = maxId(studentRows) + 1;
  student.name = name;
  student.nickname = String(data.get("nickname") || name).trim();
  student.guardian = String(data.get("guardian") || "Not recorded").trim();
  student.contact = String(data.get("contact") || "Not recorded").trim();
  student.inviteStatus = String(data.get("inviteStatus") || "Pending");
  student.active = String(data.get("active")) === "true";
  student.admissionNumber = String(data.get("admissionNumber") || "Not recorded").trim();
  student.classId = state.currentClass?.id || "";
  studentRows.push(student);
  if (state.currentClass) {
    state.currentClass.students += 1;
    document.getElementById("detailStudentNumber").textContent = state.currentClass.students;
  }
  setState({ detailSearch: "" });
  detailSearchInput.value = "";
  setState({ studentStatusFilter: "all" });
  studentStatusFilterInput.value = "all";
  setState({ activePanel: "students" });
  document.querySelectorAll(".segment").forEach(item => item.classList.toggle("active", item.dataset.panel === "students"));
  renderDetailTable();
  renderCards();
  updateStats();
  addChildForm.reset();
  Modals.close(addChildModal);
  showActionSuccess("Student Added", `${student.name} was added successfully.`);
});

breadcrumb.addEventListener("click", event => {
  const button = event.target.closest("[data-breadcrumb]");
  if (!button) return;
  if (button.dataset.breadcrumb === "dashboard") {
    showDashboard();
    return;
  }
  if (button.dataset.breadcrumb === "class") {
    openClass(state.currentClass, { panel: "students" });
    return;
  }
  if (button.dataset.breadcrumb === "teachers") {
    showTeachersManagement();
  }
});

document.querySelector(".segmented").addEventListener("click", event => {
  const button = event.target.closest(".segment");
  if (!button) return;
  setState({ activePanel: button.dataset.panel });
  document.querySelectorAll(".segment").forEach(item => item.classList.toggle("active", item === button));
  renderDetailTable();
});

detailTable.addEventListener("click", event => {
  const profileButton = event.target.closest("[data-student-profile]");
  const teacherProfileButton = event.target.closest("[data-teacher-profile]");
  const teacherButton = event.target.closest("[data-teacher-action]");
  const editStudentButton = event.target.closest("[data-edit-student]");
  const studentButton = event.target.closest("[data-remove-student]");
  if (profileButton) {
    openStudentProfile(profileButton.dataset.studentProfile);
    return;
  }
  if (teacherProfileButton) {
    event.preventDefault();
    openTeacherProfileFromAssignment(teacherProfileButton.dataset.teacherProfile);
    return;
  }
  if (teacherButton) {
    event.preventDefault();
    openTeacherActionsModal(teacherButton);
    return;
  }
  if (editStudentButton) {
    event.preventDefault();
    openEditStudentModal(editStudentButton.dataset.editStudent);
    return;
  }
  if (studentButton) {
    event.preventDefault();
    openDeleteStudentModal(studentButton);
    return;
  }
  if (!teacherButton && !studentButton) return;
  renderDetailTable();
});

document.getElementById("detailAddBtn").addEventListener("click", () => {
  if (state.activePanel === "teachers") {
    addClassTeacherForm.reset();
    closeAllSuggestions();
    Modals.open(addClassTeacherModal);
  } else {
    Modals.open(addChildModal);
  }
});

const userMenu = document.getElementById("userMenu");
const profileDropdown = document.getElementById("profileDropdown");

function closeProfileMenu() {
  profileDropdown.classList.remove("open");
  userMenu.setAttribute("aria-expanded", "false");
}

const loginGate = createLoginGate({
  storageKey: "esomaLoggedIn",
  appShellSelector: "#appShell",
  onEnter: showDashboard,
});

function enterDashboard() {
  loginGate.enterDashboard();
}

// admin closes any open modal/profile menu before showing the login screen —
// the one piece of behavior that isn't shared with teacher/parent.
function showLogin() {
  Modals.closeAll();
  closeProfileMenu();
  loginGate.showLogin();
}

loginGate.bind();
document.getElementById("logoutBtn").addEventListener("click", showLogin);

// bulk import parsing + preview UI
const bulkImportParseUI = initBulkImportParseUI({
  elements: {
    dropZoneEl: document.getElementById("dropZone"),
    bulkFileInput: document.getElementById("bulkFileInput"),
    importClearBtn: document.getElementById("importClearBtn"),
    importPreviewWrap: document.getElementById("importPreviewWrap"),
    importPreviewCount: document.getElementById("importPreviewCount"),
    importPreviewBody: document.getElementById("importPreviewBody"),
    importSubmitBtn: document.getElementById("importSubmitBtn"),
  },
  helpers: {
    escapeHTML,
  },
});

function resetImportModal() {
  bulkImportParseUI.resetImportModal();
}

const bulkImportActions = initBulkImportActions({
  state,
  setState,
  studentRows,
  teachers,
  Modals,
  createDefaultStudent,
  renderDetailTable,
  renderCards,
  updateStats,
  renderTeachersTable,
  elements: {
    bulkImportModal,
  },
  helpers: {
    showActionSuccess,
    resetImportModal,
  },
});

function handleBulkImportSubmit() {
  const parsedImportRows = bulkImportParseUI.getParsedRows();
  if (!parsedImportRows.length) return;
  if (state.currentImportType === "students") {
    bulkImportActions.importStudents(parsedImportRows);
  } else {
    bulkImportActions.importTeachers(parsedImportRows);
  }
}
const bulkImportUI = initBulkImportUI({
  state,
  setState,
  Modals,
  resetImportModal,
  onSubmit: handleBulkImportSubmit,
  elements: {
    bulkImportModal,
    importStudentsBtn,
    bulkImportTeachersBtn,
    bulkImportTitle: document.getElementById("bulkImportTitle"),
    bulkImportSubtitle: document.getElementById("bulkImportSubtitle"),
    importSubmitBtn: document.getElementById("importSubmitBtn"),
  },
});

teachersManagementBtn.addEventListener("click", () => {
  closeProfileMenu();
  showTeachersManagement();
});

addTeacherFormBtn.addEventListener("click", () => {
  addTeacherForm.reset();
  Modals.open(addTeacherModal);
});

addTeacherForm.addEventListener("submit", event => {
  event.preventDefault();
  const data = new FormData(addTeacherForm);
  const title = String(data.get("teacherTitle") || "").trim();
  const name = String(data.get("teacherName") || "").trim();
  const contact = String(data.get("teacherContact") || "").trim();
  const email = String(data.get("teacherEmail") || "").trim();

  if (!title || !name || !contact) return;

  const fullName = `${title} ${name}`;
  const newTeacher = {
    id: maxId(teachers) + 1,
    name: fullName,
    contact,
    email,
    subjects: [],
    classes: [],
    assignments: []
  };
  teachers.push(newTeacher);
  renderTeachersTable();
  addTeacherForm.reset();
  Modals.close(addTeacherModal);
  showActionSuccess("Teacher Added", "New teacher added successfully.");
});

editTeacherForm.addEventListener("submit", event => {
  event.preventDefault();
  if (editingTeacherIndexManagement === null) return;

  const teacher = teachers[editingTeacherIndexManagement];
  if (!teacher) return;

  const data = new FormData(editTeacherForm);
  const previousName = teacher.name;
  teacher.name = String(data.get("teacherName") || "").trim();
  teacher.contact = String(data.get("teacherContact") || "").trim();
  if (!teacher.name || !teacher.contact) return;
  teacherRows.forEach(row => {
    if (normalizeName(getAssignmentTeacher(row)) === normalizeName(previousName)) {
      row[0] = teacher.name;
    }
  });

  renderTeachersTable();
  if (teacherProfileView.classList.contains("active")) {
    renderTeacherProfile(teacher);
    setBreadcrumb([{ label: "Dashboard", action: "dashboard" }, { label: "Teachers", action: "teachers" }, { label: teacher.name }]);
  }
  editTeacherForm.reset();
  Modals.close(editTeacherModal);
  showActionSuccess("Teacher Updated", "Teacher information was saved.");
  editingTeacherIndexManagement = null;
});

deleteTeacherForm.addEventListener("submit", event => {
  event.preventDefault();
  if (pendingDeleteTeacherIndex === null) return;

  const wasProfileOpen = teacherProfileView.classList.contains("active");
  const teacher = teachers[pendingDeleteTeacherIndex];
  teachers.splice(pendingDeleteTeacherIndex, 1);
  for (let index = teacherRows.length - 1; index >= 0; index -= 1) {
    if (normalizeName(getAssignmentTeacher(teacherRows[index])) === normalizeName(teacher?.name)) {
      teacherRows.splice(index, 1);
    }
  }
  renderTeachersTable();
  Modals.close(deleteTeacherModal);
  showActionSuccess("Teacher Deleted", "The teacher has been removed.");
  if (wasProfileOpen) {
    setState({ currentTeacherIndex: null });
    showTeachersManagement();
  }
  pendingDeleteTeacherIndex = null;
});

/*teacherSearchBtn.addEventListener("click", () => {
  renderTeachersTable();
});*/

teacherSearchInput.addEventListener("keyup", event => {
  if (event.key === "Enter") {
    teacherSearchBtn.click();
  }
});

teacherSearchInput.addEventListener("input", () => {
  renderTeachersTable();
});

document.addEventListener("click", event => {
  const viewTeacherBtn = event.target.closest("[data-view-teacher]");
  if (viewTeacherBtn) {
    const index = Number(viewTeacherBtn.dataset.viewTeacher);
    showTeacherProfile(index);
    return;
  }

  const editTeacherBtn = event.target.closest("[data-edit-teacher]");
  if (editTeacherBtn) {
    const index = Number(editTeacherBtn.dataset.editTeacher);
    openTeacherManagementEditModal(index, editTeacherBtn.dataset.editField);
    return;
  }

  const deleteTeacherBtn = event.target.closest("[data-delete-teacher]");
  if (deleteTeacherBtn) {
    const index = Number(deleteTeacherBtn.dataset.deleteTeacher);
    openDeleteTeacherModal(index);
    return;
  }
});

teacherProfileView.addEventListener("click", event => {
  const editButton = event.target.closest("[data-edit-current-teacher]");
  if (!editButton || state.currentTeacherIndex === null) return;
  openTeacherManagementEditModal(state.currentTeacherIndex, editButton.dataset.editField);
});

studentProfileView.addEventListener("click", event => {
  const editButton = event.target.closest("[data-edit-current-student]");
  if (!editButton || state.currentStudentIndex === null) return;
  openEditStudentModal(state.currentStudentIndex, editButton.dataset.editField);
});

userMenu.addEventListener("click", event => {
  event.stopPropagation();
  const isOpen = profileDropdown.classList.toggle("open");
  userMenu.setAttribute("aria-expanded", String(isOpen));
});

profileDropdown.addEventListener("click", event => {
  event.stopPropagation();
});

document.addEventListener("click", closeProfileMenu);

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeProfileMenu();
  }
});

renderTabs();
renderCards();
updateStats();

// initial route restore + back/forward are handled by js/router.js.
if (document.body.classList.contains("login-active")) {
  window.setTimeout(() => loginIdentity.focus(), 120);
}
