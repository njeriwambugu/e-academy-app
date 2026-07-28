// dashboard UI (tabs, class cards, top stats)

import { state, setState } from "../state.js";
import { emptyState } from "../utils/ui.js";

export function initDashboardUI({
  filters,
  themes,
  classes,
  elements,
  onOpenClass,
}) {
  const { gradeTabs, classGrid, searchInput, searchBtn } = elements;


  function renderTabs() {
    gradeTabs.innerHTML = filters
      .map(
        (filter) =>
          `\n        <button class="tab ${filter === state.activeFilter ? "active" : ""}" data-filter="${filter}">${filter}</button>\n      `,
      )
      .join("");
  }

  function getVisibleClasses() {
    return classes.filter((item) => {
      const matchesFilter =
        state.activeFilter === "All Classes" || item.group === state.activeFilter;
      const matchesSearch = item.name
        .toLowerCase()
        .includes(state.activeSearch.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }

  function renderCards() {
    const visible = getVisibleClasses();
    classGrid.innerHTML = visible
      .map((item, index) => {
        const theme = themes[item.theme];
        const delay = Math.min(index * 45, 360);
        return `\n          <button class="class-card ${theme.className}" data-class-id="${item.id}">\n            <span class="shape" aria-hidden="true"></span>\n            <span class="shape small" aria-hidden="true"></span>\n            <span class="shape tiny" aria-hidden="true"></span>\n            <span class="shape ghost" aria-hidden="true"></span>\n            <span class="class-name tracking-in-expand anim-delay-${delay}">${item.name}</span>\n            <span class="student-count">${item.students} students</span>\n          </button>\n        `;
      })
      .join("");

    if (!visible.length) {
      classGrid.innerHTML = emptyState(
        "No class found",
        "Try another search or add a class.",
      );
    }
  }

  function updateStats() {
    document.getElementById("totalClasses").textContent = classes.length;
    document.getElementById("totalStudents").textContent = classes.reduce(
      (sum, item) => sum + item.students,
      0,
    );
  }

  gradeTabs.addEventListener("click", (event) => {
    const button = event.target.closest(".tab");
    if (!button) return;
    setState({ activeFilter: button.dataset.filter });
    renderTabs();
    renderCards();
  });

  classGrid.addEventListener("click", (event) => {
    const card = event.target.closest(".class-card");
    if (!card) return;
    const item = classes.find((entry) => entry.id === Number(card.dataset.classId));
    if (item) onOpenClass(item);
  });

 /* searchBtn?.addEventListener("click", () => {
    setState({ activeSearch: searchInput.value.trim() });
    renderCards();
  });*/

  searchInput?.addEventListener("input", () => {
    setState({ activeSearch: searchInput.value.trim() });
    renderCards();
  });

  renderTabs();
  renderCards();
  updateStats();

  return { renderTabs, renderCards, updateStats };
}