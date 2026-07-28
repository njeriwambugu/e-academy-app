/* shared DOM-select helpers — was retyped identically in teacher-app.js and
 * parent/app.js (admin's legacy.js uses document.getElementById throughout
 * instead, so it isn't a consumer of this one). */

export function $(sel, root) {
  return (root || document).querySelector(sel);
}

export function $$(sel, root) {
  return Array.from((root || document).querySelectorAll(sel));
}
