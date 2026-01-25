import { NextResponse } from "next/server";

import { mockTransactions } from "@/shared/lib/mock-data";

export async function GET() {
  return NextResponse.json(mockTransactions);
}

export async function POST(request: Request) {
  const body = await request.json();
  const newTransaction = {
    id: Date.now().toString(),
    ...body,
  };
  return NextResponse.json(newTransaction, { status: 201 });
}
