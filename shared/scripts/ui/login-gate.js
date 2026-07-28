/*
 * Shared demo login gate — no real auth backend, any submission succeeds.
 * Was three independent copies (admin/scripts/legacy.js,
 * teacher/scripts/teacher-app.js, parent/scripts/app.js) of the same
 * enter/show/bind trio: toggle the `login-active` body class, persist a
 * localStorage flag, show a transient success modal, wire the
 * show/hide-password toggle and the forgot-password modal.
 *
 * All three portals already share the exact same login markup ids
 * (loginForm, loginIdentity, loginPassword, togglePassword,
 * forgotPasswordBtn, forgotPasswordModal, forgotPasswordForm,
 * forgotFeedback, loginSuccessModal), so this module reads those directly —
 * only what genuinely differs per portal (the localStorage key, what to do
 * right after logging in, which app-shell element to un-hide, which logout
 * buttons trigger it) is passed in.
 */

export function createLoginGate({ storageKey, onEnter, appShellSelector, logoutSelectors = [] } = {}) {
  const loginPage = document.getElementById("loginPage");
  const appShell = appShellSelector ? document.querySelector(appShellSelector) : null;

  function enterDashboard() {
    document.body.classList.remove("login-active");
    loginPage?.setAttribute("aria-hidden", "true");
    appShell?.setAttribute("aria-hidden", "false");
    try {
      localStorage.setItem(storageKey, "true");
    } catch (err) {
      // ignore storage failures
    }
    onEnter?.();
  }

  function showLogin() {
    appShell?.setAttribute("aria-hidden", "true");
    loginPage?.setAttribute("aria-hidden", "false");
    document.body.classList.add("login-active");
    try {
      localStorage.removeItem(storageKey);
    } catch (err) {
      // ignore storage failures
    }
    window.setTimeout(() => document.getElementById("loginIdentity")?.focus(), 120);
  }

  function bind() {
    const loginForm = document.getElementById("loginForm");
    const loginPassword = document.getElementById("loginPassword");
    const togglePasswordBtn = document.getElementById("togglePassword");
    const forgotBtn = document.getElementById("forgotPasswordBtn");
    const forgotModal = document.getElementById("forgotPasswordModal");
    const forgotForm = document.getElementById("forgotPasswordForm");
    const forgotFeedback = document.getElementById("forgotFeedback");
    const loginSuccessModal = document.getElementById("loginSuccessModal");

    loginForm?.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!loginSuccessModal) {
        enterDashboard();
        return;
      }
      try {
        window.Modals?.showTransient(loginSuccessModal, { onAfterHide: enterDashboard });
      } catch (err) {
        enterDashboard();
      }
    });

    togglePasswordBtn?.addEventListener("click", () => {
      const isVisible = loginPassword.type === "text";
      loginPassword.type = isVisible ? "password" : "text";
      togglePasswordBtn.setAttribute("aria-pressed", String(!isVisible));
      togglePasswordBtn.setAttribute("aria-label", isVisible ? "Show password" : "Hide password");
    });

    forgotBtn?.addEventListener("click", () => {
      forgotForm?.reset();
      if (forgotFeedback) {
        forgotFeedback.textContent = "Enter the phone number you used to create an account. A recovery code will be sent to this number.";
      }
      window.Modals?.open(forgotModal);
    });

    forgotForm?.addEventListener("submit", (event) => {
      event.preventDefault();
      if (forgotFeedback) forgotFeedback.textContent = "Reset instructions are ready for the registered contact.";
      window.setTimeout(() => window.Modals?.close(forgotModal), 650);
    });

    logoutSelectors.forEach((sel) => {
      document.querySelector(sel)?.addEventListener("click", showLogin);
    });

    // restore session on refresh
    try {
      if (localStorage.getItem(storageKey) === "true") {
        document.body.classList.remove("login-active");
        loginPage?.setAttribute("aria-hidden", "true");
        appShell?.setAttribute("aria-hidden", "false");
      }
    } catch (err) {
      // ignore storage failures
    }
  }

  return { enterDashboard, showLogin, bind };
}
