"use client";

import { useTransition } from "react";

import { LogOut, RotateCcw, Wallet } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { useAuth } from "@/features/auth/model/auth-context";

import { resetMocks } from "@/shared/actions/mock";
import { Button } from "@/shared/ui";

export function UserHeader() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isResetting, startTransition] = useTransition();

  function handleResetMocks() {
    startTransition(async () => {
      await resetMocks();
      router.refresh();
    });
  }

  if (!user) {
    return null;
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="bg-surface border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Wallet className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold text-foreground">Moneta</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              {user.avatar ? (
                <Image
                  src={user.avatar}
                  alt={user.name}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-semibold">
                  {getInitials(user.name)}
                </div>
              )}
              <div className="hidden md:block">
                <p className="text-sm font-semibold text-foreground">
                  {user.name}
                </p>
                <p className="text-xs text-muted">{user.email}</p>
              </div>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleResetMocks}
              disabled={isResetting}
              className="flex items-center gap-2"
              title="Восстановить тестовые данные"
            >
              <RotateCcw
                className={`w-4 h-4 ${isResetting ? "animate-spin" : ""}`}
              />
              <span className="hidden sm:inline">
                {isResetting ? "Сброс..." : "Тест. данные"}
              </span>
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={logout}
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Выйти</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
