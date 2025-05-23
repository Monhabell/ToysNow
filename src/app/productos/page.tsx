'use client'
import { useEffect, useState, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import Navbar from '@/components/Navbar'
import ListaProductos from '@/components/productos/ListaProductos'
import '../../styles/productos.css';
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

interface Variant {
  color?: string;
  size?: string;
  weight?: string;
  cost_shipping?: number;
  dimensions?: string;
  price: number;
  compare_price: number;
  stock: number;
  images: string[];
}

interface Feature {
  variants: Variant[];
}

interface Qualification {
  count_users: {
    [key: string]: number;
  };
  comments: {
    text: string;
    date: string;
  }[];
}

interface Question {
  user_id: number;
  question: string;
  answer: string;
  is_approved: boolean;
  created_at: string;
}

interface Category {
  id: number;
  name: string;
}

interface Producto {
  id: number;
  name: string;
  price: number;
  compare_price: number;
  slug: string;
  description: string;
  brand: string;
  stock: number;
  shipment: number;
  is_available: boolean;
  is_feature: boolean;
  features: Feature[];
  img: string[];
  categories: Category[];
  subcategories: Category[];
  qualification: Qualification;
  questions: Question[];
  created_at: string;
}

export default function ProductosPage() {
  const [allProductos, setAllProductos] = useState<Producto[]>([]);
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
  const [categorias, setCategorias] = useState<Category[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(categoriaParam);
  const [marcasDisponibles, setMarcasDisponibles] = useState<string[]>([]);
  const [ratingMinimo, setRatingMinimo] = useState<number | ''>('');

  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const productosPerPage = 12;

  // Obtener productos al cargar
  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/productos');
        const data = await res.json();
        setAllProductos(data);

        // Extraer categorías únicas
        const cats: Category[] = Array.from(
          new Set(
            data.flatMap((p: Producto) => p.categories || [])
              .filter((cat: Category) => cat?.id && cat?.name)
              .map((cat: Category) => JSON.stringify(cat))
          )
        ).map(str => JSON.parse(str));

        setCategorias(cats);

        // Extraer marcas únicas
        const marcas = Array.from(new Set(data.map((p: Producto) => p.brand).filter(Boolean)));
        setMarcasDisponibles(marcas);

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
    if (!texto) return '';
    return String(texto)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  };

  // Calcular rating promedio para un producto
  const calcularRatingPromedio = (producto: Producto) => {
    const qualificationCounts = producto.qualification?.count_users || {};
    const totalRatings = Object.values(qualificationCounts).reduce((a, b) => a + b, 0);
    if (totalRatings === 0) return 0;
    
    const weightedSum = Object.entries(qualificationCounts).reduce((sum, [stars, count]) => {
      return sum + (parseInt(stars) * count);
    }, 0);
    
    return weightedSum / totalRatings;
  };

  // Filtrar productos
  const productosFiltrados = useMemo(() => {
    let filtrados = [...allProductos];
    const termino = normalizarTexto(searchTerm || '');

    // Filtro por término de búsqueda
    if (termino) {
      filtrados = filtrados.filter((producto) => {
        const categoriasStr = producto.categories?.map(c => c.name).join(' ') || '';
        const description = normalizarTexto(producto.description || '');
        const nombre = normalizarTexto(producto.name || '');
        const brand = normalizarTexto(producto.brand || '');

        // Buscar en variantes de color
        const colores = producto.features?.flatMap(f => 
          f.variants.filter(v => v.color).map(v => v.color)
          .join(' ') || '');

        return normalizarTexto(categoriasStr).includes(termino) || 
               nombre.includes(termino) ||
               description.includes(termino) ||
               brand.includes(termino) ||
               normalizarTexto(colores).includes(termino);
      });
    }

    // Filtro por categoría
    if (categoriaSeleccionada) {
      filtrados = filtrados.filter(producto =>
        producto.categories?.some(cat => 
          normalizarTexto(cat.name) === normalizarTexto(categoriaSeleccionada)
      ));
    }

    // Filtro por precio (usando el precio base o el primer variant)
    if (precioMin !== '') {
      filtrados = filtrados.filter(producto => {
        const precio = producto.features?.[0]?.variants?.[0]?.price || producto.price;
        return precio >= precioMin;
      });
    }

    if (precioMax !== '') {
      filtrados = filtrados.filter(producto => {
        const precio = producto.features?.[0]?.variants?.[0]?.price || producto.price;
        return precio <= precioMax;
      });
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
          const precioBase = producto.price;
          const precioComparacion = producto.compare_price;
          return precioComparacion > precioBase;
        });
      }
    }

    // Filtro por envío gratis
    if (envioGratis) {
      filtrados = filtrados.filter(producto => 
        producto.features?.some(f => 
          f.variants.some(v => v.cost_shipping === 0)
        ) || producto.shipment === 0
      );
    }

    // Filtro por rating mínimo
    if (ratingMinimo !== '') {
      filtrados = filtrados.filter(producto => 
        calcularRatingPromedio(producto) >= ratingMinimo
      );
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
      counts[cat.name] = productosFiltrados.filter(p => 
        p.categories?.some(c => c.id === cat.id)).length;
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

  const toggleFilter = () => {
    const menu = document.getElementById("filterMenu");
    if (menu) {
      menu.classList.toggle("active");
    }
  };

  // Función para ordenar productos
  const ordenarProductos = (criterio: string) => {
    const productosOrdenados = [...allProductos];
    
    switch(criterio) {
      case 'precio':
        productosOrdenados.sort((a, b) => {
          const precioA = a.features?.[0]?.variants?.[0]?.price || a.price;
          const precioB = b.features?.[0]?.variants?.[0]?.price || b.price;
          return precioA - precioB;
        });
        break;
        
      case 'calificacion':
        productosOrdenados.sort((a, b) => {
          const ratingA = calcularRatingPromedio(a);
          const ratingB = calcularRatingPromedio(b);
          return ratingB - ratingA;
        });
        break;
        
      default:
        // Mantener orden original
        break;
    }
    
    setAllProductos(productosOrdenados);
  };

  return (
    <>
      <Navbar />
      <div className='max-w-7xl mx-auto mt-32 px-4 content-producto'>
        <div className='flex flex-col md:flex-row gap-6'>
          {/* Panel de Filtros */}
          <button 
            className="btn-toggle-filter"
            onClick={toggleFilter}
          >
            ☰ Filtros
          </button>

          <div className='filter' id="filterMenu">
            <div className="flex justify-between items-center mb-4">
              <h2 className='text-lg text-gold-600'>Filtros</h2>
              <button
                onClick={limpiarFiltros}
                className="text-xs text-blue-500 hover:underline"
              >
                Limpiar todo
              </button>
            </div>

            {/* Filtro por Categoría */}
            <div className="mb-6 mt-6">
              <h3 className="font-semibold text-gold-600 mb-2">Categorías</h3>
              <div className="space-y-2">
                {categorias.map(cat => (
                  <div key={cat.id} className="flex items-center input-radio-Category">
                    <input
                      type="radio"
                      id={`cat-${cat.id}`}
                      name="categoria"
                      checked={normalizarTexto(categoriaSeleccionada) === normalizarTexto(cat.name)}
                      onChange={() => setCategoriaSeleccionada(cat.name)}
                      className="mr-2"
                    />
                    <label htmlFor={`cat-${cat.id}`} className="flex-1">
                      {cat.name} <span className="text-gray-500 text-sm">({contadorPorCategoria[cat.name] || 0})</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Filtro por Precio */}
            <div className="mb-6 mt-6">
              <h3 className="font-semibold text-gold-600 mb-2">Precio</h3>
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

            <Separator />

            {/* Filtro por Marca */}
            {marcasDisponibles.length > 0 && (
              <div className="mb-6 mt-6">
                <h3 className="font-semibold mb-2 text-gold-600">Marcas</h3>
                <div className="space-y-2">
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

            <Separator />

            {/* Filtro por Condición */}
            <div className="mb-6 mt-6">
              <h3 className="font-semibold text-gold-600 mb-2">Condición</h3>
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

            <Separator />

            {/* Filtro por Envío */}
            <div className="mb-6 mt-6">
              <h3 className="font-semibold text-gold-600 mb-2">Envío</h3>
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

            <Separator />

            {/* Filtro por Rating */}
            <div className="mb-6 mt-6">
              <h3 className="font-semibold text-gold-600 mb-2">Calificación</h3>
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
            <div className="title-producto">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gold-600">
                  {categoriaSeleccionada || 'Todos los productos'}
                  <span className="text-gray-200 text-sm font-normal ml-2">
                    ({productosFiltrados.length} resultados)
                  </span>
                </h2>
                <div className="flex items-center space-x-2">
                  <Select
                    onValueChange={ordenarProductos}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Ordenar por" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Criterios</SelectLabel>
                        <SelectItem value="relevancia">Relevancia</SelectItem>
                        <SelectItem value="precio">Precio (Menor a Mayor)</SelectItem>
                        <SelectItem value="calificacion">Calificación (Mayor a Menor)</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className="flex space-y-3">
                <div className="flex flex-col space-y-3 m-5">
                  <Skeleton className="h-[125px] w-[250px] rounded-xl bg-gray-900" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
                <div className='flex flex-col space-y-3 m-5'>
                  <Skeleton className="h-[125px] w-[250px] rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
                <div className='flex flex-col space-y-3 m-5'>
                  <Skeleton className="h-[125px] w-[250px] rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
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
              <div>
                <ListaProductos productos={productosPaginados} />
                <div className='contenedor-paginacion'>
                  <div className='pagination'>
                    {productosFiltrados.length > productosPerPage && (
                      <div className="flex justify-center">
                        {currentPage > 1 && (
                          <button
                            onClick={() => paginate(currentPage - 1)}
                            className="btn-paginacion-back"
                          >
                            &laquo; 
                          </button>
                        )}

                        {Array.from({
                          length: Math.ceil(productosFiltrados.length / productosPerPage)
                        }).map((_, index) => {
                          const pageNumber = index + 1;
                          if (
                            pageNumber === 1 ||
                            pageNumber === Math.ceil(productosFiltrados.length / productosPerPage) ||
                            (pageNumber >= currentPage - 2 && pageNumber <= currentPage + 2)
                          ) {
                            return (
                              <button
                                key={index}
                                onClick={() => paginate(pageNumber)}
                                className={`mx-1 px-3 py-1 rounded ${currentPage === pageNumber
                                  ? 'active-page'
                                  : 'bg-gray-200 hover:bg-gray-300'
                                  }`}
                              >
                                {pageNumber}
                              </button>
                            );
                          }
                          return null;
                        })}

                        {currentPage < Math.ceil(productosFiltrados.length / productosPerPage) && (
                          <button
                            onClick={() => paginate(currentPage + 1)}
                            className="btn-paginacion-next"
                          >
                            &raquo;
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}