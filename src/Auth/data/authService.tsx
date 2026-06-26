const AUTH_KEY = "cineview_auth";

const USERNAME = import.meta.env.VITE_AUTH_USERNAME;
const PASSWORD = import.meta.env.VITE_AUTH_PASSWORD;

export function login(username: string, password: string): boolean {
  const isValid = username === USERNAME && password === PASSWORD;

  if (isValid) {
    sessionStorage.setItem(AUTH_KEY, "true");
  }

  return isValid;
}

export function logout() {
  sessionStorage.removeItem(AUTH_KEY);
}

export function isAuthenticated(): boolean {
  return sessionStorage.getItem(AUTH_KEY) === "true";
}
