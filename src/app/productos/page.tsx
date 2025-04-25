'use client'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Navbar from '@/components/Navbar'
import ListaProductos from '@/components/ListaProductos'
import '../../styles/productos.css';

export default function ProductosPage() {
  const [productos, setProductos] = useState([])
  const searchParams = useSearchParams()
  const searchTerm = searchParams.get('buscar')?.toLowerCase() || '';

  // variables de stado para guiardar las selecciones del usuario

  const [precioMin, setPrecioMin] = useState<number | ''>('');
  const [precioMax, setPrecioMax] = useState<number | ''>('');
  const [marca, setMarca] = useState('');
  const [condicion, setCondicion] = useState('');
  const [envioGratis, setEnvioGratis] = useState(false);


  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const res = await fetch('/api/productos')
        const data = await res.json()

        if (searchTerm) {
          const filtrados = data.filter((producto: any) => {
            const termino = searchTerm.toLowerCase();
            const enCategory = typeof producto.category === 'string' && producto.category.toLowerCase().includes(termino);
            const enNombre = typeof producto.name === 'string' && producto.name.toLowerCase().includes(termino);
            const enDetails = Array.isArray(producto.is_feature)
              ? producto.is_feature.some((detalle: string) => typeof detalle === 'string' && detalle.toLowerCase().includes(termino))
              : false;
            return enCategory || enNombre || enDetails;
          });
          setProductos(filtrados)
        } else {
          setProductos(data)
        }
      } catch (error) {
        console.error('Error al obtener productos:', error)
      }
    }
    obtenerProductos()
  }, [searchTerm])

  return (
    <>
      <Navbar />
      <div className='grid-product max-w-6xl mx-auto '>
        <div className='itemfilter p-4 bg-white rounded shadow mb-4'>
          <h2 className='text-lg font-bold mb-2'>Filtros</h2>

          <div className='mb-2'>
            <label>Precio Mínimo: </label>
            <input
              type='number'
              value={precioMin}
              onChange={(e) => setPrecioMin(e.target.value ? parseInt(e.target.value) : '')}
              className='border p-1 rounded ml-2'
            />
          </div>

          <div className='mb-2'>
            <label>Precio Máximo: </label>
            <input
              type='number'
              value={precioMax}
              onChange={(e) => setPrecioMax(e.target.value ? parseInt(e.target.value) : '')}
              className='border p-1 rounded ml-2'
            />
          </div>

          <div className='mb-2'>
            <label>Marca: </label>
            <input
              type='text'
              value={marca}
              onChange={(e) => setMarca(e.target.value)}
              className='border p-1 rounded ml-2'
            />
          </div>

          <div className='mb-2'>
            <label>Condición: </label>
            <select
              value={condicion}
              onChange={(e) => setCondicion(e.target.value)}
              className='border p-1 rounded ml-2'
            >
              <option value=''>Todas</option>
              <option value='nuevo'>Nuevo</option>
              <option value='usado'>Usado</option>
            </select>
          </div>

          <div className='mb-2'>
            <label>
              <input
                type='checkbox'
                checked={envioGratis}
                onChange={(e) => setEnvioGratis(e.target.checked)}
                className='mr-2'
              />
              Envío Gratis
            </label>
          </div>
        </div>

        <div className='itemproduct'>
          <div className="p-6 grid grid-cols-1 md:grid-cols-1 gap-12">
            <ListaProductos productos={productos} />
          </div>
        </div>
      </div>
    </>
  )
}
