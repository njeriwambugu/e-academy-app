import { runButtonAction } from "../../../shared/scripts/utils/ui-state.js";
// shared engine is imported rather than read off window, so it is guaranteed to have evaluated before this module's body runs
import { open as openModal, close as closeModal } from "../../../shared/scripts/modal.js";

function getGradeNumber(className = "") {
  const match = String(className).match(/grade\s*(\d+)/i);
  return match ? Number(match[1]) : null;
}

export function getClassTheme(className = "") {
  const grade = getGradeNumber(className);
  return grade ? `grade-${grade}` : "grade-default";
}

export function createSelectClassModal(options) {
  const { teacherContext, escapeHTML, onClassSelected } = options || {};

  const modal = document.querySelector("#teacherSelectClassModal");
  const title = document.querySelector("#teacherSelectClassTitle");
  const meta = document.querySelector("#teacherSelectClassMeta");
  const optionsWrap = document.querySelector("#teacherClassOptions");

  function openSelectClass(subjectId) {
    const subject = teacherContext?.subjects?.find((s) => s.id === subjectId);

    if (!subject) return;

    if (title) {
      title.textContent = "Select a class";
    }

    if (meta) {
      meta.textContent = `Subject: ${subject.name}`;
    }

    const classes = (teacherContext?.classes || []).filter((klass) =>
      (teacherContext?.teacher?.assignments || []).some(
        (assignment) =>
          assignment.subjectId === subjectId &&
          Number(assignment.classId) === Number(klass.id)
      )
    );

    if (optionsWrap) {
      optionsWrap.innerHTML = classes.length
        ? classes
            .map((c) => {
              const theme = c.theme || getClassTheme(c.name);
              const grade = getGradeNumber(c.name);
              return `
                <button
                  type="button"
                  class="option-btn class-option-btn ${escapeHTML(theme)}"
                  data-subject-id="${escapeHTML(subjectId)}"
                  data-class-id="${escapeHTML(c.id)}"
                  data-class-theme="${escapeHTML(theme)}"
                  data-grade="${escapeHTML(grade ?? "")}">
                  <span class="class-option-copy">
                    <span class="class-option-name">${escapeHTML(c.name)}</span>
                  </span>
                </button>
              `;
            })
            .join("")
        : `<div class="modal-note">No classes available for this subject yet.</div>`;
    }

    openModal(modal);
  }

  if (optionsWrap) {
    optionsWrap.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-class-id]");
      if (!btn) return;

      const subjectId = btn.dataset.subjectId;
      const classId = btn.dataset.classId;
      const classTheme = btn.dataset.classTheme;

      runButtonAction(btn, () => {
        closeModal(modal);

        if (typeof onClassSelected === "function") {
          onClassSelected({ subjectId, classId, classTheme });
        }
      }, 160);
    });
  }

  // backdrop, close-button and escape handling come from the shared modal
  // engine imported at the top, so we do not re-add those listeners here.

  return {
    openSelectClass,
    close: () => closeModal(modal),
  };
}
