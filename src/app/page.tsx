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
import WhatsAppButton from '@/components/WhatsAppButton'
import Link from 'next/link';
import type { Producto } from '@/types/productos'



type ProductoDestacadoType = {
  id: string | number
  name: string
  price: number | string
  description?: string
  images: { url: string }[]
} | null

// Tiempo de vida del cache en milisegundos (5 minutos)
const CACHE_LIFETIME = 5 * 60 * 1000;

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
            const { promociones: cachedPromociones, destacado: cachedDestacado, productoDestacado2: productoDestacado2, shuffled: shuffled } = JSON.parse(cachedData);
            setPromociones(cachedPromociones);
            setProductoDestacado(cachedDestacado);
            setProductoDestacado2(productoDestacado2);
            setProductCant(shuffled)
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

        // mostrar 10 productos al azar
        const shuffled = productosData.data
          .filter((p: any) => p.compare_price >= 0) // Filtramos promociones
          .sort(() => 0.5 - Math.random()) // Mezclamos
          .slice(0, 5); // Tomamos 5
        setProductCant(shuffled);

        // Procesar producto destacado
        let destacado = destacadoData.data.find((p: Producto) => p.relevance === 1) || destacadoData.data[0]
        if (!destacado) {
          destacado = {
            id: 0,
            name: 'Producto destacado',
            price: 0,
            images: [{ url: 'https://www.jcprola.com/data/sinfoto.png' }],
            description: 'Producto de ejemplo'
          }
        } else {
          if (!destacado.images || destacado.images.length === 0) {
            destacado.images = [{ url: 'https://www.jcprola.com/data/sinfoto.png' }]
          } else {
            destacado.images = destacado.images.map((img: { url: string }) => ({
              url: img.url.startsWith('http') ? img.url : `http://127.0.0.1:8000/images/${img.url}`
            }))

          }
        }
        setProductoDestacado(destacado)

        const productoDestacado2 = destacadoData.data.find((p: Producto) => p.relevance === 2) || destacadoData.data[1] || destacadoData.data[0]; // Usamos el segundo o el primero si no hay con relevance=2

        if (productoDestacado2) {
          if (!productoDestacado2.images || productoDestacado2.images.length === 0) {
            productoDestacado2.images = [{ url: 'https://www.jcprola.com/data/sinfoto.png' }];
          } else {
            productoDestacado2.images = productoDestacado2.images.map((img: { url: string }) => ({
              url: img.url.startsWith('http') ? img.url : `http://127.0.0.1:8000/images/${img.url}`
            }));
          }
        }
        setProductoDestacado2(productoDestacado2);


        // Guardar en cache
        const cacheData = {
          promociones: filtrados,
          destacado: destacado,
          productoDestacado2: productoDestacado2,
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
      <div className="fixed inset-0 bg-black/95 z-50 flex flex-col items-center justify-center space-y-6">
        {/* Logo animado (puedes reemplazar con tu propio logo) */}
        <div className="relative w-24 h-24 mb-6">
          <div className="absolute inset-0 border-4 border-gold-600 rounded-full animate-ping opacity-75"></div>
          <div className="absolute inset-2 border-2 border-gold-400 rounded-full flex items-center justify-center">
            <span className="text-gold-400 font-bold text-xl">NOIR</span>
          </div>
        </div>

        {/* Barra de progreso animada */}
        <div className="w-64 md:w-80 h-2 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-gold-500 to-gold-300 rounded-full animate-progress"
            style={{
              animation: 'progress 2.5s ease-in-out infinite',
              backgroundSize: '200% 100%',
              backgroundPosition: '100% 0%'
            }}
          ></div>
        </div>

        {/* Texto con animación */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-gold-400 animate-pulse text-center">
            <span className="text-white">Experiencia ToysNow</span>
          </h2>
          <p className="text-gray-400 max-w-md px-4">
            <span className="inline-block animate-typing overflow-hidden whitespace-nowrap border-r-2 border-gold-500 pr-1">
              Preparando los productos más exclusivos para ti...
            </span>
          </p>
        </div>


      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black text-white">
        <div className="text-center p-6 max-w-md">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
          <p className="mb-6">{error}</p>
          
          <button
            onClick={() => window.location.reload()}
            className="bg-gold-600 hover:bg-gold-700 text-white font-bold py-2 px-6 rounded-full transition-colors"
          >
            Reintentar prueba
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <Navbar />
      <WhatsAppButton />
      <div className="relative bg-black min-h-screen mt-32">
        {/* Banner */}
        <div className="overflow-hidden">
          <Banner />
          <div className="inset-0 bg-gradient-to-t from-black via-black/70 to-transparent z-1"></div>
          <div className="bottom-10 sm:bottom-20 left-0 right-0 text-center z-2 px-4">

            <div className='mr-5'>
              <Category />
            </div>

          </div>
        </div>

        <div className='z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 content '>
          <div className="card-destacado">
            {/* Carrusel de productos - ocupa 2/3 del espacio en pantallas grandes */}
            <div className="carrusel_productos">

              <button
                onClick={() => scrollLeft('slider')}
                className="absolute left-5 top-1/2 -translate-y-1/2 z-10 bg-black/80 hover:bg-gold-600 text-white hover:text-white rounded-full p-2 sm:p-3 shadow-lg transition-all"
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
                    images: p.images || ['https://www.jcprola.com/data/sinfoto.png']
                  }))}
                  isSlider
                />
              </div>

              <button
                onClick={() => scrollRight('slider')}
                className="absolute right-5 top-1/2 -translate-y-1/2 z-10 bg-black/80 hover:bg-gold-600 text-white hover:text-white rounded-full p-2 sm:p-3 shadow-lg transition-all"
              >
                <GoChevronRight size={20} className="sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Producto destacado - ocupa 1/3 del espacio en pantallas grandes */}
            <div className="producto_destacado">
              {productoDestacado && (
                <ProductoDestacado
                  img={productoDestacado.images[0].url}
                  name={productoDestacado.name}
                  price={productoDestacado.price.toString()}
                  id={productoDestacado.id}
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

            {/* Slider  productos mas vendidos*/}
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
                    img: p.images || ['https://www.jcprola.com/data/sinfoto.png']
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

          {/* Destacado del mes */}
          {productoDestacado2 && (
            <section className="relative rounded-xl sm:rounded-2xl overflow-hidden mb-12 sm:mb-20 h-[350px] sm:h-[500px]">
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent z-1"></div>
              <Image
                src={productoDestacado2.images[0].url}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = '/images/default.webp';
                }}
                alt={productoDestacado2.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute left-4 sm:left-10 top-1/2 -translate-y-1/2 z-2 max-w-xs sm:max-w-md px-2 sm:px-0">
                <span className="text-sm sm:text-base text-white font-semibold">DESTACADO DEL MES</span>
                <h2 className="text-2xl sm:text-4xl font-bold text-white my-2 sm:my-4">{productoDestacado2.name}</h2>

                <Link
                  href={`/detalle/${productoDestacado2.id}`}
                  className="bg-magenta-600 hover:bg-gold-500 text-white font-bold py-2 px-6 sm:py-3 sm:px-8 rounded-full text-sm sm:text-lg transition-all duration-300 flex items-center group"
                >
                  DESCUBRIR
                  <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </section>
          )}




        </main>

        {/* Newsletter */}
        <div className="bg-gradient-to-r from-black to-purple-900 py-10 sm:py-16 px-4">
          {/* Contenido del newsletter */}
        </div>
      </div>
    </>
  )
}