'use client'
import { useEffect, useState, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import Navbar from '@/components/Navbar'
import ListaProductos from '@/components/productos/ListaProductos'
import '../../styles/productos.css';


export default function ProductosPage() {
  const [allProductos, setAllProductos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get('buscar')?.toLowerCase() || '';
  const categoriaParam = searchParams.get('categoria') || '';

  // Estados para filtros
  const [precioMin, setPrecioMin] = useState<number | ''>('');
  const [precioMax, setPrecioMax] = useState<number | ''>('');
  const [marca, setMarca] = useState('');
  const [condicion, setCondicion] = useState('');
  const [envioGratis, setEnvioGratis] = useState(false);
  const [categorias, setCategorias] = useState<string[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(categoriaParam);
  const [marcasDisponibles, setMarcasDisponibles] = useState<string[]>([]);
  const [ratingMinimo, setRatingMinimo] = useState<number | ''>('');

  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const productosPerPage = 6;

  // Obtener productos al cargar
  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/productos');
        const data = await res.json();
        setAllProductos(data);
        
        
        const cats  = Array.from(
          new Set(
            data
              .flatMap((p: any) => p.category || []) 
              .filter(Boolean) 
          )
        );
        console.log(cats);
        setCategorias(cats as string[]);


        
        // Extraer marcas únicas
        const marcas = Array.from(new Set(data.map((p: any) => p.brand).filter(Boolean)));
        setMarcasDisponibles(marcas as string[]);
        
      } catch (error) {
        console.error('Error al obtener productos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    obtenerProductos();
  }, []);

  // Normalizar texto para búsquedas
  const normalizarTexto = (texto: any) => {
  if (!texto) return ''; // Si es null, undefined o vacío, retorna cadena vacía
  return String(texto) // Convierte a string por si es un número u otro tipo
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
};

  // Filtrar productos
  const productosFiltrados = useMemo(() => {
    let filtrados = [...allProductos];
    const termino = normalizarTexto(searchTerm || '');

    // Filtro por término de búsqueda
    if (termino) {
      filtrados = filtrados.filter((producto) => {
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
    }

    // Filtro por categoría
    if (categoriaSeleccionada) {
      filtrados = filtrados.filter(producto =>
        (producto.category || []).some((cat: string) =>
          normalizarTexto(cat) === normalizarTexto(categoriaSeleccionada)
        )
      );
    }


    // Filtro por precio
    if (precioMin !== '') {
      console.log(precioMin);  
      filtrados = filtrados.filter(producto =>
        (producto.compare_price === 0 
          ? producto.price 
          : producto.compare_price - producto.price
        ) >= precioMin
      );

    }

    if (precioMax !== '') {
      filtrados = filtrados.filter(producto => 
        (producto.compare_price === 0
          ? producto.price
          : producto.compare_price - producto.price
        ) <= precioMax);
    }

    // Filtro por marca
    if (marca) {
      filtrados = filtrados.filter(producto => 
        normalizarTexto(producto.brand || '') === normalizarTexto(marca));
    }

    // Filtro por condición
    if (condicion) {
      if (condicion === 'nuevo') {
        const treintaDiasAtras = new Date();
        treintaDiasAtras.setDate(treintaDiasAtras.getDate() - 30);
        
        filtrados = filtrados.filter(producto => {
          const fechaProducto = new Date(producto.created_at);
          return fechaProducto > treintaDiasAtras;
        });
      }

      if (condicion === 'descuento') {
        filtrados = filtrados.filter(producto => {
          if (!producto.compare_price) return false;
          
          const precioOriginal = parseFloat(producto.compare_price);
          const precioActual = parseFloat(producto.price);
          return precioOriginal > precioActual;
        });
      }
    }

    // Filtro por envío gratis
    if (envioGratis) {
      filtrados = filtrados.filter(producto => producto.shipment > 0);
    }

    // Filtro por rating mínimo
    if (ratingMinimo !== '') {
      filtrados = filtrados.filter(producto => 
        producto.quialification >= ratingMinimo);
    }

    return filtrados;
  }, [
    allProductos, 
    searchTerm, 
    categoriaSeleccionada,
    precioMin, 
    precioMax, 
    marca, 
    condicion, 
    envioGratis,
    ratingMinimo
  ]);

  // Productos paginados
  const productosPaginados = useMemo(() => {
    const indexOfLastProducto = currentPage * productosPerPage;
    const indexOfFirstProducto = indexOfLastProducto - productosPerPage;
    return productosFiltrados.slice(indexOfFirstProducto, indexOfLastProducto);
  }, [productosFiltrados, currentPage]);

  // Cambiar página
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Resetear a página 1 cuando cambian los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [productosFiltrados]);

  // Contadores para opciones de filtro
  const contadorPorMarca = useMemo(() => {
    const counts: Record<string, number> = {};
    marcasDisponibles.forEach(marca => {
      counts[marca] = productosFiltrados.filter(p => 
        normalizarTexto(p.brand || '') === normalizarTexto(marca)).length;
    });
    return counts;
  }, [productosFiltrados, marcasDisponibles]);

  const contadorPorCategoria = useMemo(() => {
    const counts: Record<string, number> = {};
    categorias.forEach(cat => {
      counts[cat] = productosFiltrados.filter(p => {
        const categoriasProducto = Array.isArray(p.category) 
          ? p.category 
          : [p.category];
        return categoriasProducto.some((c: any) => 
          normalizarTexto(c) === normalizarTexto(cat)
        );
      }).length;
    });
    return counts;
  }, [productosFiltrados, categorias]);

  // Limpiar todos los filtros
  const limpiarFiltros = () => {
    setPrecioMin('');
    setPrecioMax('');
    setMarca('');
    setCondicion('');
    setEnvioGratis(false);
    setCategoriaSeleccionada('');
    setRatingMinimo('');
  };

  return (
    <>
      <Navbar />
      <div className='max-w-7xl mx-auto mt-32 px-4 content-producto'>
       
        <div className='flex flex-col md:flex-row gap-6'>
          {/* Panel de Filtros */}
          <div className='filter'>
            <div className="flex justify-between items-center mb-4">
              <h2 className='text-lg font-bold'>Filtros</h2>
              <button 
                onClick={limpiarFiltros}
                className="text-xs text-blue-500 hover:underline"
              >
                Limpiar todo
              </button>
            </div>

            {/* Filtro por Categoría */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Categorías</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {categorias.map(cat => (
                  <div key={cat} className="flex items-center input-radio-Category">
                    <input
                      type="radio"
                      id={`cat-${cat}`}
                      name="categoria"
                      checked={normalizarTexto(categoriaSeleccionada) === normalizarTexto(cat)}
                      onChange={() => setCategoriaSeleccionada(cat)}
                      className="mr-2 "
                    />
                    <label htmlFor={`cat-${cat}`} className="flex-1">
                      {cat} <span className="text-gray-500 text-sm">({contadorPorCategoria[cat] || 0})</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Filtro por Precio */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Precio</h3>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm mb-1">Mínimo</label>
                  <input
                    type='number'
                    value={precioMin}
                    onChange={(e) => setPrecioMin(e.target.value ? parseInt(e.target.value) : '')}
                    className='border p-2 rounded w-full'
                    placeholder='$ Mín'
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Máximo</label>
                  <input
                    type='number'
                    value={precioMax}
                    onChange={(e) => setPrecioMax(e.target.value ? parseInt(e.target.value) : '')}
                    className='border p-2 rounded w-full'
                    placeholder='$ Máx'
                  />
                </div>
              </div>
            </div>

            {/* Filtro por Marca */}
            {marcasDisponibles.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Marcas</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {marcasDisponibles.map(m => (
                    <div key={m} className="flex items-center">
                      <input
                        type="radio"
                        id={`marca-${m}`}
                        name="marca"
                        checked={normalizarTexto(marca) === normalizarTexto(m)}
                        onChange={() => setMarca(m)}
                        className="mr-2"
                      />
                      <label htmlFor={`marca-${m}`} className="flex-1">
                        {m} <span className="text-gray-500 text-sm">({contadorPorMarca[m] || 0})</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Filtro por Condición */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Condición</h3>
              <select
                value={condicion}
                onChange={(e) => setCondicion(e.target.value)}
                className='border p-2 rounded w-full'
              >
                <option value=''>Todas las condiciones</option>
                <option value='nuevo'>Nuevo</option>
                <option value='descuento'>Descuento</option>
              </select>
            </div>

            {/* Filtro por Envío */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Envío</h3>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="envio-gratis"
                  checked={envioGratis}
                  onChange={(e) => setEnvioGratis(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="envio-gratis">Envío gratis</label>
              </div>
            </div>

            {/* Filtro por Rating */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Calificación</h3>
              <select
                value={ratingMinimo}
                onChange={(e) => setRatingMinimo(e.target.value ? parseInt(e.target.value) : '')}
                className='border p-2 rounded w-full'
              >
                <option value=''>Todas las calificaciones</option>
                <option value='5'>5 estrellas</option>
                <option value='4'>4+ estrellas</option>
                <option value='3'>3+ estrellas</option>
                <option value='2'>2+ estrellas</option>
                <option value='1'>1+ estrella</option>
              </select>
            </div>
          </div>

          {/* Lista de Productos */}
          <div className='flex-1'>
            <div className="bg-white p-4 rounded shadow-md mb-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">
                  {categoriaSeleccionada || 'Todos los productos'}
                  <span className="text-gray-500 text-sm font-normal ml-2">
                    ({productosFiltrados.length} resultados)
                  </span>
                </h2>
                <div className="flex items-center space-x-2">
                  <span className="text-sm">Ordenar por:</span>
                  <select
                    className="border p-2 rounded"
                    onChange={(e) => {
                      const orden = e.target.value;
                      if (orden === 'precio') {
                        setAllProductos(prev => [...prev].sort((a, b) => a.price - b.price));
                      } else if (orden === 'calificacion') {
                        setAllProductos(prev => [...prev].sort((a, b) => b.quialification - a.quialification));
                      }
                    }}
                  >
                    <option value="relevancia">Relevancia</option>
                    <option value="precio">Precio</option>
                    <option value="calificacion">Calificación</option>
                  </select>
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : productosFiltrados.length === 0 ? (
              <div className="bg-white p-8 rounded shadow-md text-center">
                <h3 className="text-lg font-semibold mb-2">No se encontraron productos</h3>
                <p className="text-gray-600 mb-4">Intenta ajustar tus filtros de búsqueda</p>
                <button 
                  onClick={limpiarFiltros}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Limpiar todos los filtros
                </button>
              </div>
            ) : (
              <div className="">
                <ListaProductos productos={productosPaginados} />
                
                {/* Paginación */}
                {productosFiltrados.length > productosPerPage && (
                  <div className="flex justify-center mt-8">
                    {/* Botón Anterior */}
                    {currentPage > 1 && (
                      <button
                        onClick={() => paginate(currentPage - 1)}
                        className="mx-1 px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
                      >
                        &laquo; Anterior
                      </button>
                    )}

                    {/* Números de página */}
                    {Array.from({ 
                      length: Math.ceil(productosFiltrados.length / productosPerPage) 
                    }).map((_, index) => {
                      const pageNumber = index + 1;
                      // Mostrar solo páginas cercanas a la actual
                      if (
                        pageNumber === 1 || 
                        pageNumber === Math.ceil(productosFiltrados.length / productosPerPage) ||
                        (pageNumber >= currentPage - 2 && pageNumber <= currentPage + 2)
                      ) {
                        return (
                          <button
                            key={index}
                            onClick={() => paginate(pageNumber)}
                            className={`mx-1 px-3 py-1 rounded ${
                              currentPage === pageNumber
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 hover:bg-gray-300'
                            }`}
                          >
                            {pageNumber}
                          </button>
                        );
                      }
                      return null;
                    })}

                    {/* Botón Siguiente */}
                    {currentPage < Math.ceil(productosFiltrados.length / productosPerPage) && (
                      <button
                        onClick={() => paginate(currentPage + 1)}
                        className="mx-1 px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
                      >
                        Siguiente &raquo;
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}