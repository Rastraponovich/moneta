import { NextResponse } from "next/server";

import { mockCategories } from "@/shared/lib/mock-data";

export async function GET() {
  return NextResponse.json(mockCategories);
}
