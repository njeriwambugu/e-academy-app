// autocomplete / suggestion dropdown component.

export function getAutocompleteMatches(term, options) {
  const searchTerm = String(term || "").trim().toLowerCase();
  if (!searchTerm) return [];

  const uniq = values => {
    const seen = new Set();
    return (values || [])
      .map(v => String(v || "").trim())
      .filter(v => {
        const key = v.toLowerCase();
        if (!key || seen.has(key)) return false;
        seen.add(key);
        return true;
      });
  };

  return uniq(options)
    .filter(value => value.toLowerCase().includes(searchTerm))
    .sort((first, second) => {
      const a = first.toLowerCase();
      const b = second.toLowerCase();
      const aStarts = a.startsWith(searchTerm) ? 0 : 1;
      const bStarts = b.startsWith(searchTerm) ? 0 : 1;
      if (aStarts !== bStarts) return aStarts - bStarts;
      return first.localeCompare(second);
    })
    .slice(0, 5);
}

const suggestionLists = [];

export function closeSuggestionList(list) {
  if (!list) return;
  list.classList.remove("open");
  list.innerHTML = "";
  const input = document.querySelector(`[aria-controls="${list.id}"]`);
  input?.setAttribute("aria-expanded", "false");
}

export function closeAllSuggestions(exceptList = null) {
  suggestionLists.forEach(list => {
    if (list !== exceptList) closeSuggestionList(list);
  });
}

export function attachAutocomplete({ input, list, getOptions, escapeHTML }) {
  if (!input || !list || !getOptions) return;
  suggestionLists.push(list);
  let activeIndex = -1;

  const escape = escapeHTML || (value => String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]));

  function choose(value) {
    input.value = value;
    closeSuggestionList(list);
    input.dispatchEvent(new Event("change", { bubbles: true }));
  }

  function render() {
    const matches = getAutocompleteMatches(input.value, getOptions());
    activeIndex = matches.length ? Math.min(activeIndex, matches.length - 1) : -1;
    closeAllSuggestions(list);
    if (!matches.length) {
      closeSuggestionList(list);
      return;
    }

    list.innerHTML = matches.map((value, index) => `
      <button class="suggestion-option ${index === activeIndex ? "active" : ""}" type="button" role="option" data-value="${escape(value)}">
        ${escape(value)}
      </button>
    `).join("");

    const inputRect = input.getBoundingClientRect();
    const modal = input.closest(".modal-form");
    const modalRect = modal ? modal.getBoundingClientRect() : null;
    const viewportSpaceBelow = window.innerHeight - inputRect.bottom;
    const modalSpaceBelow = modalRect ? (modalRect.bottom - inputRect.bottom) : viewportSpaceBelow;
    const spaceBelow = Math.min(viewportSpaceBelow, modalSpaceBelow);

    if (spaceBelow < 220) list.classList.add("upward");
    else list.classList.remove("upward");

    list.classList.add("open");
    input.setAttribute("aria-expanded", "true");
  }

  input.setAttribute("aria-expanded", "false");
  input.addEventListener("input", render);
  input.addEventListener("focus", render);
  input.addEventListener("keydown", event => {
    const options = Array.from(list.querySelectorAll(".suggestion-option"));
    if (!options.length && !["Escape", "Tab"].includes(event.key)) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      activeIndex = (activeIndex + 1) % options.length;
      render();
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      activeIndex = activeIndex <= 0 ? options.length - 1 : activeIndex - 1;
      render();
      return;
    }

    if (event.key === "Enter" && activeIndex >= 0 && options[activeIndex]) {
      event.preventDefault();
      choose(options[activeIndex].dataset.value);
      return;
    }

    if (event.key === "Escape" || event.key === "Tab") {
      closeSuggestionList(list);
    }
  });

  list.addEventListener("mousedown", event => {
    const option = event.target.closest(".suggestion-option");
    if (!option) return;
    event.preventDefault();
    choose(option.dataset.value);
  });
}