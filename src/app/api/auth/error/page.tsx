// src/app/api/auth/error/page.tsx
import { Suspense } from 'react'
import AuthErrorContent from './AuthErrorContent'

export default function Page() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <AuthErrorContent />
    </Suspense>
  )
}
