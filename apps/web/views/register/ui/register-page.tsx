"use client";

import { AuthForm } from "@/widgets/auth-form";

export function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Регистрация</h1>
        <AuthForm mode="register" />
      </div>
    </div>
  );
}
