'use client'

import { useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';
import { CiHeart, CiShoppingCart } from "react-icons/ci";
import { FaHeart, FaShoppingCart, FaStar, FaRegStar, FaChevronRight, FaChevronLeft } from "react-icons/fa";
import ListaProductos from '@/components/productos/ListaProductos';
import Navbar from "@/components/Navbar";
import '../../../styles/detalles.css';
import { Separator } from "@/components/ui/separator"
import { GoChevronLeft, GoChevronRight } from "react-icons/go";

interface Variant {
  id: number;
  sku: string | null;
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

interface Producto {
  id: number;
  name: string;
  slug: string | null;
  description: string;
  price: string;
  compare_price: string;
  stock: number;
  is_available: boolean;
  is_feature: boolean;
  relevance: number;
  brand: {
    id: number;
    name: string;
  };
  variants: Variant[];
  images: {
    id: number;
    product_id: number;
    url: string;
  }[];
  categories: {
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
    parent_id: number | null;
  }[];
  created_at: string;
  updated_at: string;
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

interface SEO {
  meta_title: string;
  meta_description: string;
  keywords: string[];
}

interface ApiResponse {
  data: Producto;
}

interface Props {
  params: {
    id: string;
    [key: string]: any;
  };
}

export default function ProductoDetalle({ params }: Props) {
  const { id } = params;
  const { agregarProducto } = useCart();

  const [producto, setProducto] = useState<Producto | null>(null);
  const [relacionados, setRelaciones] = useState<Producto[]>([]);
  const [posicion, setPosicion] = useState({ x: 0, y: 0 });
  const [mostrarBotones, setMostrarBotones] = useState(false);
  const [imgSeleccionada, setImgSeleccionada] = useState(0);
  const [preguntas, setPreguntas] = useState<{ pregunta: string; respuesta: string }[]>([]);
  const [nuevaPregunta, setNuevaPregunta] = useState('');
  const [selectedVariant, setSelectedVariant] = useState<{
    price: number;
    compare_price: number;
    stock: number;
    images: string[];
    color?: string;
    size?: string;
  } | null>(null);

  useEffect(() => {
    const obtenerProducto = async () => {
      try {
        const response = await fetch(`/api/productoDetalle?id=${id}`);
        const result: ApiResponse = await response.json();
        
        setProducto(result.data || null);

        // Set the first variant as default if available
        if (result.data?.variants?.[0]) {
          const variant = result.data.variants[0];
          setSelectedVariant({
            price: parseFloat(variant.price || result.data.price),
            compare_price: parseFloat(variant.compare_price || result.data.compare_price),
            stock: variant.stock,
            images: result.data.images.map(img => img.url),
            // Extraer atributos como color y tamaño si existen
            color: variant.attributes.find(attr => attr.name.toLowerCase() === 'color')?.value,
            size: variant.attributes.find(attr => attr.name.toLowerCase() === 'tamaño')?.value
          });
        } else {
          // Si no hay variantes, usar los datos base del producto
          setSelectedVariant({
            price: parseFloat(result.data.price),
            compare_price: parseFloat(result.data.compare_price),
            stock: result.data.stock,
            images: result.data.images.map(img => img.url)
          });
        }
      } catch (error) {
        console.error('Error al obtener el producto:', error);
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

        console.log(result)

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

  if (!producto) {
    return <div>Cargando...</div>;
  }

  const fechaCreacion = new Date(producto.created_at);
  const hoy = new Date();
  const diffDias = Math.ceil((hoy.getTime() - fechaCreacion.getTime()) / (1000 * 60 * 60 * 24));
  const nuevoOk = diffDias <= 30;

  const textoNuevo = (nuevoOk ? 'Nuevo' : '') + ' | +5 vendidos';

  const currentPrice = selectedVariant?.price || parseFloat(producto.price);
  const currentComparePrice = selectedVariant?.compare_price || parseFloat(producto.compare_price);
  const valor = currentPrice;
  const descuento = currentComparePrice > currentPrice
    ? Math.round(((currentComparePrice - currentPrice) / currentComparePrice) * 100)
    : 0;

  // Get available colors and sizes from variants
  const colors = Array.from(new Set(
    producto.variants?.flatMap(variant =>
      variant.attributes
        .filter(attr => attr.name.toLowerCase() === 'color')
        .map(attr => attr.value)
    ) || []
  ));

  const sizes = Array.from(new Set(
    producto.variants?.flatMap(variant =>
      variant.attributes
        .filter(attr => attr.name.toLowerCase() === 'tamaño')
        .map(attr => attr.value)
    ) || []
  ));

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
                  src={img.url}
                  onError={(e) => {
                      const target = e.target as HTMLImageElement;  
                      target.onerror = null;
                      target.src = '/images/default.png';
                  }}
                  alt={producto.name}
                  onClick={() => setImgSeleccionada(index)}
                />
              ))}
            </div>

            <div className="imgProduct itemImg" onMouseMove={handleMouseMove}>
              <img
                src={producto.images[imgSeleccionada]?.url || ''}
                onError={(e) => {
                    const target = e.target as HTMLImageElement;  
                    target.onerror = null;
                    target.src = '/images/default.png';
                }}
                style={{
                  transformOrigin: `${posicion.x}% ${posicion.y}%`
                }}
                alt={producto.name}
              />
            </div>

            <div className='itemData'>
              <div className='border-Black'>
                <div className='seccion_top'>
                  <div>
                    <h3 className='pb-5'>{textoNuevo}</h3>
                  </div>
                  <div>
                    <CiHeart size={25} />
                  </div>
                </div>

                <h1 className='detail_text text-gold-600'>{producto.name}</h1>

                {descuento > 0 && (
                  <div className='flex items-center gap-2'>
                    <p className='valorPresio'>${currentPrice.toLocaleString('en-CO')}</p>
                    <p className='text-gray-500 line-through'>${currentComparePrice.toLocaleString('en-CO')}</p>
                    <p className='text-red-500'>{descuento}% OFF</p>
                  </div>
                )}

                {descuento <= 0 && (
                  <p className='valorPresio'>${valor.toLocaleString('en-CO')}</p>
                )}

                <p>Existencias: {selectedVariant?.stock || producto.stock}</p>

                {/* Color selection */}
                {colors.length > 0 && (
                  <div className='mt-4'>
                    <h3 className='font-medium'>Colores:</h3>
                    <div className='flex gap-2 mt-2'>
                      {colors.map((color, index) => (
                        <button
                          key={index}
                          className={`w-8 h-8 rounded-full border ${selectedVariant?.color === color ? 'ring-2 ring-blue-500' : ''}`}
                          style={{ backgroundColor: color }}
                          onClick={() => {
                            const variant = producto.variants.find(v => 
                              v.attributes.some(attr => 
                                attr.name.toLowerCase() === 'color' && attr.value === color
                              )
                            );
                            if (variant) {
                              setSelectedVariant({
                                price: parseFloat(variant.price || producto.price),
                                compare_price: parseFloat(variant.compare_price || producto.compare_price),
                                stock: variant.stock,
                                images: producto.images.map(img => img.url),
                                color,
                                size: variant.attributes.find(attr => attr.name.toLowerCase() === 'tamaño')?.value
                              });
                            }
                          }}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Size selection */}
                {sizes.length > 0 && (
                  <div className='mt-4'>
                    <h3 className='font-medium'>Tamaños:</h3>
                    <div className='flex gap-2 mt-2'>
                      {sizes.map((size, index) => (
                        <button
                          key={index}
                          className={`cursor-pointer px-3 py-1 border rounded ${selectedVariant?.size === size ? 'bg-blue-500 text-white' : 'bg-gray-400'}`}
                          onClick={() => {
                            const variant = producto.variants.find(v => 
                              v.attributes.some(attr => 
                                attr.name.toLowerCase() === 'tamaño' && attr.value === size
                              )
                            );
                            if (variant) {
                              setSelectedVariant({
                                price: parseFloat(variant.price || producto.price),
                                compare_price: parseFloat(variant.compare_price || producto.compare_price),
                                stock: variant.stock,
                                images: producto.images.map(img => img.url),
                                color: variant.attributes.find(attr => attr.name.toLowerCase() === 'color')?.value,
                                size
                              });
                            }
                          }}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <button 
                  className="btnsed"
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
                    
                    sessionStorage.setItem('currentOrder', JSON.stringify(order));
                    window.location.href = '/checkout';
                  }}
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
                      images: producto.images.map(img => img.url)
                    });
                  }}
                  className="btnsed"
                >
                  🛒 Agregar al carrito
                </button>

                <div className='mt-4'>
                  <div className="metodos-pago">
                    <h3>Medios de pago</h3>

                    <div className="promo">
                      <span role="img" aria-label="tarjeta">💳</span> ¡Paga en hasta 6 cuotas con 0% interés!
                    </div>

                    <div className="seccion">
                      <strong>Tarjetas de crédito</strong>
                      <div className="iconos">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" alt="Visa" width="50" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png" alt="MasterCard" width="50" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo.svg" alt="American Express" width="50" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className='itemProducRel'>
              <div className='d-flex mb-3'>
                <h1 className='mb-5 text-gold-600'>Detalles del producto</h1>
                {producto.description && (
                  <div className='text-sm'>
                    <p>{producto.description}</p>
                  </div>
                )}
              </div>

              <Separator />

              <div className='d-flex mt-5'>
                <h1 className='text-gold-600'>Productos relacionados</h1>
              </div>
              <div className="slider-container">
                {mostrarBotones && (
                  <button className="slider-btn left" onClick={scrollLeft}><GoChevronLeft /></button>
                )}

                <div id='slider' className='overflow-x-auto p-2 scroll-smooth scrollbar-hide'>
                  <ListaProductos productos={relacionados} isSlider />
                </div>

                {mostrarBotones && (
                  <button className="slider-btn right" onClick={scrollRight}><GoChevronRight /></button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Questions section */}
        <div className='max-w-6xl mx-auto mt-10 px-4'>
          <div className='mt-16 bg-gray-900 rounded-lg p-8'>
            <h2 className="text-2xl font-bold mb-6 text-gold-500">Preguntas y respuestas</h2>
            
            {/* Preguntas del usuario */}
            {preguntas.length > 0 && (
              <div className="space-y-6">
                {preguntas.map((item, index) => (
                  <div key={index} className="bg-gray-800 p-5 rounded-lg">
                    <div className="flex items-start gap-4">
                      <div className="bg-gold-500 text-black p-2 rounded-full flex-shrink-0">
                        <span>❓</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-100">{item.pregunta}</p>
                        {item.respuesta && (
                          <div className="flex items-start mt-4 gap-4">
                            <div className="bg-gray-700 text-gold-500 p-2 rounded-full flex-shrink-0">
                              <span>💬</span>
                            </div>
                            <p className="text-gray-300">{item.respuesta}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Formulario de preguntas */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 text-gold-500">¿Tienes alguna pregunta?</h3>
              <div className="flex gap-3">
                <input
                  type="text"
                  className="flex-1 bg-gray-800 border border-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-gray-100"
                  placeholder="Escribe tu pregunta aquí..."
                  value={nuevaPregunta}
                  onChange={(e) => setNuevaPregunta(e.target.value)}
                />
                <button
                  className="px-6 py-3 bg-gold-500 hover:bg-gold-600 text-black rounded-lg transition-colors font-bold"
                  onClick={enviarPregunta}
                >
                  Enviar
                </button>
              </div>
            </div>

            {preguntas.length === 0 && (
              <div className="text-center py-8 bg-gray-800 rounded-lg">
                <p className="text-gray-400">Aún no hay preguntas sobre este producto.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}