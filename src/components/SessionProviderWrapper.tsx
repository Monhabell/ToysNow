// components/SessionProviderWrapper.tsx
// Agregar en la primera línea de cada archivo:
/* eslint-disable @typescript-eslint/no-explicit-any */
// components/SessionProviderWrapper.tsx
'use client';

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

interface SessionProviderWrapperProps {
  children: ReactNode;
}

export default function SessionProviderWrapper({ children }: SessionProviderWrapperProps) {
  return (
    <SessionProvider
      refetchInterval={5 * 60} // Revalida cada 5 minutos
      refetchOnWindowFocus={false} // Importante: desactivar para evitar problemas
      refetchWhenOffline={false}
    >
      {children}
    </SessionProvider>
  );
}