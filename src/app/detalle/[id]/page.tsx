'use client'

import { useEffect, useState, use } from 'react';
import { useCart } from '@/context/CartContext';
import { CiHeart, CiShoppingCart } from "react-icons/ci";
import { FaHeart, FaShoppingCart, FaStar, FaRegStar, FaChevronRight, FaChevronLeft } from "react-icons/fa";
import ListaProductos from '@/components/productos/ListaProductos';
import Navbar from "@/components/Navbar";
import '../../../styles/detalles.css';
import { Separator } from "@/components/ui/separator"
import { GoChevronLeft, GoChevronRight } from "react-icons/go";
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation';


interface Variant {
  id: number;
  price: string | null;
  stock: number;
  is_available: boolean;
  compare_price: string | null;
  shipment: string | null;
  attributes: {
    id: number;
    name: string;
    value: string;
  }[];
}

interface Category {
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
}

interface Image {
  id: number;
  product_id: number;
  url: string;
}

interface Brand {
  id: number;
  name: string;
}

interface SEO {
  title: string | null;
  description: string | null;
  keywords: string | null;
}

interface Producto {
  id: number;
  name: string;
  slug: string | null;
  description: string;
  price: string;
  compare_price: string | null;
  stock: number;
  is_available: boolean;
  is_feature: boolean;
  relevance: number;
  qualification: number;
  brand: Brand;
  variants: Variant[];
  images: Image[];
  categories: Category[];
  reviews: any[];
  reviews_count: number;
  created_at: string;
  updated_at: string;
  seo: SEO;
}

interface ApiResponse {
  data: Producto;
}

interface Props {
  params: Promise<{
    id: string;
    [key: string]: any;
  }>;
}

