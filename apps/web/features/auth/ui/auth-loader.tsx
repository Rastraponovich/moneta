"use client";

import { ReactNode } from "react";

import { UserHeader } from "@/widgets/user-header";

import { useAuth } from "../model/auth-context";

interface AuthLoaderProps {
  children: ReactNode;
}

export function AuthLoader({ children }: AuthLoaderProps) {
  const { isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-border border-t-primary mb-4" />
          <p className="text-muted">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {user && <UserHeader />}
      {children}
    </>
  );
}
