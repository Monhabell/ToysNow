/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useEffect, useState } from 'react'
import Navbar from "@/components/Navbar"
import ListaProductos from '@/components/productos/ListaProductos'
import Category from '@/components/Categorias/Category'
import ProductoDestacado from '@/components/ProductoDestacado'
import Banner from '@/components/Banner'
import { GoChevronRight, GoChevronLeft } from "react-icons/go";
import { FiArrowRight } from "react-icons/fi";
import Image from 'next/image';

import Link from 'next/link';
import type { Producto } from '@/types/productos'

type ProductoDestacadoType = {

  id: string | number
  slug?: string
  name: string
  price: number | string
  description: string
  images: { url: string }[]
  relevance?: number
  compare_price?: number
} | null

// Tiempo de vida del cache en milisegundos (5 minutos)
const CACHE_LIFETIME = 5 * 60 * 1000;

// Función para normalizar productos
const normalizeProduct = (product: any): ProductoDestacadoType => {
  if (!product) return null;
  const getImageUrl = (url: string) => {
    if (!url) return 'https://www.jcprola.com/data/sinfoto.png';
    if (url.startsWith('http')) return url;
    return `${url.startsWith('/') ? url : `${url}`}`;
  };

  return {
    id: product.id || 0,
    slug: product.slug || '',
    name: product.name || 'Producto sin nombre',
    price: product.price || 0,
    description: product.description || '',
    images: product.images?.length > 0
      ? product.images.map((img: any) => ({
        url: getImageUrl(img.url)
      }))
      : [{ url: 'https://www.jcprola.com/data/sinfoto.png' }],
    relevance: product.relevance || 0,
    compare_price: product.compare_price || 0
  };
};

