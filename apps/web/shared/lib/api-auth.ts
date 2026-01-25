import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { Session } from "./auth";

const SESSION_KEY = "finvam_session";

/**
 * Получает сессию из cookies на сервере
 */
export function getServerSession(): Session | null {
  const cookieStore = cookies();
  const sessionData = cookieStore.get(SESSION_KEY)?.value;

  if (!sessionData) {
    return null;
  }

  try {
    const session: Session = JSON.parse(sessionData);
    if (session.expiresAt < Date.now()) {
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

/**
 * Проверяет авторизацию в API маршруте
 * @param _request - Request объект из Next.js route handler (не используется, но нужен для совместимости)
 * @returns NextResponse с ошибкой 401 если не авторизован, или null если авторизован
 */
export function requireAuth(
  _request: Request
): NextResponse<{ error: string }> | null {
  const session = getServerSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return null;
}
