// src/app/api/auth/error/AuthErrorContent.tsx
'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function AuthErrorContent() {
  const searchParams = useSearchParams()
  const [message, setMessage] = useState("Ocurrió un error al iniciar sesión.")

  useEffect(() => {
    const error = searchParams.get("error")
    switch (error) {
      case "OAuthAccountNotLinked":
        setMessage("Esta cuenta ya está asociada a otro método de inicio de sesión.")
        break
      case "No se pudo iniciar sesión con Google. Intenta más tarde.":
        setMessage("No se pudo iniciar sesión con Google. Intenta más tarde.")
        break
      case "CredentialsSignin":
        setMessage("Credenciales inválidas. Verifica tu correo y contraseña.")
        break
      default:
        setMessage("Ocurrió un error desconocido al iniciar sesión.")
    }
  }, [searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-md p-6 text-center">
        <h1 className="text-xl font-semibold mb-4 text-red-600">Error de autenticación</h1>
        <p className="text-gray-700">{message}</p>
      </div>
    </div>
  )
}
