import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { generateToken } from "@/shared/lib/auth";
import { mockUserCredentials, mockUsers } from "@/shared/lib/mock-users";

const SESSION_KEY = "moneta_session";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  if (
    email === mockUserCredentials.email &&
    password === mockUserCredentials.password
  ) {
    const user = mockUsers[0];
    const token = generateToken();
    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days

    const session = {
      token,
      userId: user.id,
      expiresAt,
    };

    // Устанавливаем cookie на сервере
    const cookieStore = await cookies();
    const expiresDate = new Date(expiresAt);
    cookieStore.set(SESSION_KEY, JSON.stringify(session), {
      expires: expiresDate,
      path: "/",
      sameSite: "lax",
      httpOnly: false, // Нужно false, чтобы клиент мог читать для localStorage
    });

    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
      },
      token,
    });

    return response;
  }

  return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
}
