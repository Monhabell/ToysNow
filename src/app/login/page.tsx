'use client'
import { useState } from 'react'
import Link from 'next/link'
import Navbar from "@/components/Navbar";
import Perfil from "@/components/Perfil/Perfil";
import type { Metadata } from 'next'

import '../../styles/login.css';
import { Mail, Lock, User, Eye, EyeOff, } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useSession, } from 'next-auth/react'

type UserData = {
    email: string;
    password: string;
    name: string;
    password_confirmation?: string;
};

export const metadata: Metadata = {
  title: 'Iniciar Sesión | ToysNow',
  robots: {
    index: false,   // ❌ No indexar
    follow: false   // ❌ No seguir enlaces
  }
}

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true)
    const [showPassword, setShowPassword] = useState(false)
    const [userData, setUserData] = useState<UserData>({
        email: '',
        password: '',
        name: '',
        password_confirmation: ''
    })

    const { data: session } = useSession()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleConfirmation = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        if (name === 'password_confirmation') {
            if (value !== userData.password) {
                setError('Las contraseñas no coinciden')
            } else {
                setError('')
            }

        }

        handleChange(e)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        if (name.includes('.')) {
            const [parent, child] = name.split('.')
            setUserData(prev => ({
                ...prev,
                [parent]: {
                    ...((typeof prev[parent as keyof UserData] === 'object' && prev[parent as keyof UserData] !== null)
                        ? prev[parent as keyof UserData] as unknown as object
                        : {}),
                    [child]: value
                }
            }))
        } else {
            setUserData(prev => ({ ...prev, [name]: value }))
        }
    }

    const validateForm = () => {
        if (!userData.email || !userData.password) {
            setError('Por favor completa todos los campos obligatorios')
            return false
        }

        if (!isLogin && (!userData.name)) {
            setError('Por favor completa todos los campos de dirección')
            return false
        }

        if (!/^\S+@\S+\.\S+$/.test(userData.email)) {
            setError('Por favor ingresa un email válido')
            return false
        }

        if (userData.password.length < 8 && !isLogin) {
            setError('La contraseña debe tener al menos 8 caracteres')
            return false
        }

        return true
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (!validateForm()) {
            setLoading(false);
            return;
        }

        try {
            console.log(userData)
            const endpoint = !isLogin ? '/api/auth/register' : false

            if (!endpoint) {
                console.log("Iniciando sesión...")
            }else{

                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(userData)
                })

                const data = await response.json()

                if (!response.ok) {
                    throw new Error(data.message || 'Error en la autenticación')
                }
                console.log("Registro exitoso:")
                console.log(data)
                console.log("...")

                //localStorage.setItem('token', data.token)
                //localStorage.setItem('user', JSON.stringify(data.user))
                router.push('login')

            }

            
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ocurrió un error inesperado')
        } finally {
            setLoading(false)
        }

        // inicio de sesion
        const result = await signIn("credentials", {
            redirect: false,
            email: userData.email,
            password: userData.password,
            callbackUrl: sessionStorage.getItem('currentPage') || '/', // o donde quieras redirigir
        });

        setLoading(false);

        if (result?.error) {
            setError(result.error);
        } else {
            router.push(result?.url || '/');
        }
    };




    return (
        <div className="min-h-screen flex flex-col">
            <div className="relative">
                <Navbar />
                
            </div>

            <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                {session?.user ? (
                    <div className="flex items-center space-x-2 text-xs md:text-sm">
                        <Perfil />
                    </div>
                ) : (
                    <div className="card-gold w-full max-w-md">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-gold-600">
                                {isLogin ? 'Inicia sesión' : 'Registro'}
                            </h2>
                            <p className="mt-2 text-sm text-gray-300">
                                {isLogin ? '¿No tienes una cuenta? ' : '¿Ya tienes una cuenta? '}
                                <button
                                    onClick={() => {
                                        setIsLogin(!isLogin)
                                        setError('')
                                    }}
                                    className="cursor-pointer font-medium text-gold-600 hover:text-gold-400"
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

                        <form className="space-y-4" onSubmit={handleSubmit}>
                            {!isLogin && (
                                <>
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
                                                value={userData.name}
                                                onChange={handleChange}
                                                className="input-gold"
                                                placeholder="Tu nombre completo"
                                            />
                                        </div>
                                    </div>
                                </>
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
                                        value={userData.email}
                                        onChange={handleChange}
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
                                        value={userData.password}
                                        onChange={handleChange}
                                        className="input-gold"
                                        placeholder={isLogin ? 'Ingresa tu contraseña' : 'Crea una contraseña segura'}
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="text-gold-500 hover:text-gold-400"
                                        >
                                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                </div>

                            </div>
                            {!isLogin && (
                                <div>

                                    <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                                        Confirmar contraseña
                                    </label>
                                    <div className="relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-gold-500" />
                                        </div>
                                        <input
                                            id="password_confirmation"
                                            name="password_confirmation"
                                            type={showPassword ? 'text' : 'password'}
                                            autoComplete={isLogin ? 'current-password' : 'new-password'}
                                            required
                                            value={userData.password_confirmation}
                                            onChange={handleConfirmation}
                                            className="input-gold"
                                            placeholder={isLogin ? 'Ingresa tu contraseña' : 'Crea una contraseña segura'}
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="text-gold-500 hover:text-gold-400"
                                            >
                                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                            </button>
                                        </div>
                                    </div>
                                    {!isLogin && (
                                        <p className="mt-2 text-xs text-gray-400">
                                            La contraseña debe tener al menos 8 caracteres.
                                        </p>
                                    )}

                                </div>
                            )}

                            {isLogin && (
                                <div className="flex items-center justify-between pt-2">
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

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    className="w-full boton-sed"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Procesando...
                                        </span>
                                    ) : isLogin ? 'Iniciar sesión' : 'Registrarse'}
                                </button>
                            </div>
                        </form>

                        {isLogin && (
                            <>
                               
                                <div className="mt-6 text-center text-xs text-gray-400">
                                    <p>
                                        Al {isLogin ? 'iniciar sesión' : 'registrarte'}, aceptas nuestros{' '}
                                        <Link href="/terminos" className="text-gold-500 hover:underline">
                                            Términos
                                        </Link>{' '}
                                        y{' '}
                                        <Link href="/privacidad" className="text-gold-500 hover:underline">
                                            Política de privacidad
                                        </Link>.
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </main>

        </div>
    )
}