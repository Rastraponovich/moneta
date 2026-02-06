import { NextRequest, NextResponse } from "next/server";

const SESSION_KEY = "moneta_session";

const publicPaths = ["/login", "/register"];

function isProtectedPath(pathname: string): boolean {
  return pathname === "/" || pathname.startsWith("/transactions");
}

function isPublicAuthPath(pathname: string): boolean {
  return publicPaths.includes(pathname);
}

function getSessionFromRequest(
  request: NextRequest
): { expiresAt: number } | null {
  const cookie = request.cookies.get(SESSION_KEY)?.value;
  if (!cookie) {
    return null;
  }
  try {
    const session = JSON.parse(cookie) as { expiresAt?: number };
    const expiresAt = session.expiresAt;
    if (typeof expiresAt !== "number" || expiresAt < Date.now()) {
      return null;
    }
    return { expiresAt };
  } catch {
    return null;
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = getSessionFromRequest(request);

  if (isProtectedPath(pathname) && !session) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (isPublicAuthPath(pathname) && session) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
