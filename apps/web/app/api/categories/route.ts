import { NextResponse } from "next/server";

import { requireAuth } from "@/shared/lib/api-auth";
import { mockCategories } from "@/shared/lib/mock-data";

export async function GET(request: Request) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  return NextResponse.json(mockCategories);
}
