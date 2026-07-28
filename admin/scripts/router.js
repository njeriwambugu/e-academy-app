import { setState, state } from "./state.js";

function parseHash() {
  const params = new URLSearchParams(location.hash.slice(1));
  return {
    view: params.get("view") || null,
    classId: Number(params.get("classId") || params.get("class") || 0) || null,
    studentId: Number(params.get("studentId") || params.get("student") || 0) || null,
    panel: params.get("panel") || null
  };
}

function buildHash(next) {
  const params = new URLSearchParams();
  if (next.view) params.set("view", next.view);
  if (next.classId) params.set("classId", String(next.classId));
  if (next.studentId) params.set("studentId", String(next.studentId));
  if (next.panel) params.set("panel", next.panel);
  const str = params.toString();
  return str ? `#${str}` : "";
}

export function navigate(next, { replace = false } = {}) {
  const hash = buildHash(next);
  const stateObj = {
    view: next.view || null,
    classId: next.classId || null,
    studentId: next.studentId || null,
    panel: next.panel || null
  };

  if (replace) history.replaceState(stateObj, "", hash || location.pathname);
  else history.pushState(stateObj, "", hash || location.pathname);
}

export function initRouter(handlers) {
  function applyRoute(route) {
    // routing resumes after login when the app shell is shown.
    if (document.body.classList.contains("login-active")) return;

    if (!route?.view) {
      handlers.showDashboard();
      return;
    }

    if (route.view === "teachers") {
      handlers.showTeachersManagement();
      return;
    }

    if (route.view === "class" && route.classId) {
      handlers.openClassById(route.classId, { panel: route.panel || undefined });
      return;
    }

    if (route.view === "student" && route.classId && route.studentId) {
      handlers.openClassById(route.classId, { panel: "students" });
      handlers.openStudentProfile(route.studentId);
      return;
    }

    handlers.showDashboard();
  }

  applyRoute(parseHash());

  window.addEventListener("popstate", () => {
    setState({ isPopStateNavigation: true });
    try {
      applyRoute(parseHash());
    } finally {
      setState({ isPopStateNavigation: false });
    }
  });

  window.addEventListener("hashchange", () => {
    if (state.isPopStateNavigation) return;
    applyRoute(parseHash());
  });
}
