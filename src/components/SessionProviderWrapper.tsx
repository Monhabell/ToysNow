// components/SessionProviderWrapper.tsx
// Agregar en la primera línea de cada archivo:
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { SessionProvider } from 'next-auth/react'
import { ReactNode } from 'react'

interface SessionProviderWrapperProps {
  children: ReactNode
  session?: any // Hacer la sesión opcional
}

export default function SessionProviderWrapper({ 
  children, 
  session = null // Valor por defecto
}: SessionProviderWrapperProps) {
  return <SessionProvider session={session}>{children}</SessionProvider>
}