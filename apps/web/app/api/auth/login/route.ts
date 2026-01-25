import { NextResponse } from "next/server";

import { generateToken, saveSession } from "@/shared/lib/auth";
import { mockUserCredentials, mockUsers } from "@/shared/lib/mock-users";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  if (
    email === mockUserCredentials.email &&
    password === mockUserCredentials.password
  ) {
    const user = mockUsers[0];
    const token = generateToken();
    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days

    saveSession({
      token,
      userId: user.id,
      expiresAt,
    });

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
      },
      token,
    });
  }

  return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
}
