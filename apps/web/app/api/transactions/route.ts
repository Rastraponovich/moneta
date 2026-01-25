import { NextResponse } from "next/server";

import { requireAuth } from "@/shared/lib/api-auth";
import { mockTransactions } from "@/shared/lib/mock-data";

export async function GET(request: Request) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  return NextResponse.json(mockTransactions);
}

export async function POST(request: Request) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  const body = await request.json();
  const newTransaction = {
    id: Date.now().toString(),
    ...body,
  };
  return NextResponse.json(newTransaction, { status: 201 });
}
