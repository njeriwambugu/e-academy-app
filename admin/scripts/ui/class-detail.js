// class detail UI: teachers/students distribution table + summaries.

import {
  emptyTable,
  escapeHTML,
  iconDelete,
  iconChart,
  iconEdit,
  iconTrash,
  getAssignmentTeacher,
  getAssignmentSubject,
  getAssignmentClassName,
} from "../utils/ui.js";

export function initClassDetailUI({
  state,
  setState,
  teacherRows,
  studentRows,
  elements,
  helpers,
}) {
  const {
    detailTableWrap,
    tableHead,
    detailTable,
    studentPanel,
    detailSearchInput,
    studentStatusFilterInput,
    importStudentsBtn,
  } = elements;

  const { updateDetailStats, renderClassAssignmentSummary } = helpers;

  function getVisibleTeachers() {
    return teacherRows
      .map((row, index) => ({ row, index }))
      .filter(({ row }) => {
        const text = `${getAssignmentTeacher(row)} ${getAssignmentSubject(row)} ${getAssignmentClassName(row, state.currentClass?.name)}`.toLowerCase();
        return text.includes(state.detailSearch.toLowerCase());
      });
  }

  function getVisibleStudents() {
    return studentRows
      .map((student, index) => ({ student, index }))
      .filter(({ student }) => {
        const status = student.active ? "active" : "pending";
        const matchesSearch = student.name
          .toLowerCase()
          .includes(state.detailSearch.toLowerCase());
        const matchesStatus =
          state.studentStatusFilter === "all" ||
          state.studentStatusFilter === status;
        return matchesSearch && matchesStatus;
      });
  }

  function renderStudentSummary() {
    document.getElementById("studentInvitesSent").textContent = studentRows.length;
    document.getElementById("studentInvitesAccepted").textContent = studentRows.filter(student => student.inviteStatus === "Accepted").length;
    document.getElementById("studentActiveTotal").textContent = studentRows.filter(student => student.active).length;

    if (typeof renderClassAssignmentSummary === "function") {
      renderClassAssignmentSummary();
    }

    document.querySelectorAll(".student-summary-card").forEach(card => {
      card.classList.remove("summary-animate");
      void card.offsetWidth;
      card.classList.add("summary-animate");
    });
  }

  function renderDetailTable() {
    const addButton = document.getElementById("detailAddBtn");
    const isTeacherPanel = state.activePanel === "teachers";
    detailTableWrap.dataset.panel = state.activePanel;

    updateDetailStats();

    studentPanel.classList.toggle("active", !isTeacherPanel);
    studentStatusFilterInput.disabled = isTeacherPanel;
    detailSearchInput.placeholder = isTeacherPanel
      ? "Search teachers or subjects"
      : "Search students";

    if (state.activePanel === "teachers") {
      addButton.textContent = "Add teacher to subjects +";
      if (importStudentsBtn) importStudentsBtn.hidden = true;

      tableHead.innerHTML = '<th>Teacher Name</th><th>Subject</th><th>Actions</th>';
      const visibleTeachers = getVisibleTeachers();
      detailTable.innerHTML = visibleTeachers
        .map(({ row, index }) => {
          const teacherName = getAssignmentTeacher(row);
          const subjectName = getAssignmentSubject(row);
          return `
            <tr>
              <td data-label="Teacher Name"><button class="teacher-name-link" type="button" data-teacher-profile="${index}" data-teacher-name="${escapeHTML(teacherName)}" data-teacher-subject="${escapeHTML(subjectName)}">${escapeHTML(teacherName)}</button></td>
              <td data-label="Subject">${escapeHTML(subjectName)}</td>
              <td data-label="Actions"><button class="remove" data-teacher-index="${index}" data-teacher-action="delete" data-teacher-name="${escapeHTML(teacherName)}" title="Delete teacher" aria-label="Delete ${escapeHTML(teacherName)}">${iconDelete()}</button></td>
            </tr>
          `;
        })
        .join("");

      if (!visibleTeachers.length) {
        detailTable.innerHTML = emptyTable(
          "No subject found",
          "Try another search or add a teacher to this subject list.",
          3,
        );
      }
      return;
    }

    // Students panel
    addButton.textContent = "Add student +";
    if (importStudentsBtn) importStudentsBtn.hidden = false;

    tableHead.innerHTML =
      '<th class="col-name">Name</th><th class="col-invite">Invite Status</th><th class="col-active">Active</th><th class="col-actions">Actions</th>';

    renderStudentSummary();
    const visibleStudents = getVisibleStudents();
    detailTable.innerHTML = visibleStudents
      .map(({ student, index }) => {
        const invitePending = student.inviteStatus !== "Accepted";
        return `
            <tr>
              <td class="col-name" data-label="Name">
                <button class="student-link" data-student-profile="${student.id}">
                  <span>${escapeHTML(student.name)}</span>
                </button>
              </td>
              <td class="col-invite" data-label="Invite Status"><span class="invite-icon ${invitePending ? "pending" : ""}">${invitePending ? "⧖" : "✓"}</span></td>
              <td class="col-active" data-label="Active"><span class="student-chip"><span class="status-dot ${student.active ? "" : "pending"}"></span>${student.active ? "Active" : "Pending"}</span></td>
              <td class="col-actions">
                <div class="student-actions">
                  <button class="icon-action" data-student-profile="${student.id}" title="View progress" aria-label="View ${escapeHTML(student.name)} progress">${iconChart()}</button>
                  <button class="icon-action muted" data-edit-student="${index}" title="Edit student" aria-label="Edit ${escapeHTML(student.name)}">${iconEdit()}</button>
                  <button class="icon-action danger" data-remove-student="${index}" title="Delete student" aria-label="Delete ${escapeHTML(student.name)}">${iconTrash()}</button>
                </div>
              </td>
            </tr>
          `;
      })
      .join("");

    if (!visibleStudents.length) {
      detailTable.innerHTML = emptyTable(
        "No student found",
        "Adjust the filter, clear search, or add a student.",
        4,
      );
    }
  }

  return {
    renderDetailTable,
    renderStudentSummary,
    getVisibleTeachers,
    getVisibleStudents,
  };
}