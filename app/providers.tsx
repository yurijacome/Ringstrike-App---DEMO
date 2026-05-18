"use client";

import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import MockApiProvider from "@/app/MockApiProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <MockApiProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </MockApiProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
