"use client";

import { LoginPage } from "@/views/login";

import { PublicRoute } from "@/features/auth";

export default function Login() {
  return (
    <PublicRoute>
      <LoginPage />
    </PublicRoute>
  );
}
