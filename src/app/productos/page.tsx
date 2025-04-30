'use client'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Navbar from '@/components/Navbar'
import ListaProductos from '@/components/productos/ListaProductos'
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

  const normalizarTexto = (texto: string) =>
    texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const res = await fetch('/api/productos')
        const data = await res.json()
  
        const termino = normalizarTexto(searchTerm || '');
  
        if (termino) {
          const filtrados = data.filter((producto: any) => {
            const categoria = normalizarTexto(producto.category || '');
            const description = normalizarTexto(producto.description || '');
            const nombre = normalizarTexto(producto.name || '');
            const brand = normalizarTexto(producto.brand || '');
            
            const color = Array.isArray(producto.color)
            ? producto.color.map((d: string) => normalizarTexto(d)).join(' ')
            : '';

            const detalles = Array.isArray(producto.is_feature)
              ? producto.is_feature.map((d: string) => normalizarTexto(d)).join(' ')
              : '';
  
            return categoria.includes(termino) || nombre.includes(termino) 
            || detalles.includes(termino) || description.includes(termino) 
            || brand.includes(termino) || color.includes(termino);
          });
  
          setProductos(filtrados);
        } else {
          setProductos(data);
        }
      } catch (error) {
        console.error('Error al obtener productos:', error);
      }
    };
  
    const normalizarTexto = (texto: string) =>
      texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  
    obtenerProductos();
  }, [searchTerm]);
  

  

  return (
    <>
      <Navbar />
      <div className='grid-product max-w-6xl mx-auto mt-32  '>
        <div className='itemfilter p-4 bg-white rounded shadow mb-4 '>
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

        <div className='itemproduct content-product'>
          <div className="p-6 grid grid-cols-1 md:grid-cols-1 gap-12">
            <ListaProductos productos={productos} />
          </div>
        </div>
      </div>
    </>
  )
}
