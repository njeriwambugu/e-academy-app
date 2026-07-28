// teachers management UI

import {
  escapeHTML,
  emptyTable,
  iconEdit,
  iconTrash,
} from "../utils/ui.js";

export function initTeachersUI({
  state,
  setState,
  teachers,
  teacherRows,
  elements,
  Modals,
  onShowTeacherProfile,
  onTeacherProfileUpdated,
  getTeacherSubjectNames,
  normalizeName,
  getAssignmentTeacher,
  showActionSuccess,
}) {
  const {
    teachersTable,
    teacherSearchInput,
    teacherSearchBtn,
    editTeacherModal,
    deleteTeacherModal,
    editTeacherForm,
    deleteTeacherForm,
    teacherProfileView,
  } = elements;
  function renderTeachersTable() {
    const searchTerm = String(teacherSearchInput.value || "").toLowerCase();
    const filtered = teachers.filter((teacher) => {
      const subjects = typeof getTeacherSubjectNames === "function" ? getTeacherSubjectNames(teacher) : (teacher.subjects || []);
      const searchText = `${teacher.name} ${teacher.contact} ${subjects.join(" ")}`.toLowerCase();
      return searchText.includes(searchTerm);
    });

    teachersTable.innerHTML = filtered
      .map((teacher) => {
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
      })
      .join("");

    if (!filtered.length) {
      teachersTable.innerHTML = emptyTable(
        "No teacher found",
        "Try another search or add a teacher.",
        3,
      );
    }
  }

  function openTeacherManagementEditModal(index, field = "name") {
    const teacher = teachers[index];
    if (!teacher) return;
    setState({ editingTeacherIndexManagement: index });

    document.getElementById("editTeacherName").value = teacher.name;
    document.getElementById("editTeacherContact").value = teacher.contact;

    Modals.open(editTeacherModal);
    const focusTarget =
      field === "contact"
        ? document.getElementById("editTeacherContact")
        : document.getElementById("editTeacherName");
    window.setTimeout(() => focusTarget?.focus(), 80);
  }

  function openDeleteTeacherModal(index) {
    const teacher = teachers[index];
    if (!teacher) return;
    setState({ pendingDeleteTeacherIndex: index });
    const message = document.getElementById("deleteTeacherMessage");
    if (message) message.textContent = `Are you sure you want to delete ${teacher.name}?`;
    Modals.open(deleteTeacherModal);
  }

  teacherSearchBtn?.addEventListener("click", () => {
    renderTeachersTable();
  });

  teacherSearchInput.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
      teacherSearchBtn?.click();
    }
  });

  teacherSearchInput.addEventListener("input", renderTeachersTable);

  // table actions
  document.addEventListener("click", (event) => {
    const viewTeacherBtn = event.target.closest("[data-view-teacher]");
    if (viewTeacherBtn) {
      const index = Number(viewTeacherBtn.dataset.viewTeacher);
      onShowTeacherProfile(index);
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

  teacherProfileView?.addEventListener("click", (event) => {
    const editButton = event.target.closest("[data-edit-current-teacher]");
    if (!editButton || state.currentTeacherIndex === null) return;
    openTeacherManagementEditModal(state.currentTeacherIndex, editButton.dataset.editField);
  });

  // edit form submit
  editTeacherForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (state.editingTeacherIndexManagement === null) return;

    const teacher = teachers[state.editingTeacherIndexManagement];
    if (!teacher) return;

    const data = new FormData(editTeacherForm);
    const previousName = teacher.name;
    teacher.name = String(data.get("teacherName") || "").trim();
    teacher.contact = String(data.get("teacherContact") || "").trim();
    if (!teacher.name || !teacher.contact) return;

    // keep detail assignments in sync
    if (Array.isArray(teacherRows) && typeof normalizeName === "function" && typeof getAssignmentTeacher === "function") {
      teacherRows.forEach((row) => {
        if (normalizeName(getAssignmentTeacher(row)) === normalizeName(previousName)) {
          row[0] = teacher.name;
        }
      });
    }

    renderTeachersTable();
    if (teacherProfileView?.classList.contains("active")) {
      onTeacherProfileUpdated?.(teacher);
    }

    editTeacherForm.reset();
    Modals.close(editTeacherModal);
    showActionSuccess?.("Teacher Updated", "Teacher information was saved.");
    setState({ editingTeacherIndexManagement: null });
  });

  deleteTeacherForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (state.pendingDeleteTeacherIndex === null) return;

    const wasProfileOpen = teacherProfileView?.classList.contains("active");
    const teacher = teachers[state.pendingDeleteTeacherIndex];

    teachers.splice(state.pendingDeleteTeacherIndex, 1);

    if (Array.isArray(teacherRows) && typeof normalizeName === "function" && typeof getAssignmentTeacher === "function") {
      for (let index = teacherRows.length - 1; index >= 0; index -= 1) {
        if (normalizeName(getAssignmentTeacher(teacherRows[index])) === normalizeName(teacher?.name)) {
          teacherRows.splice(index, 1);
        }
      }
    }

    renderTeachersTable();
    Modals.close(deleteTeacherModal);
    showActionSuccess?.("Teacher Deleted", "The teacher has been removed.");

    if (wasProfileOpen) {
      setState({ currentTeacherIndex: null });
      // Back to management list
      // (legacy handles navigation view switching)
    }

    setState({ pendingDeleteTeacherIndex: null });
  });

  return {
    renderTeachersTable,
    openTeacherManagementEditModal,
    openDeleteTeacherModal,
  };
}