import { open as openModal, close as closeModal, showTransient as showTransientModal } from "../modal.js";
import { setButtonLoading } from "../utils/ui-state.js";

function acceptAnyCredentials() {
  return Promise.resolve({ ok: true });
}

export function createLoginGate({
  storageKey,
  onEnter,
  appShellSelector,
  logoutSelectors = [],
  authenticate = acceptAnyCredentials,
} = {}) {
  const loginPage = document.getElementById("loginPage");
  const appShell = appShellSelector ? document.querySelector(appShellSelector) : null;

  // the sign-in form has no error slot in the markup, so the gate owns one
  function setLoginError(message) {
    const form = document.getElementById("loginForm");
    if (!form) return;
    let el = form.querySelector(".login-error");
    if (!el) {
      el = document.createElement("p");
      el.className = "login-error";
      el.setAttribute("role", "alert");
      form.insertBefore(el, form.querySelector(".login-submit") || null);
    }
    el.textContent = message || "";
    el.hidden = !message;
  }

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
      const submitBtn = loginForm.querySelector("[type='submit']");
      setLoginError("");
      setButtonLoading(submitBtn, true);

      Promise.resolve(
        authenticate({
          identity: document.getElementById("loginIdentity")?.value || "",
          password: loginPassword?.value || "",
        })
      )
        .then((result) => {
          if (result && result.ok === false) {
            setLoginError(result.message || "Wrong username or password.");
            return;
          }
          if (!loginSuccessModal) {
            enterDashboard();
            return;
          }
          try {
            showTransientModal(loginSuccessModal, { onAfterHide: enterDashboard });
          } catch (err) {
            enterDashboard();
          }
        })
        .catch(() => setLoginError("We could not sign you in. Try again."))
        .finally(() => setButtonLoading(submitBtn, false));
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
      openModal(forgotModal);
    });

    forgotForm?.addEventListener("submit", (event) => {
      event.preventDefault();
      if (forgotFeedback) forgotFeedback.textContent = "Reset instructions are ready for the registered contact.";
      window.setTimeout(() => closeModal(forgotModal), 650);
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
