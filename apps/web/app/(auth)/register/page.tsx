"use client";

import { RegisterPage } from "@/views/register";

import { PublicRoute } from "@/features/auth";

export default function Register() {
  return (
    <PublicRoute>
      <RegisterPage />
    </PublicRoute>
  );
}
