import { NextResponse } from "next/server";

import { generateToken } from "@/shared/lib/auth";
import { saveSession } from "@/shared/lib/auth";

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

  saveSession({
    token,
    userId: newUser.id,
    expiresAt,
  });

  return NextResponse.json(
    {
      user: newUser,
      token,
    },
    { status: 201 }
  );
}
