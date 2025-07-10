// Agregar en la primera línea de cada archivo:
/* eslint-disable @typescript-eslint/no-explicit-any */


'use client'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBag, ShoppingCart, User, Search } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import '../styles/Navbar.css'
import { useSession, signOut } from 'next-auth/react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const router = useRouter();

  const { data: session,  } = useSession()

  const handleSearch = (e: any) => {
    e.preventDefault();
    if (search.trim() !== '') {
      router.push(`/productos?buscar=${encodeURIComponent(search)}`);
    }
  };

  const token = session?.apiToken|| '';

  return (
    <div className="w-full border-b border-gold-500 fixed top-0 left-0 right-0 z-50 bg-white">

      {/* Top bar */}
      <div className="br-superior py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4 text-xs md:text-sm">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
              Envíos discretos 24/7 {token ? `| Token: ${token}` : ''}
            </span>
            <span>|</span>
            <span className="hidden md:block">Compra segura y confidencial</span>
          </div>

          <div className="flex items-center space-x-4">
            {session?.user ? (
              <div className="flex items-center space-x-2 text-xs md:text-sm">
                <button className='perfil' >
                  <Image
                    src={session.user.image || 'https://img.freepik.com/premium-vector/profile-picture-placeholder-avatar-silhouette-gray-tones-icon-colored-shapes-gradient_1076610-40164.jpg?semt=ais_hybrid&w=740'}
                    alt={session.user.name || 'Usuario'}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                  <span className="font-medium truncate max-w-[100px]">{session.user.name}</span>

                </button>
                <button
                  onClick={() => signOut()}
                  className="ml-2 hover:text-magenta-100 transition-colors cursor-pointer flex items-center"
                >
                  Salir
                </button>
              </div>
            ) : (
              <Link href="/login" className="hover:text-magenta-400 transition-colors flex items-center">
                <User className="w-4 h-4 mr-1" />
                <span className="text-xs md:text-sm">Login</span>
              </Link>
            )}

          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="br-inferior text-black">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row md:justify-between md:items-center">

          {/* Logo y menú móvil */}
          <div className="flex justify-between items-center">
            <Link href="/" className="relative h-12 w-48">
              <Image
                src="/images/logos/logo2.png"
                alt="Sensual Secrets - Tienda erótica premium"
                fill
                className="object-contain object-left"
                priority
              />
            </Link>
            <div className="flex items-center space-x-4 md:hidden">
              <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none cursor-pointer">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
              <Link href="/carrito" className="relative">
                <ShoppingBag className="w-6 h-6" />
                <span className="absolute -top-2 -right-2 bg-magenta-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">0</span>
              </Link>
            </div>
          </div>

          {/* Buscador */}
          <form onSubmit={handleSearch} className="mt-3 md:mt-0 md:flex-1 md:max-w-xl md:mx-6">
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="¿Qué deseas explorar...?"
                className="w-full py-2.5 px-5 pr-12 rounded-full border-2 border-gold-400 focus:outline-none focus:border-magenta-500 bg-black bg-opacity-70 text-gold-100 placeholder-gold-400 shadow-lg hover:bg-opacity-90 transition-all duration-300"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:scale-110 transition-transform"
                aria-label="Buscar productos"
              >
                <Search className="w-5 h-5 text-gold-400 hover:text-magenta-300" />
              </button>
            </div>
          </form>

          {/* Links */}
          <div className={`${isOpen ? 'block' : 'hidden'} md:block mt-4 md:mt-0`}>
            <nav className="flex flex-col mr-5 md:flex-row space-y-3 md:space-y-0 md:space-x-8 font-medium">
              <Link href="/" className="hover:text-white transition-colors border-b-2 border-transparent hover:text-red pb-1">Inicio</Link>
              <Link href="/productos" className="hover:text-white transition-colors border-b-2 border-transparent hover:border-magenta-600 pb-1">Productos</Link>
            </nav>
          </div>

          {/* Carrito desktop */}
          <div className="hidden md:flex items-center">
            <Link href="/carrito" className="relative group">
              {/* Icono más sensual con efecto hover */}
              <div className="relative p-2 rounded-full transition-all duration-300 group-hover:bg-red-100/30">
                <ShoppingCart className="w-6 h-6 text-white-600 group-hover:text-red-700 transition-colors" />

                {/* Notificación con estilo sexy */}
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center group-hover:bg-white-700 transition-all duration-300 shadow-[0_2px_5px_rgba(219,39,119,0.3)]">
                  0
                </span>

                {/* Efecto de pulso sutil al tener items */}
                <span className="absolute inset-0 rounded-full bg-pink-400/20 animate-ping opacity-0 group-hover:opacity-100"></span>
              </div>

              {/* Tooltip sexy (opcional) */}
              <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-red-600 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                Tu selección picante
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
