"use client";

import { PublicRoute } from "@/features/auth";
import { RegisterPage } from "@/views/register";

export default function Register() {
  return (
    <PublicRoute>
      <RegisterPage />
    </PublicRoute>
  );
}
