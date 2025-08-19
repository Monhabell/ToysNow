// Agregar en la primera línea de cada archivo:
/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'

import { useEffect, useState, use } from 'react';
import { useCart } from '@/context/CartContext';
import ListaProductos from '@/components/productos/ListaProductos';
import Navbar from "@/components/Navbar";
import '../../../styles/detalles.css';
import { GoChevronLeft, GoChevronRight } from "react-icons/go";
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation';
import StarRating from '@/components/StarRating'
import Image from 'next/image';
import { 
  FaFacebook, 
  FaWhatsapp, 
  FaLink,
  FaShareAlt
} from "react-icons/fa";

import type {
  Producto,
  Variant,
  ApiResponse
} from '@/types/productos'

interface Props {
  params: Promise<{
    id: string;
    [key: string]: any;
  }>;
}

const SocialShare = ({ 
  productName, 
  productUrl, 
  productDescription 
}: { 
  productName: string; 
  productUrl: string;
  productImage: string;
  productDescription: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const shareText = `¡Mira este producto: ${productName}! ${productDescription.substring(0, 100)}...`;

  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${productUrl}`)}`,
    instagram: `https://www.instagram.com/?url=${encodeURIComponent(productUrl)}`, 
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(productUrl)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch(err => {
        console.error('Error al copiar: ', err);
      });
  };

  const openShareDialog = (platform: string) => {
    const width = 600;
    const height = 400;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;
    
    window.open(
      shareUrls[platform as keyof typeof shareUrls],
      'Compartir',
      `width=${width},height=${height},left=${left},top=${top}`
    );
  };

  return (
    <div className="relative inline-block">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-sm text-white hover:text-gold-500 transition-colors cursor-pointer p-2 rounded-md bg-gray-800 hover:bg-gray-700"
        aria-label="Compartir producto"
      >
        <FaShareAlt size={20} />
        <span>Compartir</span>
      </button>
      
      {isOpen && (
        <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
          <div className="px-4 py-2 text-xs text-gray-500 border-b border-gray-100">
            Compartir Produstos
          </div>
          
          <button
            onClick={() => openShareDialog('facebook')}
            className="cursor-pointer flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <FaFacebook className="text-blue-600 mr-2" />
            Facebook
          </button>
          
          <button
            onClick={() => openShareDialog('whatsapp')}
            className="cursor-pointer flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <FaWhatsapp className="text-green-500 mr-2" />
            WhatsApp
          </button>
        

          <button
            onClick={copyToClipboard}
            className="cursor-pointer flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <FaLink className="text-gray-500 mr-2" />
            {isCopied ? '¡Enlace copiado!' : 'Copiar enlace'}
          </button>
        </div>
      )}
    </div>
  );
};

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
  const { data: session } = useSession()
  const router = useRouter();

  useEffect(() => {
    if (producto) {
      document.title = `${producto.name} | ToysNow`;
      
      // También puedes actualizar meta tags
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription && producto.description) {
        metaDescription.setAttribute('content', producto.description.substring(0, 160) + '...');
      }
    }
  }, [producto]);

  const calcularRatingPromedio = (producto: Producto) => {
    if (!producto.qualification?.count_users) return 0;

    const counts = producto.qualification.count_users;
    const total = Object.values(counts).reduce((sum, count) => sum + count, 0);
    if (total === 0) return 0;

    const sum = Object.entries(counts).reduce(
      (total, [stars, count]) => total + (parseInt(stars) * count),
      0
    );

    return sum / total;
  };

  useEffect(() => {
    const obtenerProducto = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/productoDetalle?slug=${id}`);

        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }

        const result: ApiResponse = await response.json();

        if (!result?.data) {
          throw new Error('Datos del producto no disponibles');
        }

        setProducto(result.data);

        // Filtrar variantes válidas (con precio) y establecer la primera como seleccionada
        const validVariants = result.data.variants.filter(v => v.price !== null);
        if (validVariants.length > 0) {
          setSelectedVariant(validVariants[0]);
        } else {
          // Si no hay variantes con precio, usar el precio base del producto
          setSelectedVariant(null);
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

  const handleRating = (value: number) => {

    console.log('Usuario calificó con:', value)
  }

  const separarAtributos = () => {
    if (!producto) return { generales: {}, variantes: {} };

    const generales: Record<string, string[]> = {};
    const variantes: Record<string, string[]> = {};

    // Primero identificamos qué atributos varían entre las variantes CON PRECIO
    const atributosQueVarían = new Set<string>();
    const variantesConPrecio = producto.variants.filter(v => v.price !== null);

    if (variantesConPrecio.length > 1) {
      // Comparar la primera variante con precio con las demás para ver qué atributos cambian
      const primeraVariant = variantesConPrecio[0];

      variantesConPrecio.forEach(variant => {
        variant.attributes.forEach(attr => {
          const primeraAttrValue = primeraVariant.attributes.find(a => a.name === attr.name)?.value;
          if (primeraAttrValue !== attr.value) {
            atributosQueVarían.add(attr.name);
          }
        });
      });
    }

    // Atributos de todas las variantes (incluyendo las sin precio)
    const allAttributes = new Set<string>();
    producto.variants.forEach(v => {
      v.attributes.forEach(attr => {
        allAttributes.add(attr.name);
      });
    });

    // Separamos los atributos
    Array.from(allAttributes).forEach(attrName => {
      if (atributosQueVarían.has(attrName)) {
        // Es un atributo de variante (seleccionable)
        variantes[attrName] = [];
        variantesConPrecio.forEach(v => {
          const attrValue = v.attributes.find(a => a.name === attrName)?.value;
          if (attrValue && !variantes[attrName].includes(attrValue)) {
            variantes[attrName].push(attrValue);
          }
        });
      } else {
        // Es un atributo general (característica del producto)
        generales[attrName] = [];
        producto.variants.forEach(v => {
          const attrValue = v.attributes.find(a => a.name === attrName)?.value;
          if (attrValue && !generales[attrName].includes(attrValue)) {
            generales[attrName].push(attrValue);
          }
        });
      }
    });

    return { generales, variantes };
  };

  const handleVariantSelect = (attributeName: string, value: string) => {
    if (!producto) return;

    // Solo buscar entre variantes con precio
    const validVariants = producto.variants.filter(v => v.price !== null);

    // Encontrar la variante que coincide con todos los atributos seleccionados
    let matchingVariant = validVariants.find(variant => {
      return Object.entries(variantes).every(([name]) => {  // <-- Eliminamos el _
        if (name === attributeName) {
          return variant.attributes.some(attr => attr.name === name && attr.value === value);
        }
        if (selectedVariant) {
          const currentValue = selectedVariant.attributes.find(attr => attr.name === name)?.value;
          return variant.attributes.some(attr => attr.name === name && attr.value === currentValue);
        }
        return true;
      });
    });

    // Si no encontramos una variante que coincida con todos los atributos,
    // buscar una que al menos coincida con el atributo que estamos cambiando
    if (!matchingVariant) {
      matchingVariant = validVariants.find(variant =>
        variant.attributes.some(attr =>
          attr.name === attributeName && attr.value === value
        )
      );
    }

    if (matchingVariant) {
      setSelectedVariant(matchingVariant);
    }
  };

  const handleComprarAhora = () => {
    if (!producto) return;

    // Crear objeto de producto para el checkout
    const productToCheckout = {
      id: producto.id,
      name: producto.name,
      price: selectedVariant?.price ? parseFloat(selectedVariant.price) : parseFloat(producto.price),
      compare_price: selectedVariant?.compare_price ? parseFloat(selectedVariant.compare_price) :
        producto.compare_price ? parseFloat(producto.compare_price) : null,
      quantity: 1,
      image: producto.images[0] ? getImageUrl(producto.images[0].url) : '/images/default.png',
      variant: selectedVariant ? {
        id: selectedVariant.id,
        attributes: selectedVariant.attributes.map(attr => ({
          name: attr.name,
          value: attr.value
        }))
      } : null,
      stock: selectedVariant?.stock || producto.stock,
      shipment: selectedVariant?.shipment ? parseFloat(selectedVariant.shipment) : 0
    };

    // Guardar en sessionStorage para el checkout
    sessionStorage.setItem('currentOrder', JSON.stringify({
      items: [productToCheckout],
      total: productToCheckout.price,
      shipping: productToCheckout.shipment
    }));

    // Guardar la página actual para posible redirección después del login
    sessionStorage.setItem('currentPage', window.location.href);

    // Redirigir al checkout
    if (!session) {
      router.push('/login');
      return;
    }

    router.push('/checkout');
  };

  const handleAddToCart = (e: React.MouseEvent) => {

    e.stopPropagation();
    if (!producto) return;

    agregarProducto({
      id: producto.id,
      name: producto.name,
      price: selectedVariant?.price ? parseFloat(selectedVariant.price) : parseFloat(producto.price),
      compare_price: selectedVariant?.compare_price ? parseFloat(selectedVariant.compare_price) :
        producto.compare_price ? parseFloat(producto.compare_price) : 0,
      color: selectedVariant?.attributes.find(attr => attr.name.toLowerCase() === 'color')?.value || 'N/A', // ✅ importante
      image: producto.images[0] ? getImageUrl(producto.images[0].url) : '/images/default.png',
      stock: selectedVariant?.stock || producto.stock,
      shipment: selectedVariant?.shipment ? parseFloat(selectedVariant.shipment) : 0,
      cantidad: 1,
      variant: selectedVariant ? {
        id: selectedVariant.id,
        attributes: selectedVariant.attributes
      } : undefined
    })

    // Guardar la página actual para posible redirección después del login
    sessionStorage.setItem('currentPage', window.location.href);

    // Redirigir al checkout
    if (!session) {
      router.push('/login');
      return;
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

  const { generales, variantes } = separarAtributos();
  const variantesConPrecio = producto.variants.filter(v => v.price !== null);

  // Determinar precio actual
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

  const fechaCreacion = new Date(producto.created_at);
  const hoy = new Date();
  const diffDias = Math.ceil((hoy.getTime() - fechaCreacion.getTime()) / (1000 * 60 * 60 * 24));
  const nuevoOk = diffDias <= 30;
  const textoNuevo = (nuevoOk ? 'Nuevo' : '') + ' | +5 vendidos';

  return (
    <>
      
      <div className="relative">
        <Navbar />
      </div>

      <div className='mt-42 xs:mt-32'>
        <div className='max-w-6xl mx-auto content-detalle mt-32'>
          <div className='grid-container'>

            <div className='itemgrupImg'>
              {producto.images.map((img, index) => (
                <Image
                  key={img.id}
                  src={getImageUrl("https://www.softgenix.space/storage/tenants/2b85d6a6-1059-4929-a8bb-5f3d7ca5c732/images/" + img.url)}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = '/images/default.png';
                  }}
                  width={100}
                  height={100}
                  alt={producto.name}
                  onClick={() => setImgSeleccionada(index)}
                  className={`cursor-pointer ${imgSeleccionada === index ? 'border-2 border-gold-500' : ''}`}
                />
              ))}
            </div>

            <div className="imgProduct itemImg" onMouseMove={handleMouseMove}>
              <Image
                src={"http://www.softgenix.space/storage/tenants/2b85d6a6-1059-4929-a8bb-5f3d7ca5c732/images/" + producto.images[imgSeleccionada] ? getImageUrl("https://www.softgenix.space/storage/tenants/2b85d6a6-1059-4929-a8bb-5f3d7ca5c732/images/" + producto.images[imgSeleccionada].url) : '/images/default.png'}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = '/images/default.png';
                }}
                style={{
                  transformOrigin: `${posicion.x}% ${posicion.y}%`
                }}
                width={500}
                height={500}
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


                  <div className="flex items-center gap-3">
                    <SocialShare 
                      productName={producto.name}
                      productUrl={window.location.href}
                      productImage={getImageUrl("https://www.softgenix.space/storage/tenants/2b85d6a6-1059-4929-a8bb-5f3d7ca5c732/images/" + producto.images[0]?.url || '/images/default.png')}
                      productDescription={producto.description || ''}
                    />
                  </div>

                  {/* <div>
                    <CiHeart size={25} className="cursor-pointer hover:text-gold-500" />
                  </div> */}
                </div>

                <h1 className='detail_text text-gold-600'>{producto.name}</h1>

                {calcularRatingPromedio(producto) > 0 && (
                  <div className='star_qualifications'>
                    <StarRating
                      rating={calcularRatingPromedio(producto)}
                      onRate={handleRating}
                    />
                    <p className='ml-2 '>({producto.reviews_count})</p>
                  </div>
                )}

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

                {/* Atributos generales (características del producto) */}
                {Object.entries(generales).length > 0 && (
                  <div className="mt-4">
                    <div className="space-y-2">
                      {Object.entries(generales).map(([name, values]) => (
                        <div key={name} className="flex flex-wrap gap-1">
                          <span className="font-medium text-gold-600">{name}:</span>
                          <span className="text-white-600">{values.join(', ')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Opciones seleccionables (solo para variantes con precio) */}
                {variantesConPrecio.length > 0 && Object.entries(variantes).length > 0 && (
                  <div className="mt-6">
                    {Object.entries(variantes).map(([name, values]) => (
                      <div key={name} className="mt-3">
                        <h4 className="text-sm font-medium text-gold-600 mb-2">{name}:</h4>
                        <div className="flex gap-2 flex-wrap">
                          {values.map((value, idx) => {
                            const isSelected = selectedVariant?.attributes.some(
                              attr => attr.name === name && attr.value === value
                            );

                            // Verificar disponibilidad
                            const isAvailable = variantesConPrecio.some(v =>
                              v.attributes.some(a =>
                                a.name === name &&
                                a.value === value &&
                                v.stock > 0
                              )
                            );

                            if (name === 'color') {
                              return (
                                <button
                                  key={idx}
                                  className={`w-8 h-8 rounded-full border-2 m-1 transition-all duration-200
                                    ${isSelected ? 'ring-2 ring-gold-600' : ''}
                                    ${!isAvailable ? 'opacity-40 cursor-not-allowed' : 'hover:scale-110'}
                                  `}
                                  style={{
                                    backgroundColor: value,  // 👈 Establece el color desde el value
                                    borderColor: isSelected ? '#FFD700' : '#ccc',
                                  }}
                                  onClick={() => handleVariantSelect(name, value)}
                                  disabled={!isAvailable}
                                  title={!isAvailable ? 'No disponible' : value}
                                ></button>
                              );
                            }

                            return (
                              <button
                                key={idx}
                                className={`cursor-pointer px-3 py-1 border rounded text-sm ${isSelected
                                  ? 'bg-black text-gold-600 border-gold-500'
                                  : isAvailable
                                    ? 'bg-gray border-gray-600 hover:text-gold-600 hover:bg-gold-50'
                                    : 'bg-gold-600 border-gray-200 text-gray-400 cursor-not-allowed'
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
                    onClick={handleComprarAhora}
                    disabled={currentStock <= 0}
                  >
                    Comprar ahora
                  </button>

                  <button
                    onClick={handleAddToCart}
                    className="btnsed border border-gold-500 text-gold-500 hover:bg-gold-50"
                    disabled={currentStock <= 0}
                  >
                    🛒 Agregar al carrito
                  </button>
                </div>

                <div className='mt-6'>
                  <div className="metodos-pago">
                    <h3 className="font-medium mb-3 text-amber-400">Medios de pago</h3>
                    
                    {/* Nota Mercado Pago */}
                    <div className="mb-4 text-sm text-gray-400 italic">
                      Todas las compras se procesan a través de Mercado Pago
                    </div>

                    {/* Promoción */}
                    <div className="promo bg-gray-800 border border-amber-600/50 text-amber-300 p-3 rounded-lg mb-4 flex items-center gap-2 shadow-lg shadow-amber-900/20">
                      <span role="img" aria-label="tarjeta" className="text-xl">💳</span> 
                      <span>¡Hasta <strong className="text-amber-400">6 cuotas sin interés</strong> con Mercado Pago!</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className='itemProducRel'>
              <div className='mb-3'>
                <h1 className='mb-5 text-gold-600 text-2xl font-bold'>Detalles del producto</h1>
                {producto.description && (
                  <div className='text-sm text-white-700'>
                    <p>{producto.description}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {relacionados.length > 0 && (
          <div className='productos-relacionados max-w-6xl mx-auto mt-32'>
            <div className='mt-5'>
              <h1 className='text-gold-600 text-2xl font-bold mb-4'>Recomendaciones para ti</h1>
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
                  <ListaProductos
                    productos={relacionados as Producto[]}
                    isSlider
                  />
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
        )}


        <div className='max-w-6xl mx-auto mt-10 px-4 bg-black '>
          <div className='mt-16 bg-black rounded-lg p-8 shadow-sm'>
            <h2 className="text-2xl font-bold mb-6 text-gold-500">Preguntas y respuestas</h2>

            {preguntas.length > 0 && (
              <div className="space-y-6">
                {preguntas.map((item, index) => (
                  <div key={index} className="bg-gray-50 p-5 rounded-lg shadow-sm">
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

            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4 text-gold-500">¿Tienes alguna pregunta?</h3>
              <div className="flex gap-3">
                <input
                  type="text"
                  className="cuestions"
                  placeholder="Escribe tu pregunta aquí..."
                  value={nuevaPregunta}
                  onChange={(e) => setNuevaPregunta(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && enviarPregunta()}
                />
                <button
                  className="send_cuestions"
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