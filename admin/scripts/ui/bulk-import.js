// bulk import UI (students + teachers)
// Note: parsing logic and import functions still live in legacy.js for now because you said you already have the logic this was just for testing

export function initBulkImportUI({
  state,
  setState,
  elements,
  Modals,
  onSubmit,
  resetImportModal,
}) {
  const {
    bulkImportModal,
    importStudentsBtn,
    bulkImportTeachersBtn,
    bulkImportTitle,
    bulkImportSubtitle,
    importSubmitBtn,
  } = elements;

  function openStudentsImport() {
    setState({ currentImportType: "students" });
    bulkImportTitle.textContent = "Import Students";
    bulkImportSubtitle.textContent = "Add multiple students from an Excel or CSV file.";
    importSubmitBtn.textContent = "Import Students";
    resetImportModal?.();
    Modals.open(bulkImportModal);
  }

  function openTeachersImport() {
    setState({ currentImportType: "teachers" });
    bulkImportTitle.textContent = "Import Teachers";
    bulkImportSubtitle.textContent = "Add multiple teachers from an Excel or CSV file.";
    importSubmitBtn.textContent = "Import Teachers";
    resetImportModal?.();
    Modals.open(bulkImportModal);
  }

  importStudentsBtn?.addEventListener("click", openStudentsImport);
  bulkImportTeachersBtn?.addEventListener("click", openTeachersImport);
  importSubmitBtn?.addEventListener("click", () => onSubmit?.());

  return {
    openStudentsImport,
    openTeachersImport,
  };
}