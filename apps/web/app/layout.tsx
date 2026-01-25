import type { Metadata, Viewport } from "next";

import { AuthLoader, AuthProvider } from "@/features/auth";

import "./globals.css";

export const metadata: Metadata = {
  title: "Moneta - Финансовый трекер",
  description: "Управление личными финансами",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>
        <AuthProvider>
          <AuthLoader>{children}</AuthLoader>
        </AuthProvider>
      </body>
    </html>
  );
}
