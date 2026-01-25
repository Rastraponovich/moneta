import { NextResponse } from "next/server";

import { mockBalance } from "@/shared/lib/mock-data";

export async function GET() {
  return NextResponse.json(mockBalance);
}
