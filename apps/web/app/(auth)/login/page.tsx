"use client";

import { PublicRoute } from "@/features/auth";
import { LoginPage } from "@/views/login";

export default function Login() {
  return (
    <PublicRoute>
      <LoginPage />
    </PublicRoute>
  );
}
