/* ni ile ile - shared amoung two the teacger and parent */

export function syncBottomNavigation({ root, active, floatIcon, inactiveClass = "" }) {
  if (!root) return;

  if (!active) {
    if (inactiveClass) root.classList.add(inactiveClass);
    return;
  }

  if (inactiveClass) root.classList.remove(inactiveClass);
  root.style.setProperty("--active-index", active.dataset.navIndex || "0");

  if (floatIcon) {
    floatIcon.innerHTML = active.querySelector(".nav-icon")?.innerHTML || "";
  }
}

export function addNavigationRipple(button, event, className = "nav-ripple") {
  if (!button) return;

  const ripple = document.createElement("span");
  const rect = button.getBoundingClientRect();
  ripple.className = className;
  ripple.style.left = `${event.clientX - rect.left}px`;
  ripple.style.top = `${event.clientY - rect.top}px`;
  button.appendChild(ripple);
  ripple.addEventListener("animationend", () => ripple.remove(), { once: true });
}
