// components/SessionProviderWrapper.tsx
// Agregar en la primera línea de cada archivo:
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { SessionProvider } from 'next-auth/react'
import { ReactNode } from 'react'

export default function SessionProviderWrapper({ children, session }: { children: ReactNode; session: any }) {
  return <SessionProvider session={session}>{children}</SessionProvider>
}
