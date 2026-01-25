import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { generateToken } from "@/shared/lib/auth";

const SESSION_KEY = "moneta_session";

export async function POST(request: Request) {
  const { email, name } = await request.json();

  const newUser = {
    id: Date.now().toString(),
    email,
    name: name || email.split("@")[0],
    avatar: null,
  };

  const token = generateToken();
  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days

  const session = {
    token,
    userId: newUser.id,
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

  return NextResponse.json(
    {
      user: newUser,
      token,
    },
    { status: 201 }
  );
}
