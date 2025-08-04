'use client'

import Image from 'next/image'
import StarRating from '@/components/StarRating'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import '../../styles/Listaproductos.css'
import type { Producto, Qualification } from '@/types/productos'

// Utility function to ensure valid image URL
const getValidImageUrl = (url: string | undefined) => {
  if (!url) return '/default-product-image.png'
  if (/^https?:\/\//i.test(url)) return url
  if (url.startsWith('/images/')) return `https://www.softgenix.space/storage/tenants/2b85d6a6-1059-4929-a8bb-5f3d7ca5c732/images/${url}`
  if (url.startsWith('products/')) return `https://www.softgenix.space/storage/tenants/2b85d6a6-1059-4929-a8bb-5f3d7ca5c732/images/${url}`
  return url
}


type ListaProductosProps = {
  productos: Producto[]
  isSlider?: boolean
}

export default function ListaProductos({ productos, isSlider = false }: ListaProductosProps) {
  const [, setRating] = useState(0)
  const [isClient, setIsClient] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleRating = (value: number) => {
    setRating(value)
    console.log('Usuario calificó con:', value)
  }

  const calculateIsNew = (createdAt: string | Date | undefined) => {
    if (!isClient || !createdAt) return false
    const fechaCreacion = new Date(createdAt)
    const hoy = new Date()
    const diffDias = Math.ceil((hoy.getTime() - fechaCreacion.getTime()) / (1000 * 60 * 60 * 24))
    return diffDias <= 15
  }

  const calcularRatingPromedio = (qualification?: Qualification): number => {
    if (!qualification || !qualification.count_users) return 0
      
    const counts = qualification.count_users
    const totalVotos = Object.values(counts).reduce((sum: number, count) => sum + Number(count), 0)
    if (totalVotos === 0) return 0

    const sumaPonderada = Object.entries(counts).reduce(
      (total, [estrellas, cantidad]) => total + (parseInt(estrellas) * Number(cantidad)),
      0
    )

    return sumaPonderada / totalVotos
  }

  return (
    <div className={isSlider
      ? "flex gap-6 p-4 flex-nowrap"
      : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4"
    }>
      {productos.map((p) => {

        const basePrice = parseFloat(String(p.price))
        const baseComparePrice = parseFloat(String(p.compare_price))
        const baseStock = p.stock

        const variantPrice = p.variants?.[0]?.price ? parseFloat(String(p.variants[0].price)) : null
        const variantComparePrice = p.variants?.[0]?.compare_price ? parseFloat(String(p.variants[0].compare_price)) : null
        const variantStock = p.variants?.[0]?.stock || baseStock
   
        const finalPrice = variantPrice || basePrice
        const finalComparePrice = variantComparePrice || baseComparePrice
        const finalStock = variantStock ?? 0


        const tieneDescuento = finalComparePrice > 0 && finalComparePrice > finalPrice
        const stockBajo = finalStock <= 5

        const nuevoOk = isClient && calculateIsNew(p.created_at)

        const ratingPromedio = calcularRatingPromedio(p.qualification)
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
              {nuevoOk && <span className="nuevo">Nuevo</span>}
            </div>

            <div className="p-4 space-y-2">
              <h2 className="text_title_product">
                {p.name.length > 22 ? `${p.name.slice(0, 22)}...` : p.name}
              </h2>
              <div className='flex items-center justify-between'>
                {stockBajo && <p className="text-sm">¡Últimas unidades!</p>}
                
              </div>

              <div className="text-md">
                {tieneDescuento ? (
                  <div className="flex items-center space-x-2">
                    <span className="font-bold">$ {finalPrice.toLocaleString('en-CO')}</span>
                    <span className="valorAnterior line-through">$ {finalComparePrice.toLocaleString('en-CO')}</span>
                  </div>
                ) : (
                  <span className="font-medium">$ {finalPrice.toLocaleString('en-CO')}</span>
                )}
              </div>

              {ratingPromedio > 0 && (
                <div className='star_qualifications'>
                  <StarRating rating={ratingPromedio} onRate={handleRating} />
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