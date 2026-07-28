export const state = {
  activeFilter: "All Classes",
  activeSearch: "",
  detailSearch: "",
  studentStatusFilter: "all",
  currentClass: null,
  currentTeacherIndex: null,
  currentStudentIndex: null,
  activePanel: "teachers",
  currentImportType: "students",
  isPopStateNavigation: false,
  editingTeacherIndexManagement: null,
  pendingDeleteTeacherIndex: null
};

export function initState({ classes } = {}) {
  // default class selection for detail view calculations.
  if (!state.currentClass && Array.isArray(classes) && classes.length) {
    state.currentClass = classes[3] || classes[0] || null;
  }
  return state;
}

export function setState(patch = {}) {
  Object.assign(state, patch);
  return state;
}