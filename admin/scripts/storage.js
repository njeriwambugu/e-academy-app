const KEY = "esomaLoggedIn";

export function isLoggedIn() {
  try {
    return localStorage.getItem(KEY) === "true";
  } catch {
    return false;
  }
}

export function setLoggedIn(value) {
  try {
    if (value) localStorage.setItem(KEY, "true");
    else localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}