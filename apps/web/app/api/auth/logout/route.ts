import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const SESSION_KEY = "moneta_session";

export async function POST() {
  // Удаляем cookie на сервере
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_KEY);

  return NextResponse.json({ success: true });
}
