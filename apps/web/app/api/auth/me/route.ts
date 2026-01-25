import { NextResponse } from "next/server";

import { getSession } from "@/shared/lib/auth";
import { mockUsers } from "@/shared/lib/mock-users";

export async function GET() {
  const session = getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = mockUsers.find((u) => u.id === session.userId);

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: user.id,
    email: user.email,
    name: user.name,
    avatar: user.avatar,
  });
}
