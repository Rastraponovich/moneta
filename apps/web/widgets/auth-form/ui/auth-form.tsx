"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { useAuth } from "@/features/auth";

import { Button, Input } from "@/shared/ui";

interface AuthFormProps {
  mode: "login" | "register";
}

export function AuthForm({ mode }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const { login, register } = useAuth();
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register(email, password, name);
      }
      router.push("/");
    } catch {
      setError("Ошибка авторизации. Проверьте данные.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md mx-auto">
      {mode === "register" && (
        <Input
          id="name"
          type="text"
          label="Имя"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />
      )}
      <Input
        id="email"
        type="email"
        label="Email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
      />
      <Input
        id="password"
        type="password"
        label="Пароль"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        required
      />
      {error && <p className="text-danger text-sm">{error}</p>}
      <Button type="submit" className="w-full">
        {mode === "login" ? "Войти" : "Зарегистрироваться"}
      </Button>
    </form>
  );
}
