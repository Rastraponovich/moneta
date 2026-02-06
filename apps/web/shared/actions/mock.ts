"use server";

import { revalidatePath } from "next/cache";

import { resetStore } from "@/shared/lib/mock-store";
import { requireServerAuth } from "@/shared/lib/server-auth";

export async function resetMocks(): Promise<void> {
  await requireServerAuth();
  resetStore();
  revalidatePath("/");
}
