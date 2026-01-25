"use client";

import { ReactNode } from "react";

import { useAuth } from "../model/auth-context";

interface AuthLoaderProps {
  children: ReactNode;
}

export function AuthLoader({ children }: AuthLoaderProps) {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
