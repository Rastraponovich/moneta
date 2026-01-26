import { NextResponse } from "next/server";

import { requireAuth } from "@/shared/lib/api-auth";
import { delay } from "@/shared/lib/delay";
import { mockCategories } from "@/shared/lib/mock-data";

export async function GET(request: Request) {
  const authError = await requireAuth(request);
  if (authError) {
    return authError;
  }

  await delay();
  return NextResponse.json(mockCategories);
}
