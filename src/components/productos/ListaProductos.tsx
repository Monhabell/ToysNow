'use client'

import Image from 'next/image'
import StarRating from '@/components/StarRating'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import '../../styles/Listaproductos.css'

// Utility function to ensure valid image URL
const getValidImageUrl = (url: string | undefined) => {
  if (!url) return '/default-product-image.png' // Imagen por defecto local
  
  // Si ya es una URL completa (http/https)
  if (/^https?:\/\//i.test(url)) {
    return url
  }
  
  // Si es una ruta local que comienza con /images
  if (url.startsWith('/images/')) {
    return `http://127.0.0.1:8000${url}`
  }
  
  // Si es una ruta relativa de productos
  if (url.startsWith('products/')) {
    return `http://127.0.0.1:8000/images/${url}`
  }
  
  // Para cualquier otro caso, usa la URL directamente
  return url
}

type Producto = {
  id: string | number
  name: string
  price: string
  compare_price: string
  stock: number
  images: Array<{
    id: number
    product_id: number
    url: string
  }>
  created_at: string
  qualification?: number
  brand?: {
    id: number
    name: string
  }
  variants?: Array<{
    id: number
    price: string | null
    stock: number
    compare_price: string | null
    shipment: number | null
    attributes: Array<{
      id: number
      name: string
      value: string
    }>
  }>
  reviews_count?: number
}

type ListaProductosProps = {
  productos: Producto[]
  isSlider?: boolean
}

export default function ListaProductos({ productos, isSlider = false }: ListaProductosProps) {
  const [rating, setRating] = useState(0)
  const [isClient, setIsClient] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleRating = (value: number) => {
    setRating(value)
    console.log('Usuario calificó con:', value)
  }

  const calculateIsNew = (createdAt: string) => {
    if (!isClient) return false
    
    const fechaCreacion = new Date(createdAt)
    const hoy = new Date()
    const diffDias = Math.ceil((hoy.getTime() - fechaCreacion.getTime()) / (1000 * 60 * 60 * 24))
    return diffDias <= 15
  }

  return (
    <div className={isSlider
      ? "flex gap-6 p-4 flex-nowrap"
      : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4"
    }>
      {productos.map((p) => {
        const basePrice = parseFloat(p.price)
        const baseComparePrice = parseFloat(p.compare_price)
        const baseStock = p.stock
        
        const variantPrice = p.variants?.[0]?.price ? parseFloat(p.variants[0].price) : null
        const variantComparePrice = p.variants?.[0]?.compare_price ? parseFloat(p.variants[0].compare_price) : null
        const variantStock = p.variants?.[0]?.stock || baseStock
        const variantShipment = p.variants?.[0]?.shipment || null

        const finalPrice = variantPrice || basePrice
        const finalComparePrice = variantComparePrice || baseComparePrice
        const finalStock = variantStock
        const finalShipment = variantShipment

        const tieneDescuento = finalComparePrice > 0 && finalComparePrice > finalPrice
        const stockBajo = finalStock <= 5
        const EnvioGratis = finalShipment === 0
        const nuevoOk = isClient && calculateIsNew(p.created_at)

        const TotalCalifi = p.qualification || 0
        const cantUs = p.reviews_count || 0

        return (
          <motion.div
            key={p.id}
            className="targetProducto"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <div className="relative h-52">
              <Image
                src={getValidImageUrl(p.images?.[0]?.url)}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;  
                  target.onerror = null;
                  target.src = '/images/default.png';
                }}
                alt={p.name}
                fill
                className="object-cover"
                onClick={() => router.push(`/detalle/${p.id}`)}
                priority={false}
                unoptimized={true}
              />
              {tieneDescuento && (
                <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full shadow">
                  -{Math.round(((finalComparePrice - finalPrice) / finalComparePrice) * 100)}%
                </span>
              )}
              {nuevoOk && (
                <span className="nuevo">Nuevo</span>
              )}
            </div>

            <div className="p-4 space-y-2">
              <h2 className="text_title_product">
                {p.name.length > 22 ? `${p.name.slice(0, 22)}...` : p.name}
              </h2>
              <div className='flex items-center justify-between'>
                {stockBajo && <p className="text-sm">¡Últimas unidades!</p>}
                {EnvioGratis && <p className="text-sm">¡Envio Gratis!</p>}
              </div>
              
              <div className="text-md">
                {tieneDescuento ? (
                  <div className="flex items-center space-x-2">
                    <span className="font-bold">
                      $ {finalPrice.toLocaleString('en-CO')}
                    </span>
                    <span className="valorAnterior line-through">
                      $ {finalComparePrice.toLocaleString('en-CO')}
                    </span>
                  </div>
                ) : (
                  <span className="font-medium"> 
                    $ {finalPrice.toLocaleString('en-CO')}
                  </span>
                )}
              </div>

              {TotalCalifi >= 0 && (
                <div className='star_qualifications'>
                  <StarRating rating={TotalCalifi} onRate={handleRating} />
                  <p className='ml-2 mt-1'>({cantUs})</p>
                </div>
              )}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}