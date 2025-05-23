'use client'

import Image from 'next/image'
import { useCart } from '@/context/CartContext'
import StarRating from '@/components/StarRating';
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation';

import '../../styles/Listaproductos.css'

// Definición de tipos
type Producto = {
  id: string | number;
  name: string;
  price: number;
  compare_price: number;
  stock: number;
  img: string[];
  created_at: string | Date;
  qualification?: {
    count_users: {
      [key: string]: number;
    };
    comments: Array<{
      text: string;
      date: string;
    }>;
  };
  brand?: string;
  shipment?: number;
  features?: Array<{
    variants: Array<{
      price?: number;
      compare_price?: number;
      stock?: number;
      [key: string]: any;
    }>;
  }>;
};

type ListaProductosProps = {
  productos: Producto[];
  isSlider?: boolean;
};

export default function ListaProductos({ productos, isSlider = false }: ListaProductosProps) {
  const [rating, setRating] = useState(0);
  const handleRating = (value: any) => {
    setRating(value);
    console.log('Usuario calificó con:', value);
  };

  const router = useRouter();

  return (
    <>
      <div className={isSlider
        ? "flex gap-6 p-4 flex-nowrap"
        : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4"
      }>
        {productos.map((p) => {
          // Calcular precio y stock considerando variantes
          const basePrice = p.price;
          const baseComparePrice = p.compare_price;
          const baseStock = p.stock;
          
          // Obtener el primer precio de variante si existe
          const variantPrice = p.features?.[0]?.variants?.[0]?.price;
          const variantComparePrice = p.features?.[0]?.variants?.[0]?.compare_price;
          const variantStock = p.features?.[0]?.variants?.[0]?.stock;
          
          const finalPrice = variantPrice || basePrice;
          const finalComparePrice = variantComparePrice || baseComparePrice;
          const finalStock = variantStock || baseStock;

          const tieneDescuento = finalComparePrice > finalPrice;
          const precioFinal = tieneDescuento ? finalComparePrice : finalPrice;

          const stockBajo = finalStock <= 5;
          const EnvioGratis = p.shipment === 0;
          
          const fechaCreacion = new Date(p.created_at);
          const hoy = new Date();
          const diffDias = Math.ceil((hoy.getTime() - fechaCreacion.getTime()) / (1000 * 60 * 60 * 24));
          const nuevoOk = diffDias <= 15;

          // Calcular calificación promedio
          let TotalCalifi = 0;
          let cantUs = 0;
          
          if (p.qualification) {
            const counts = p.qualification.count_users;
            let total = 0;
            let count = 0;
            
            for (const [key, value] of Object.entries(counts)) {
              const ratingValue = parseInt(key);
              total += ratingValue * value;
              count += value;
            }
            
            TotalCalifi = total / count;
            cantUs = count;
          }

          return (
            <motion.div
              key={p.id}
              className="targetProducto"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <div className="relative h-52">
                <Image
                  src={p.img[0] || '#'} // Usa '#' como fallback
                  alt={p.name}
                  fill
                  className="object-cover"
                  onClick={() => router.push(`/detalle/${p.id}`)}
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
                <h2 className="text_title_product">{p.name.length > 22 ? p.name.slice(0, 22) + '...' : p.name}</h2>
                <div className='flex items-center justify-between'>
                  {stockBajo && <p className="text-sm ">¡Últimas unidades!</p>}
                  {EnvioGratis && <p className="text-sm ">¡Envio Gratis!</p>}
                </div>
                
                <div className="text-md">
                  {tieneDescuento ? (
                    <div className="flex items-center space-x-2">
                      <span className="font-bold">
                        $ {finalPrice.toLocaleString('en-CO', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                      </span>
                      <span className="valorAnterior line-through">
                        $ {finalComparePrice.toLocaleString('en-CO', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  ) : (
                    <span className="font-medium"> 
                      $ {finalPrice.toLocaleString('en-CO', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                    </span>
                  )}
                </div>

                {p.qualification && (
                  <div className='star_qualifications'>
                    <StarRating rating={TotalCalifi} onRate={handleRating} />
                    <p className='ml-2 mt-1'>({cantUs})</p>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </>
  );
}