import { initRouter } from "./router.js";
import { classes, showDashboard, showTeachersManagement, openClassById, openStudentProfile } from "./legacy.js";

initRouter({
  showDashboard,
  showTeachersManagement,
  openClassById,
  openStudentProfile,
  classes,
});