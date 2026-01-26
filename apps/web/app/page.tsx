"use client";

import { HomePage } from "@/views/home";

import { ProtectedRoute } from "@/features/auth";

export default function Home() {
  return (
    <ProtectedRoute>
      <HomePage />
    </ProtectedRoute>
  );
}