export default function ProductoDetalle({ params }: Props) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const { agregarProducto } = useCart();

  const [producto, setProducto] = useState<Producto | null>(null);
  const [relacionados, setRelaciones] = useState<Producto[]>([]);
  const [posicion, setPosicion] = useState({ x: 0, y: 0 });
  const [mostrarBotones, setMostrarBotones] = useState(false);
  const [imgSeleccionada, setImgSeleccionada] = useState(0);
  const [preguntas, setPreguntas] = useState<{ pregunta: string; respuesta: string }[]>([]);
  const [nuevaPregunta, setNuevaPregunta] = useState('');
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession()
    const router = useRouter();
  


  useEffect(() => {
    const obtenerProducto = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/productoDetalle?id=${id}`);

        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }

        const result: ApiResponse = await response.json();

        if (!result?.data) {
          throw new Error('Datos del producto no disponibles');
        }

        setProducto(result.data);

        // Set the first variant as default if available
        if (result.data.variants?.length > 0) {
          setSelectedVariant(result.data.variants[0]);
        }

        
      } catch (error) {
        console.error('Error al obtener el producto:', error);
        setProducto(null);
      } finally {
        setLoading(false);
      }
    };

    obtenerProducto();
  }, [id]);

  useEffect(() => {
    const obtenerRelacionados = async () => {
      if (!producto) return;
      try {
        const res = await fetch('/api/productos');
        const result: { data: Producto[] } = await res.json();

        const relacionados = result.data.filter((p) =>
          p.id !== producto.id &&
          p.categories.some((cat) =>
            producto.categories.some(pCat => pCat.name === cat.name)
          ));

        setRelaciones(relacionados);
      } catch (error) {
        console.error('Error al cargar productos relacionados:', error);
      }
    };

    obtenerRelacionados();
  }, [producto]);

  useEffect(() => {
    const comprobarScroll = () => {
      const slider = document.getElementById('slider');
      if (slider) {
        setMostrarBotones(slider.scrollWidth > slider.clientWidth);
      }
    };

    comprobarScroll();
    window.addEventListener('resize', comprobarScroll);

    return () => window.removeEventListener('resize', comprobarScroll);
  }, [relacionados]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setPosicion({ x, y });
  };



  const scrollLeft = () => {
    const slider = document.getElementById('slider');
    slider?.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollRight = () => {
    const slider = document.getElementById('slider');
    slider?.scrollBy({ left: 500, behavior: 'smooth' });
  };

  const enviarPregunta = () => {
    if (nuevaPregunta.trim() === '') return;

    const nueva = {
      pregunta: nuevaPregunta,
      respuesta: "¡Gracias por tu pregunta! Pronto alguien del equipo te responderá."
    };

    setPreguntas([...preguntas, nueva]);
    setNuevaPregunta('');
  };

  const getImageUrl = (url: string) => {
    if (url.startsWith('http')) return url;
    return `${process.env.NEXT_PUBLIC_BACKEND_URL || ''}/${url}`;
  };

  // Group attributes by name
  const groupedAttributes: Record<string, string[]> = {};
  producto?.variants.forEach(variant => {
    variant.attributes.forEach(attr => {
      if (!groupedAttributes[attr.name]) {
        groupedAttributes[attr.name] = [];
      }
      if (!groupedAttributes[attr.name].includes(attr.value)) {
        groupedAttributes[attr.name].push(attr.value);
      }
    });
  });

  const handleVariantSelect = (attributeName: string, value: string) => {
    if (!producto) return;

    // Find variant that matches the selected attribute
    const matchingVariant = producto.variants.find(variant =>
      variant.attributes.some(attr =>
        attr.name === attributeName && attr.value === value
      )
    );

    if (matchingVariant) {
      setSelectedVariant(matchingVariant);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-500"></div>
      </div>
    );
  }

  if (!producto) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl">No se pudo cargar el producto</p>
      </div>
    );
  }

  const fechaCreacion = new Date(producto.created_at);
  const hoy = new Date();
  const diffDias = Math.ceil((hoy.getTime() - fechaCreacion.getTime()) / (1000 * 60 * 60 * 24));
  const nuevoOk = diffDias <= 30;
  const textoNuevo = (nuevoOk ? 'Nuevo' : '') + ' | +5 vendidos';

  // Determine current price and compare price
  const currentPrice = selectedVariant?.price
    ? parseFloat(selectedVariant.price)
    : parseFloat(producto.price);

  const currentComparePrice = selectedVariant?.compare_price
    ? parseFloat(selectedVariant.compare_price)
    : producto.compare_price
      ? parseFloat(producto.compare_price)
      : null;

  const descuento = currentComparePrice && currentComparePrice > currentPrice
    ? Math.round(((currentComparePrice - currentPrice) / currentComparePrice) * 100)
    : 0;

  const currentStock = selectedVariant?.stock || producto.stock;

  const separarAtributos = () => {
    const generales: Record<string, string[]> = {};
    const variantes: Record<string, string[]> = {};

    // Primero identificamos qué atributos varían entre variantes
    const atributosQueVarían = new Set<string>();

    if (producto.variants.length > 1) {
      // Comparar la primera variante con las demás para ver qué atributos cambian
      const primeraVariant = producto.variants[0];

      producto.variants.forEach(variant => {
        variant.attributes.forEach(attr => {
          const primeraAttrValue = primeraVariant.attributes.find(a => a.name === attr.name)?.value;
          if (primeraAttrValue !== attr.value) {
            atributosQueVarían.add(attr.name);
          }
        });
      });
    }

    // Ahora separamos los atributos
    producto.variants[0].attributes.forEach(attr => {
      if (atributosQueVarían.has(attr.name)) {
        // Es un atributo de variante
        if (!variantes[attr.name]) {
          variantes[attr.name] = [];
        }
        // Agregamos todos los valores posibles de todas las variantes
        producto.variants.forEach(v => {
          const attrValue = v.attributes.find(a => a.name === attr.name)?.value;
          if (attrValue && !variantes[attr.name].includes(attrValue)) {
            variantes[attr.name].push(attrValue);
          }
        });
      } else {
        // Es un atributo general
        if (!generales[attr.name]) {
          generales[attr.name] = [];
        }
        if (!generales[attr.name].includes(attr.value)) {
          generales[attr.name].push(attr.value);
        }
      }
    });

    return { generales, variantes };
  };

  const { generales, variantes } = separarAtributos();

  return (
    <>
      <div className="relative">
        <Navbar />
      </div>

      <div className='mt-32'>
        <div className='max-w-6xl mx-auto content-detalle mt-32'>
          <div className='grid-container'>
            <div className='itemgrupImg'>
              {producto.images.map((img, index) => (
                <img
                  key={img.id}
                  src={getImageUrl(img.url)}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = '/images/default.png';
                  }}
                  alt={producto.name}
                  onClick={() => setImgSeleccionada(index)}
                  className={`cursor-pointer ${imgSeleccionada === index ? 'border-2 border-gold-500' : ''}`}
                />
              ))}
            </div>

            <div className="imgProduct itemImg" onMouseMove={handleMouseMove}>
             
              <img
                src={producto.images[imgSeleccionada] ? getImageUrl(producto.images[imgSeleccionada].url) : '/images/default.png'}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = '/images/default.png';
                }}
                style={{
                  transformOrigin: `${posicion.x}% ${posicion.y}%`
                }}
                alt={producto.name}
                className="w-full h-full object-contain"
              />
            </div>

            <div className='itemData'>
              <div className='border-Black'>
                <div className='seccion_top'>
                  <div>
                    <h3 className='pb-5'>{textoNuevo}</h3>
                  </div>
                  <div>
                    <CiHeart size={25} className="cursor-pointer hover:text-gold-500" />
                  </div>
                </div>

                <h1 className='detail_text text-gold-600'>{producto.name}</h1>

                {descuento > 0 ? (
                  <div className='flex items-center gap-2'>
                    <p className='valorPresio'>${currentPrice.toLocaleString('en-CO')}</p>
                    <p className='text-gray-500 line-through'>${currentComparePrice?.toLocaleString('en-CO')}</p>
                    <p className='text-red-500'>{descuento}% OFF</p>
                  </div>
                ) : (
                  <p className='valorPresio'>${currentPrice.toLocaleString('en-CO')}</p>
                )}

                <p className={`mt-2 ${currentStock > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {currentStock > 0 ? `Disponible (${currentStock} unidades)` : 'Agotado'}
                </p>


                {/* Atributos generales */}
                {Object.entries(generales).length > 0 && (
                  <div className="mt-4">
                    <h3 className="font-medium mb-2">Características:</h3>
                    <div className="space-y-2">
                      {Object.entries(generales).map(([name, values]) => (
                        <div key={name} className="flex flex-wrap gap-1">
                          <span className="font-medium text-gray-700">{name}:</span>
                          <span className="text-gray-600">{values.join(', ')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Atributos de variante */}
                {Object.entries(variantes).length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-medium mb-2">Opciones:</h3>
                    {Object.entries(variantes).map(([name, values]) => (
                      <div key={name} className="mt-3">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">{name}:</h4>
                        <div className="flex gap-2 flex-wrap">
                          {values.map((value, idx) => {
                            const isSelected = selectedVariant?.attributes.some(
                              attr => attr.name === name && attr.value === value
                            );
                            const isAvailable = producto.variants.some(v =>
                              v.attributes.some(a =>
                                a.name === name &&
                                a.value === value &&
                                v.stock > 0
                              )
                            );

                            return (
                              <button
                                key={idx}
                                className={`px-3 py-1 border rounded text-sm ${isSelected
                                    ? 'bg-gold-500 text-white border-gold-500'
                                    : isAvailable
                                      ? 'bg-white border-gray-300 hover:bg-gray-100'
                                      : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                                  }`}
                                onClick={() => handleVariantSelect(name, value)}
                                disabled={!isAvailable}
                                title={!isAvailable ? 'No disponible' : ''}
                              >
                                {value}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex flex-col gap-3 mt-6">
                  <button
                    className="btnsed bg-gold-500 hover:bg-gold-600 text-white"
                    onClick={() => {
                      const order = {
                        items: [{
                          ...producto,
                          price: currentPrice,
                          selectedVariant,
                          quantity: 1
                        }],
                        total: currentPrice,
                        shipping: selectedVariant?.shipment ? parseFloat(selectedVariant.shipment) : 0
                      };

                      // guardar en local storage la pagina actual
                      console.log(window.location.href);
                      sessionStorage.setItem('currentPage', window.location.href);

                     

                      if (!session ) {
                        router.push('/login');
                        return;
                      }

                      
                      sessionStorage.setItem('currentOrder', JSON.stringify(order));
                      window.location.href = '/checkout';
                    }}
                    disabled={currentStock <= 0}
                  >
                    Comprar ahora
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      agregarProducto({
                        ...producto,
                        price: currentPrice,
                        selectedVariant,
                        images: producto.images.map(img => getImageUrl(img.url))
                      });
                    }}
                    className="btnsed border border-gold-500 text-gold-500 hover:bg-gold-50"
                    disabled={currentStock <= 0}
                  >
                    🛒 Agregar al carrito
                  </button>
                </div>

                <div className='mt-6'>
                  <div className="metodos-pago">
                    <h3 className="font-medium mb-3">Medios de pago</h3>

                    <div className="promo bg-blue-50 text-blue-700 p-3 rounded-lg mb-4">
                      <span role="img" aria-label="tarjeta">💳</span> ¡Paga en hasta 6 cuotas con 0% interés!
                    </div>

                    <div className="seccion mb-4">
                      <strong className="block mb-2">Tarjetas de crédito</strong>
                      <div className="iconos flex gap-3">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png"
                          alt="Visa"
                          className="h-8" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png"
                          alt="MasterCard"
                          className="h-8" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo.svg"
                          alt="American Express"
                          className="h-8" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className='itemProducRel'>
              <div className='mb-3'>
                <h1 className='mb-5 text-gold-600 text-2xl font-bold'>Detalles del producto</h1>
                {producto.description && (
                  <div className='text-sm text-gray-700'>
                    <p>{producto.description}</p>
                  </div>
                )}
              </div>

              <Separator className="my-6" />

              <div className='mt-5'>
                <h1 className='text-gold-600 text-2xl font-bold mb-4'>Productos relacionados</h1>
                <div className="relative">
                  {mostrarBotones && (
                    <button
                      className="slider-btn left absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
                      onClick={scrollLeft}
                    >
                      <GoChevronLeft className="text-gray-700" size={24} />
                    </button>
                  )}

                  <div
                    id='slider'
                    className='overflow-x-auto p-2 scroll-smooth scrollbar-hide whitespace-nowrap'
                  >
                    <ListaProductos productos={relacionados} isSlider />
                  </div>

                  {mostrarBotones && (
                    <button
                      className="slider-btn right absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
                      onClick={scrollRight}
                    >
                      <GoChevronRight className="text-gray-700" size={24} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Questions section */}
        <div className='max-w-6xl mx-auto mt-10 px-4'>
          <div className='mt-16 bg-gray-50 rounded-lg p-8 shadow-sm'>
            <h2 className="text-2xl font-bold mb-6 text-gold-500">Preguntas y respuestas</h2>

            {/* User questions */}
            {preguntas.length > 0 && (
              <div className="space-y-6">
                {preguntas.map((item, index) => (
                  <div key={index} className="bg-white p-5 rounded-lg shadow-sm">
                    <div className="flex items-start gap-4">
                      <div className="bg-gold-500 text-white p-2 rounded-full flex-shrink-0">
                        <span>❓</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{item.pregunta}</p>
                        {item.respuesta && (
                          <div className="flex items-start mt-4 gap-4">
                            <div className="bg-gray-100 text-gold-500 p-2 rounded-full flex-shrink-0">
                              <span>💬</span>
                            </div>
                            <p className="text-gray-600">{item.respuesta}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Question form */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4 text-gold-500">¿Tienes alguna pregunta?</h3>
              <div className="flex gap-3">
                <input
                  type="text"
                  className="flex-1 bg-white border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-gray-800"
                  placeholder="Escribe tu pregunta aquí..."
                  value={nuevaPregunta}
                  onChange={(e) => setNuevaPregunta(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && enviarPregunta()}
                />
                <button
                  className="px-6 py-3 bg-gold-500 hover:bg-gold-600 text-white rounded-lg transition-colors font-medium"
                  onClick={enviarPregunta}
                >
                  Enviar
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-2">Por favor, realiza preguntas relacionadas con el producto</p>
            </div>

            {preguntas.length === 0 && (
              <div className="text-center py-8 bg-white rounded-lg mt-6 shadow-sm">
                <p className="text-gray-500">Aún no hay preguntas sobre este producto.</p>
                <p className="text-gray-400 text-sm mt-2">Sé el primero en preguntar</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}