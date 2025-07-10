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