import { NextResponse } from "next/server";

import { removeSession } from "@/shared/lib/auth";

export async function POST() {
  removeSession();
  return NextResponse.json({ success: true });
}
