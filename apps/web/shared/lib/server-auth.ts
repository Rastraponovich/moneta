import { getServerSession } from "./api-auth";

/**
 * Проверяет авторизацию в Server Action
 * @returns Session если авторизован
 * @throws Error если не авторизован
 */
export async function requireServerAuth() {
  const session = await getServerSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  return session;
}
