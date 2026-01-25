const SESSION_KEY = "moneta_session";

export interface Session {
  token: string;
  userId: string;
  expiresAt: number;
}

export function saveSession(session: Session): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    // Также сохраняем в cookies для доступа на сервере
    const expiresDate = new Date(session.expiresAt);
    document.cookie = `${SESSION_KEY}=${JSON.stringify(session)}; expires=${expiresDate.toUTCString()}; path=/; SameSite=Lax`;
  }
}

export function getSession(): Session | null {
  if (typeof window === "undefined") {
    return null;
  }

  const sessionData = localStorage.getItem(SESSION_KEY);
  if (!sessionData) {
    return null;
  }

  try {
    const session: Session = JSON.parse(sessionData);
    if (session.expiresAt < Date.now()) {
      removeSession();
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function removeSession(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(SESSION_KEY);
    // Также удаляем из cookies
    document.cookie = `${SESSION_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }
}

export function generateToken(): string {
  return `token_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}
