"use client";

import { ProtectedRoute } from "@/features/auth";
import { HomePage } from "@/views/home";

export default function Home() {
  return (
    <ProtectedRoute>
      <HomePage />
    </ProtectedRoute>
  );
}
