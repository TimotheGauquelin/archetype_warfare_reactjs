const TOKEN_KEY = "aw_session_token";

/** JWT hors localStorage (réduit la persistance XSS longue durée). */
export function getSessionToken(): string | null {
  try {
    return sessionStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setSessionToken(token: string | null): void {
  try {
    if (!token) {
      sessionStorage.removeItem(TOKEN_KEY);
      return;
    }
    sessionStorage.setItem(TOKEN_KEY, token);
  } catch {
    // private mode / quota
  }
}

export function clearSessionToken(): void {
  setSessionToken(null);
}
