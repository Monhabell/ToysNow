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
  quialification?: number;
  // Agrega aquí cualquier otra propiedad que uses
};

type ListaProductosProps = {
  productos: Producto[];
  isSlider?: boolean;
};

export default function ListaProductos({ productos, isSlider = false }: ListaProductosProps)  {

  const [rating, setRating] = useState(0);
  const handleRating = (value: any) => {
    setRating(value);
    console.log('Usuario calificó con:', value);
    // agrgar la calificacion del producto por un fetch
  };

  const router = useRouter();

  return (
    <>
      <div className={isSlider
        ? "flex gap-6 p-4 flex-nowrap"
        : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4"
      }
      >
        {productos.map((p: any) => {
          const tieneDescuento = p.compare_price > 0
          const precioFinal = p.compare_price - p.price
          const stockBajo = p.stock <= 5

          const fechaCreacion = new Date(p.created_at);
          const hoy = new Date();
          const diffDias = Math.ceil((hoy.getTime() - fechaCreacion.getTime()) / (1000 * 60 * 60 * 24));
          const nuevoOk = diffDias <= 15; // producto es nuevo si se creó hace menos de 30 días.

          const cantUs =  1
          const qualifi = p.quialification >= 0
          const TotalCalifi = p.quialification / cantUs

          return (
            <motion.div
              key={p.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl cursor-pointer min-w-[250px]"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <div className="relative h-52">
                <Image
                  src={p.img[0]} //toma siempre la primera imagen del producto
                  alt={p.name}
                  fill
                  className="object-cover"
                  onClick={() => router.push(`/detalle/${p.id}`)}  // <-- Navegará a la nueva página
                />
                {tieneDescuento && (
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full shadow">
                    -{Math.round((p.price / p.compare_price) * 100)}%
                  </span>
                )}
                {nuevoOk && (
                  <span className="nuevo">Nuevo</span>
                )}
              </div>

              <div className="p-4 space-y-2">
                <h2 className="text_title_product">{p.name}</h2>
                {stockBajo && <p className="text-sm ">¡Últimas unidades!</p>}

                <div className="text-md">
                  {tieneDescuento ? (
                    <div className="flex items-center space-x-2">
                      <span className="font-bold">
                        $ {precioFinal.toLocaleString('en-CO', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                      </span>
                      <span className="valorAnterior line-through">
                       
                        $ {p.compare_price.toLocaleString('en-CO', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                      </span>

                    </div>
                  ) : (
                    <span className="text-gray-800 font-medium"> 
                      $ {precioFinal.toLocaleString('en-CO', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                    </span>
                  )}
                </div>

                {qualifi && (
                  <div className='star_qualifications'>
                    <StarRating rating={TotalCalifi} onRate={handleRating} />
                    <p>({cantUs})</p>
                    
                  </div>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

    </>
  )
}
