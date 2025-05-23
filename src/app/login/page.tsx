'use client'
import { useState } from 'react'
import Link from 'next/link'
import Navbar from "@/components/Navbar";
import '../../styles/login.css';


import { ArrowLeft, Mail, Lock, User, Eye, EyeOff } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true)
    const [showPassword, setShowPassword] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [error, setError] = useState('')
    const router = useRouter()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (!email || !password) {
            setError('Por favor completa todos los campos')
            return
        }

        if (!isLogin && !name) {
            setError('Por favor ingresa tu nombre')
            return
        }

        console.log(isLogin ? 'Iniciando sesión' : 'Registrando', { email, password, name })

        setTimeout(() => {
            router.push('/')
        }, 1000)
    }

    return (
        <div className="min-h-screen flex flex-col">
            <div className="relative">
                <Navbar />
            </div>

            <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="card-gold">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-gold-600">
                            {isLogin ? 'Inicia sesión en tu cuenta' : 'Crea tu cuenta'}
                        </h2>
                        <p className="mt-2 text-sm text-gray-300">
                            {isLogin ? '¿No tienes una cuenta? ' : '¿Ya tienes una cuenta? '}
                            <button
                                onClick={() => setIsLogin(!isLogin)}
                                className="cursor-pointer font-medium text-gold-600 hover:text-gold-400 focus:outline-none transition-colors"
                            >
                                {isLogin ? 'Regístrate' : 'Inicia sesión'}
                            </button>
                        </p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-900/50 text-red-300 text-sm rounded-md border border-red-700">
                            {error}
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {!isLogin && (
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                                    Nombre completo
                                </label>
                                <div className="relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-gold-500" />
                                    </div>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        autoComplete="name"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="input-gold"
                                        placeholder="Tu nombre"
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                                Correo electrónico
                            </label>
                            <div className="relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gold-500" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="input-gold"
                                    placeholder="tu@email.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                                Contraseña
                            </label>
                            <div className="relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gold-500" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete={isLogin ? 'current-password' : 'new-password'}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="input-gold"
                                    placeholder={isLogin ? 'Ingresa tu contraseña' : 'Crea una contraseña segura'}
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="text-gold-500 hover:text-gold-400 focus:outline-none"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5" />
                                        ) : (
                                            <Eye className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                            </div>
                            {!isLogin && (
                                <p className="mt-2 text-xs text-gray-400">
                                    La contraseña debe tener al menos 8 caracteres.
                                </p>
                            )}
                        </div>

                        {isLogin && (
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        name="remember-me"
                                        type="checkbox"
                                        className="h-4 w-4 text-gold-600 focus:ring-gold-500 border-gray-600 rounded bg-gray-800"
                                    />
                                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                                        Recuérdame
                                    </label>
                                </div>

                                <div className="text-sm">
                                    <Link
                                        href="/recuperar-contrasena"
                                        className="font-medium text-gold-500 hover:text-gold-400"
                                    >
                                        ¿Olvidaste tu contraseña?
                                    </Link>
                                </div>
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                className="boton-sed"
                            >
                                {isLogin ? 'Iniciar sesión' : 'Registrarse'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-700" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-gray-900 text-gray-400">
                                    O continúa con
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                className="w-full inline-flex justify-center py-2 px-4 border border-gray-700 rounded-md shadow-sm bg-gray-800 text-sm font-medium text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold-500"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 48 48">
                                    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                                </svg>
                            </button>

                            <button
                                type="button"
                                className="w-full inline-flex justify-center py-2 px-4 border border-gray-700 rounded-md shadow-sm bg-gray-800 text-sm font-medium text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold-500"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 48 48">
                                    <path fill="#039be5" d="M24 5A19 19 0 1 0 24 43A19 19 0 1 0 24 5Z"></path><path fill="#fff" d="M26.572,29.036h4.917l0.772-4.995h-5.69v-2.73c0-2.075,0.678-3.915,2.619-3.915h3.119v-4.359c-0.548-0.074-1.707-0.236-3.897-0.236c-4.573,0-7.254,2.415-7.254,7.917v3.323h-4.701v4.995h4.701v13.729C22.089,42.905,23.032,43,24,43c0.875,0,1.729-0.08,2.572-0.194V29.036z"></path>
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className="mt-6 text-center text-xs text-gray-400">
                        <p>
                            Al {isLogin ? 'iniciar sesión' : 'registrarte'}, aceptas nuestros{' '}
                            <Link href="/terminos" className="text-gold-500 hover:underline">
                                Términos y condiciones
                            </Link>{' '}
                            y nuestra{' '}
                            <Link href="/privacidad" className="text-gold-500 hover:underline">
                                Política de privacidad
                            </Link>
                            .
                        </p>
                    </div>
                </div>
            </main>
        </div>
    )
}