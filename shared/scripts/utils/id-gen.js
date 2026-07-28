/* shared "next id" generation — was the same Math.max(...ids)+1 shape
 * reimplemented independently at 5 call sites in admin (legacy.js's
 * add-teacher/add-student/ensure-teacher-from-assignment handlers, plus
 * bulk-import-actions.js's student/teacher batch importers). */

export function maxId(list) {
  return list.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0);
}