export default function Home() {
  const [promociones, setPromociones] = useState<Producto[]>([])
  const [promocionesCant, setProductCant] = useState<Producto[]>([])
  const [productoDestacado, setProductoDestacado] = useState<ProductoDestacadoType>(null)
  const [productoDestacado2, setProductoDestacado2] = useState<ProductoDestacadoType>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Verificar si hay datos en cache y si aún son válidos
        const cachedData = localStorage.getItem('productosCache');
        const cacheTimestamp = localStorage.getItem('productosCacheTimestamp');

        if (cachedData && cacheTimestamp) {
          const now = new Date().getTime();
          const cachedTime = parseInt(cacheTimestamp, 10);

          if (now - cachedTime < CACHE_LIFETIME) {
            // Usar datos del cache
            const { promociones: cachedPromociones, destacado: cachedDestacado, productoDestacado2: cachedDestacado2, shuffled: cachedShuffled } = JSON.parse(cachedData);
            setPromociones(cachedPromociones);
            setProductoDestacado(cachedDestacado);
            setProductoDestacado2(cachedDestacado2);
            setProductCant(cachedShuffled);
            setLoading(false);
            return;
          }
        }

        // Si no hay cache válido, hacer la petición
        const [productosRes, destacadoRes] = await Promise.all([
          fetch('/api/productos'),
          fetch('/api/productos')
        ])

        if (!productosRes.ok || !destacadoRes.ok) {
          throw new Error('Error al cargar datos')
        }

        const productosData = await productosRes.json()
        const destacadoData = await destacadoRes.json()

        // Procesar promociones
        const filtrados = productosData.data.filter((p: any) => p.compare_price > 0)
        setPromociones(filtrados)

        // Mostrar 10 productos al azar
        const shuffled = productosData.data
          .filter((p: any) => p.compare_price >= 0)
          .sort(() => 0.5 - Math.random())
          .slice(0, 5);
        setProductCant(shuffled);

        // Procesar productos destacados
        const destacado = normalizeProduct(
          destacadoData.data.find((p: Producto) => p.relevance === 1) ||
          destacadoData.data[0]
        )
        setProductoDestacado(destacado)

        const destacadoSecundario = normalizeProduct(
          destacadoData.data.find((p: Producto) => p.relevance === 2) ||
          destacadoData.data[1] ||
          destacadoData.data[0]
        )

        setProductoDestacado2(destacadoSecundario)

        // Guardar en cache
        const cacheData = {
          promociones: filtrados,
          destacado: destacado,
          productoDestacado2: destacadoSecundario,
          shuffled: shuffled,
        };

        localStorage.setItem('productosCache', JSON.stringify(cacheData));
        localStorage.setItem('productosCacheTimestamp', new Date().getTime().toString());

      } catch (err) {
        console.error('Error:', err)
        setError('Error al cargar los datos. Por favor intenta nuevamente.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const scrollLeft = (deslizar: string) => {
    const slider = document.getElementById(deslizar)
    slider?.scrollBy({ left: -300, behavior: 'smooth' })
  }

  const scrollRight = (deslizar: string) => {
    const slider = document.getElementById(deslizar)
    slider?.scrollBy({ left: 500, behavior: 'smooth' })
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-b from-black to-purple-900/20 z-50 flex flex-col items-center justify-center space-y-8 p-6">
        <div className="relative group">
          <div className="absolute -inset-2 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-all duration-500 animate-pulse"></div>
          <div className="relative w-32 h-32 flex items-center justify-center">
            <div className="absolute inset-0 border-2 border-pink-500/30 rounded-full animate-[pulse_3s_ease-in-out_infinite]"></div>
            <div className="absolute inset-4 border border-pink-400/50 rounded-full animate-[pulse_3s_ease-in-out_infinite] delay-100"></div>
            <div className="relative z-10 w-20 h-20">
              <Image
                src="/images/logos/icono-logo-toys.ico"
                alt="ToysNow"
                fill
                className="object-contain drop-shadow-lg"
                priority
              />
            </div>
          </div>
        </div>

        <div className="w-full max-w-md">
          <div className="h-1.5 bg-gray-800/50 rounded-full overflow-hidden backdrop-blur-sm">
            <div
              className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 rounded-full animate-progress"
              style={{
                backgroundSize: '200% 100%',
                animation: 'progress 2s ease-in-out infinite',
                boxShadow: '0 0 8px rgba(236, 72, 153, 0.6)'
              }}
            ></div>
          </div>
        </div>

        <div className="text-center space-y-3 max-w-md">
          <h2 className="text-2xl md:text-3xl font-light text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-200">
            <span className="animate-fadeIn">Cargando tu experiencia sensual...</span>
          </h2>
          <p className="text-sm text-pink-200/80 font-light tracking-wider">
            <span className="inline-block animate-typing overflow-hidden whitespace-nowrap border-r-2 border-pink-400/50 pr-1">
              Seleccionando los productos más exclusivos para tu placer...
            </span>
          </p>
        </div>

        <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 bg-pink-400/30 rounded-full animate-bounce"
              style={{
                animationDelay: `${i * 0.1}s`,
                animationDuration: '1.5s'
              }}
            ></div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black/95 z-50 flex flex-col items-center justify-center p-6">
        <div className="relative mb-8 group">
          <div className="absolute -inset-2 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition-all duration-500 animate-tilt"></div>
          <div className="relative flex items-center justify-center p-6 bg-black rounded-lg border border-pink-500/30">
            <div className="text-center mb-8">
              <div className="relative w-full max-w-xs h-20 mx-auto">
                <Image
                  src="/images/logos/logo2.png"
                  alt="ToysNow - Tienda erótica premium"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <p className="text-xs text-pink-300 mt-1 tracking-widest opacity-80">
                LUXURY ADULT COLLECTION
              </p>
            </div>
          </div>
        </div>

        <div className="text-center max-w-md">
          <div className="mb-6 flex justify-center">
            <div className="animate-pulse">
              <svg className="w-16 h-16 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-pink-400 mb-3">¡Ups! Algo salió mal</h2>
          <p className="text-gray-300 mb-8">{error}</p>

          <button
            onClick={() => window.location.reload()}
            className="relative overflow-hidden group bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-medium py-3 px-8 rounded-full transition-all duration-300 shadow-lg"
          >
            <span className="relative z-10 flex items-center">
              Reintentar
              <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </span>
            <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </button>

          <p className="text-sm text-gray-500 mt-6">
            Si el problema persiste, contáctanos en{' '}
            <a href="mailto:soporte@toysnow.com" className="text-pink-400 hover:underline">
              soporte@toysnow.com
            </a>
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Navbar />
      
      <div className="relative bg-black min-h-screen mt-42 sm:mt-30">
        {/* Banner */}
        <div className="overflow-hidden">
          <Banner />
          <div className="bottom-10 sm:bottom-20 left-0 right-0 text-center z-2 px-4">
            <div className='mr-5'>
              <Category />
            </div>
          </div>
        </div>

        <div className='z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 content '>

          <div className="card-destacado">
            <div className="carrusel_productos">
              {/* Botón izquierdo - visible solo en desktop */}
              <button
                onClick={() => scrollLeft('slider')}
                className="hidden sm:block absolute left-5 top-1/2 -translate-y-1/2 z-10 bg-black/80 hover:bg-gold-600 text-white hover:text-white rounded-full p-2 sm:p-3 shadow-lg transition-all"
              >
                <GoChevronLeft size={20} className="sm:w-6 sm:h-6" />
              </button>

              <div
                id="slider"
                className="overflow-x-auto py-4 sm:py-6 scroll-smooth scrollbar-hide space-x-4 sm:space-x-6"
              >
                <ListaProductos
                  productos={promocionesCant.map(p => ({
                    ...p,
                    images: p.images || [{ url: 'https://www.jcprola.com/data/sinfoto.png' }]
                  }))}
                  isSlider
                />
              </div>

              {/* Botón derecho - visible solo en desktop */}
              <button
                onClick={() => scrollRight('slider')}
                className="hidden sm:block absolute right-5 top-1/2 -translate-y-1/2 z-10 bg-black/80 hover:bg-gold-600 text-white hover:text-white rounded-full p-2 sm:p-3 shadow-lg transition-all"
              >
                <GoChevronRight size={20} className="sm:w-6 sm:h-6" />
              </button>
            </div>

            <div className="producto_destacado">
              {productoDestacado && (
                <ProductoDestacado
                  img={productoDestacado.images[0]?.url || '/images/default.webp'}
                  name={productoDestacado.name}
                  price={productoDestacado.price.toString()}
                  slug={productoDestacado.slug}
                />
              )}
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <main className="z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          {/* Sección Ofertas */}
          <section className="mb-12 sm:mb-20 pt-4 sm:pt-0">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end pb-6 sm:pb-8 border-b-2 border-gold-500/30">
              <div className="mb-4 sm:mb-0">
                <h2 className="text-2xl sm:text-3xl font-bold text-gold-600 mb-1 sm:mb-2">OFERTAS CALIENTES</h2>
                <p className="text-sm sm:text-base text-gold-500">Productos que despertarán tus sentidos</p>
              </div>
              <Link href="/productos" className="self-end sm:self-auto flex items-center text-sm sm:text-base text-gold-600 hover:text-gold-300 group transition-colors">
                Ver todas
                <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Destacado del mes */}
            {productoDestacado2 && (
              <section className="relative rounded-xl sm:rounded-2xl overflow-hidden mb-12 sm:mb-20 h-[350px] sm:h-[500px]">
                <div>{productoDestacado2.images[0]?.url}</div>
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent z-1"></div>
                <Image
                  src={"https://www.softgenix.space/storage/tenants/2b85d6a6-1059-4929-a8bb-5f3d7ca5c732/images/" + productoDestacado2.images[0]?.url || '/images/default.webp'}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = '/images/default.webp';
                  }}
                  fill
                  alt={productoDestacado2.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute left-4 sm:left-10 top-1/2 -translate-y-1/2 z-2 max-w-xs sm:max-w-md px-2 sm:px-0">
                  <span className="text-sm sm:text-base text-white font-semibold">DESTACADO DEL MES</span>
                  <h2 className="text-2xl sm:text-4xl font-bold text-white my-2 sm:my-4">{productoDestacado2.name}</h2>

                  <Link
                    href={`/detalle/${productoDestacado2.slug}`}
                    className="bg-magenta-600 hover:bg-gold-500 text-white font-bold py-2 px-6 sm:py-3 sm:px-8 rounded-full text-sm sm:text-lg transition-all duration-300 flex items-center group"
                  >
                    DESCUBRIR
                    <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </section>
            )}

            {/* Slider productos mas vendidos*/}
            <div className="mt-2 sm:mt-8 content relative">
              <button
                onClick={() => scrollLeft('slider2')}
                className="absolute left-5 top-1/2 -translate-y-1/2 z-10 bg-black/80 hover:bg-gold-600 text-white hover:text-white rounded-full p-2 sm:p-3 shadow-lg transition-all"
              >
                <GoChevronLeft size={20} className="sm:w-6 sm:h-6" />
              </button>

              <div
                id="slider2"
                className="overflow-x-auto py-4 sm:py-6 scroll-smooth scrollbar-hide space-x-4 sm:space-x-6"
              >
                <ListaProductos
                  productos={promociones.map(p => ({
                    ...p,
                    images: p.images || [{ url: 'https://www.jcprola.com/data/sinfoto.png' }]
                  }))}
                  isSlider
                />
              </div>

              <button
                onClick={() => scrollRight('slider2')}
                className="absolute right-5 top-1/2 -translate-y-1/2 z-10 bg-black/80 hover:bg-gold-600 text-white hover:text-white rounded-full p-2 sm:p-3 shadow-lg transition-all"
              >
                <GoChevronRight size={20} className="sm:w-6 sm:h-6" />
              </button>
            </div>
          </section>
        </main>

        {/* Newsletter */}
        <footer className="bg-gradient-to-r from-black to-red-900 text-white py-10 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Sección de información general */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-red-400">ToysNow</h3>
              <p className="text-gray-300">
                Tienda virtual de productos para adultos con fines de bienestar y placer sexual.
                Operamos desde Colombia con atención personalizada.
              </p>
            </div>

            {/* Sección de contacto */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-red-400">Contacto</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  toysnowco@gmail.com
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                  +57 311 4479743
                </li>
              </ul>
            </div>

            {/* Sección de redes sociales */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-red-400">Síguenos</h3>
              <div className="flex space-x-4">
                <a href="https://www.instagram.com/toysnow.co/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-red-400 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="https://web.facebook.com/profile.php?id=61577427600022" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-red-400 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Derechos de autor */}
          <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-red-900 text-center text-gray-400 text-sm">
            <p>© {new Date().getFullYear()} ToysNow. Todos los derechos reservados.</p>
          </div>
        </footer>
      </div>
    </>
  )
}