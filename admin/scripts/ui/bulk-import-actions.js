import { maxId } from "../../../shared/scripts/utils/id-gen.js";

export function initBulkImportActions({
  state,
  setState,
  studentRows,
  teachers,
  elements,
  helpers,
  Modals,
  createDefaultStudent,
  renderDetailTable,
  renderCards,
  updateStats,
  renderTeachersTable,
}) {
  const { bulkImportModal } = elements;

  const { showActionSuccess, resetImportModal } = helpers;

  function importStudents(parsedRows) {
    let added = 0;
    
    const baseId = maxId(studentRows);

    parsedRows.forEach((row) => {
      const student = createDefaultStudent();

      student.id = baseId + 1 + added;
      student.name = row.name;
      student.nickname = row.nickname || row.name;
      student.guardian = row.guardian || "Not recorded";
      student.contact = row.contact || "Not recorded";
      student.admissionNumber = row.admissionNumber || "Not recorded";
      student.inviteStatus = row.inviteStatus;
      student.active = row.active;
      student.classId = state.currentClass?.id || "";

      studentRows.push(student);
      added += 1;
    });

    if (state.currentClass) {
      state.currentClass.students += added;
      const detailStudentNumber = document.getElementById("detailStudentNumber");
      if (detailStudentNumber) detailStudentNumber.textContent = state.currentClass.students;
    }

    setState({ activePanel: "students" });
    document.querySelectorAll(".segment").forEach((item) =>
      item.classList.toggle("active", item.dataset.panel === "students"),
    );

    renderDetailTable();
    renderCards();
    updateStats();

    Modals.close(bulkImportModal);
    resetImportModal();

    showActionSuccess(
      "Students Imported",
      `${added} student${added !== 1 ? "s" : ""} added successfully.`,
    );
  }

  function importTeachers(parsedRows) {
    let added = 0;
    // computed once, before any row is pushed  see importStudents for why.
    const baseId = maxId(teachers);

    parsedRows.forEach((row) => {
      const newTeacher = {
        id: baseId + 1 + added,
        name: row.name,
        contact: row.contact || "",
        email: row.email || "",
        subjects: [],
        classes: [],
        assignments: [],
      };

      teachers.push(newTeacher);
      added += 1;
    });

    renderTeachersTable();

    Modals.close(bulkImportModal);
    resetImportModal();

    showActionSuccess(
      "Teachers Imported",
      `${added} teacher${added !== 1 ? "s" : ""} added successfully.`,
    );
  }

  return {
    importStudents,
    importTeachers,
  };
}