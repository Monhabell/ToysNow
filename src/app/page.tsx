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

type Producto = {
  id: string | number
  name: string
  price: number | string
  compare_price?: number | string
  stock?: number
  images?: { id: number, product_id: number, url: string }[]  // Cambiado de img a images
  created_at?: string | Date
  qualification?: number
  relevance?: number
  slug?: string | null
  description?: string
  brand?: { id: number, name: string }
  categories?: Array<{ name: string, slug: string, description: string | null, image: string | null, parent_id: number | null }>
}

type ProductoDestacadoType = {
  id: string | number
  name: string
  price: number | string
  description?: string
  images: { url: string }[]  // Cambiado para coincidir con la estructura del JSON
} | null



export default function Home() {
  const [promociones, setPromociones] = useState<Producto[]>([])
  const [productoDestacado, setProductoDestacado] = useState<ProductoDestacadoType>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const res = await fetch('/api/productos')
        const productos = await res.json()
        const filtrados = productos.data.filter((p: any) => p.compare_price > 0)
        setPromociones(filtrados)
      } catch (error) {
        console.error('Error al cargar productos:', error)
      }
    }
    obtenerProductos()
  }, [])

  // Actualiza el tipo ProductoDestacadoType

  // Luego en el useEffect donde obtienes el destacado:
  useEffect(() => {
    const obtenerDestacado = async () => {
      try {
        setLoading(true)
        const res = await fetch('/api/productos')
        if (!res.ok) throw new Error('Error al cargar producto destacado')

        const { data: productos } = await res.json()

        // Producto con relevance = 1 o el primer producto como fallback
        let destacado = productos.find((p: Producto) => p.relevance === 1) || productos[0]

        if (!destacado) {
          // Si no hay productos, crear uno por defecto
          destacado = {
            id: 0,
            name: 'Producto destacado',
            price: 0,
            images: [{ url: 'https://www.jcprola.com/data/sinfoto.png' }],
            description: 'Producto de ejemplo'
          }
        } else {
          // Asegurar que tenga imágenes
          if (!destacado.images || destacado.images.length === 0) {
            destacado.images = [{ url: 'https://www.jcprola.com/data/sinfoto.png' }]
          } else {
            // Construir la URL completa si es necesario
            destacado.images = destacado.images.map(img => ({
              url: img.url.startsWith('http') ? img.url : `http://127.0.0.1:8000/images/${img.url}`
            }))
          }
        }

        setProductoDestacado(destacado)

      } catch (err) {
        console.error('Error al cargar producto destacado:', err)
        setError('Error al cargar el producto destacado.')
      } finally {
        setLoading(false)
      }
    }
    obtenerDestacado()
  }, [])

  const scrollLeft = () => {
    const slider = document.getElementById('slider')
    slider?.scrollBy({ left: -300, behavior: 'smooth' })
  }

  const scrollRight = () => {
    const slider = document.getElementById('slider')
    slider?.scrollBy({ left: 500, behavior: 'smooth' })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Cargando...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <>
      <Navbar />
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

        <div className='z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 content flex justify-between items-start'>
          <div className='w-100'>


            <div className="mt-2 sm:mt-8 content relative">
              <button
                onClick={scrollLeft}
                className="absolute left-5 top-1/2 -translate-y-1/2 z-10 bg-black/80 hover:bg-gold-600 text-white hover:text-white rounded-full p-2 sm:p-3 shadow-lg transition-all"
              >
                <GoChevronLeft size={20} className="sm:w-6 sm:h-6" />
              </button>

              <div
                id="slider"
                className="overflow-x-auto py-4 sm:py-6 scroll-smooth scrollbar-hide space-x-4 sm:space-x-6"
              >
                <ListaProductos
                  productos={promociones.map(p => ({
                    ...p,
                    img: p.img || ['https://www.jcprola.com/data/sinfoto.png']
                  }))}
                  isSlider
                />
              </div>

              <button
                onClick={scrollRight}
                className="absolute right-5 top-1/2 -translate-y-1/2 z-10 bg-black/80 hover:bg-gold-600 text-white hover:text-white rounded-full p-2 sm:p-3 shadow-lg transition-all"
              >
                <GoChevronRight size={20} className="sm:w-6 sm:h-6" />
              </button>
            </div>

          </div>
          {/* Producto destacado con comprobación adicional */}
          <div>
            {productoDestacado && (
              <ProductoDestacado
                img={productoDestacado.images[0].url}  // Accede a la URL de la primera imagen
                name={productoDestacado.name}
                price={productoDestacado.price.toString()}
                id={productoDestacado.id}
              />
            )}
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
              <a href="#" className="self-end sm:self-auto flex items-center text-sm sm:text-base text-gold-600 hover:text-gold-300 group transition-colors">
                Ver todas
                <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            {/* Slider  productos mas vendidos*/}
            <div className="mt-2 sm:mt-8 content relative">
              <button
                onClick={scrollLeft}
                className="absolute left-5 top-1/2 -translate-y-1/2 z-10 bg-black/80 hover:bg-gold-600 text-white hover:text-white rounded-full p-2 sm:p-3 shadow-lg transition-all"
              >
                <GoChevronLeft size={20} className="sm:w-6 sm:h-6" />
              </button>

              <div
                id="slider"
                className="overflow-x-auto py-4 sm:py-6 scroll-smooth scrollbar-hide space-x-4 sm:space-x-6"
              >
                <ListaProductos
                  productos={promociones.map(p => ({
                    ...p,
                    img: p.img || ['https://www.jcprola.com/data/sinfoto.png']
                  }))}
                  isSlider
                />
              </div>

              <button
                onClick={scrollRight}
                className="absolute right-5 top-1/2 -translate-y-1/2 z-10 bg-black/80 hover:bg-gold-600 text-white hover:text-white rounded-full p-2 sm:p-3 shadow-lg transition-all"
              >
                <GoChevronRight size={20} className="sm:w-6 sm:h-6" />
              </button>
            </div>
          </section>

          {/* Destacado del mes */}
          <section className="relative rounded-xl sm:rounded-2xl overflow-hidden mb-12 sm:mb-20 h-[350px] sm:h-[500px]">
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent z-1"></div>
            <img
              src="/images/productos/producto2.1.jpg"
              alt="Producto destacado"
              className="w-full h-full object-cover"
            />
            <div className="absolute left-4 sm:left-10 top-1/2 -translate-y-1/2 z-2 max-w-xs sm:max-w-md px-2 sm:px-0">
              <span className="text-sm sm:text-base text-white font-semibold">DESTACADO DEL MES</span>
              <h2 className="text-2xl sm:text-4xl font-bold text-white my-2 sm:my-4">Colección Éxtasis Noir</h2>
              <p className="text-xs sm:text-base text-white mb-4 sm:mb-6">Descubre la elegancia de lo prohibido...</p>
              <button className="bg-magenta-600 hover:bg-gold-500 text-white font-bold py-2 px-6 sm:py-3 sm:px-8 rounded-full text-sm sm:text-lg transition-all duration-300 flex items-center group">
                DESCUBRIR
                <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </section>
        </main>

        {/* Newsletter */}
        <div className="bg-gradient-to-r from-black to-purple-900 py-10 sm:py-16 px-4">
          {/* Contenido del newsletter */}
        </div>
      </div>
    </>
  )
}