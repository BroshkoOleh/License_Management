"use client";

import { SnackbarProvider } from "notistack";
import { ReactNode } from "react";
// Імпортуйте інші провайдери за потреби

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <SnackbarProvider>
      {/* Можна додати інші провайдери тут */}
      {children}
    </SnackbarProvider>
  );
}
