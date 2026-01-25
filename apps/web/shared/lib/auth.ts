const SESSION_KEY = "finvam_session";

export interface Session {
  token: string;
  userId: string;
  expiresAt: number;
}

export function saveSession(session: Session): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
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
  }
}

export function generateToken(): string {
  return `token_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}
