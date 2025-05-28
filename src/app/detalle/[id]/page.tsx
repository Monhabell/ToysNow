'use client'

import { useEffect, useState, use } from 'react';
import { useCart } from '@/context/CartContext';
import { CiHeart, CiShoppingCart } from "react-icons/ci";
import { FaHeart, FaShoppingCart, FaStar, FaRegStar, FaChevronRight, FaChevronLeft } from "react-icons/fa";
import ListaProductos from '@/components/productos/ListaProductos';
import Navbar from "@/components/Navbar";
import '../../../styles/detalles.css';
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

interface SEO {
  meta_title: string;
  meta_description: string;
  keywords: string[];
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
  seo: SEO;
  created_at: string;
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
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);

  useEffect(() => {
    const obtenerProducto = async () => {
      try {
        const response = await fetch('/api/productos');
        const productos: Producto[] = await response.json();
        const encontrado = productos.find((prod) => prod.id.toString() === id);
        setProducto(encontrado || null);

        // Set the first variant as default if available
        if (encontrado?.features?.[0]?.variants?.[0]) {
          setSelectedVariant(encontrado.features[0].variants[0]);
        }
      } catch (error) {
        console.error('Error al obtener los productos:', error);
      }
    };

    obtenerProducto();
  }, [id]);

  useEffect(() => {
    const obtenerRelacionados = async () => {
      if (!producto) return;
      try {
        const res = await fetch('/api/productos');
        const productos: Producto[] = await res.json();

        const relacionados = productos.filter((p) =>
          p.id !== producto.id &&
          p.categories.some((cat) =>
            producto.categories.some(pCat => pCat.id === cat.id)
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

  const currentPrice = selectedVariant?.price || producto.price;
  const currentComparePrice = selectedVariant?.compare_price || producto.compare_price;
  const valor = currentPrice;
  const descuento = currentComparePrice > currentPrice
    ? Math.round(((currentComparePrice - currentPrice) / currentComparePrice) * 100)
    : 0;

  // Calculate average qualification
  const qualificationCounts = producto.qualification?.count_users || {};
  const totalRatings = Object.values(qualificationCounts).reduce((a, b) => a + b, 0);
  const weightedSum = Object.entries(qualificationCounts).reduce((sum, [stars, count]) => {
    return sum + (parseInt(stars) * count);
  }, 0);
  const averageRating = totalRatings > 0 ? (weightedSum / totalRatings) : 0;

  // Get approved questions from the product
  const approvedQuestions = producto.questions?.filter(q => q.is_approved) || [];

  // Get available colors and sizes from variants
  const colors = Array.from(new Set(
    producto.features?.flatMap(feature =>
      feature.variants
        .filter(v => v.color)
        .map(v => v.color as string)
    ) || []
  ));

  const sizes = Array.from(new Set(
    producto.features?.flatMap(feature =>
      feature.variants
        .filter(v => v.size)
        .map(v => v.size as string)
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
              {producto.img.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={producto.name}
                  onClick={() => setImgSeleccionada(index)}
                />
              ))}
            </div>

            <div className="imgProduct itemImg" onMouseMove={handleMouseMove}>
              <img
                src={producto.img[imgSeleccionada]}
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
                            const variant = producto.features[0].variants.find(v => v.color === color);
                            if (variant) setSelectedVariant(variant);
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
                          className={` cursor-pointer px-3 py-1 border rounded ${selectedVariant?.size === size ? 'bg-blue-500 text-white' : 'bg-gray-400'}`}
                          onClick={() => {
                            const variant = producto.features[0].variants.find(v => v.size === size);
                            if (variant) setSelectedVariant(variant);
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
                    // Crear un pedido con el producto actual
                    const order = {
                      items: [{
                        ...producto,
                        price: currentPrice,
                        selectedVariant,
                        quantity: 1 // Puedes añadir un selector de cantidad si lo necesitas
                      }],
                      total: currentPrice,
                      shipping: selectedVariant?.cost_shipping || producto.shipment || 0
                    };
                    
                    // Guardar el pedido en sessionStorage para el proceso de pago
                    sessionStorage.setItem('currentOrder', JSON.stringify(order));
                    
                    // Redirigir a la página de checkout
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
                      selectedVariant
                    });
                  }}
                  className="btnsed"
                >
                  🛒 Agregar al carrito
                </button>



                {averageRating > 0 && (
                  <div className='mt-4'>
                    <div className='flex items-center'>
                      {[...Array(5)].map((_, i) => (
                        <span key={i}>{i < Math.round(averageRating) ? '⭐' : '☆'}</span>
                      ))}
                      <span className='ml-2'>({averageRating.toFixed(1)})</span>
                    </div>
                    <p>{totalRatings} calificaciones</p>
                  </div>
                )}
              </div>

              <div className='border-Black mt-5'>
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
                      {/* Agrega más SVG o íconos personalizados si lo deseas */}
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
        <div className='max-w-6xl mx-auto mt-10 px-4 '>
          

          {/* Preguntas y respuestas */}
          <div className='mt-16 bg-gray-900 rounded-lg p-8'>
            <h2 className="text-2xl font-bold mb-6 text-gold-500">Preguntas y respuestas</h2>
            
            {/* Preguntas aprobadas */}
            {approvedQuestions.length > 0 && (
              <div className="space-y-6 mb-8">
                {approvedQuestions.map((item, index) => (
                  <div key={index} className="bg-gray-800 p-5 rounded-lg">
                    <div className="flex items-start gap-4">
                      <div className="bg-gold-500 text-black p-2 rounded-full flex-shrink-0">
                        <span>❓</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-100">{item.question}</p>
                        <div className="flex items-start mt-4 gap-4">
                          <div className="bg-gray-700 text-gold-500 p-2 rounded-full flex-shrink-0">
                            <span>💬</span>
                          </div>
                          <p className="text-gray-300">{item.answer}</p>
                        </div>
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

            {preguntas.length === 0 && approvedQuestions.length === 0 && (
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