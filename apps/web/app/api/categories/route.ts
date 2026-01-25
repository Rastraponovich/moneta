import { NextResponse } from "next/server";

import { mockCategories } from "@/shared/lib/mock-data";
import { requireAuth } from "@/shared/lib/api-auth";

export async function GET(request: Request) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  return NextResponse.json(mockCategories);
}
