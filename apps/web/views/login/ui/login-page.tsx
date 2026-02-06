"use client";

import { AuthForm } from "@/widgets/auth-form";

export function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-foreground">
          Вход
        </h1>
        <AuthForm mode="login" />
      </div>
    </div>
  );
}
