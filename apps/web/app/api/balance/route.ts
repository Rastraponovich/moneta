import { NextResponse } from "next/server";

import { mockBalance } from "@/shared/lib/mock-data";
import { requireAuth } from "@/shared/lib/api-auth";

export async function GET(request: Request) {
  const authError = requireAuth(request);
  if (authError) return authError;

  return NextResponse.json(mockBalance);
}
