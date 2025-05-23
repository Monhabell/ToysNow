'use client'

import { useEffect, useState, use } from 'react';
import { useCart } from '@/context/CartContext';
import { CiHeart } from "react-icons/ci";
import ListaProductos from '@/components/productos/ListaProductos';
import Navbar from "@/components/Navbar";
import { GoChevronRight, GoChevronLeft } from "react-icons/go";
import React from 'react';
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
  const unwrappedParams = use(params);
  const { id } = unwrappedParams;

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
                          className={`px-3 py-1 border rounded ${selectedVariant?.size === size ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
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

                <button className="btnsed">Comprar ahora</button>

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

                {producto.description && (
                  <div className='mt-5'>
                    <p className='font-medium'>Descripción:</p>
                    <p>{producto.description}</p>
                  </div>
                )}

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
                    <span>💳</span> ¡Paga en hasta 6 cuotas con 0% interés!
                  </div>

                  <div className="seccion">
                    <strong>Tarjetas de crédito</strong>
                    <div className="iconos">
                      <img src="" alt="" />
                      <img src="visa.png" alt="Visa"/>
                      <img src="mastercard.png" alt="Mastercard"/>
                      <img src="amex.png" alt="American Express"/>
                      <img src="codensa.png" alt="Codensa"/>
                    </div>
                  </div>

                  <div className="seccion">
                    <strong>Tarjetas de débito</strong>
                    <div className="iconos">
                      <img src="visa.png" alt="Visa Débito"/>
                      <img src="mastercard.png" alt="Mastercard Débito"/>
                    </div>
                  </div>

                  <div className="seccion">
                    <strong>Efectivo</strong>
                    <div className="iconos">
                      <img src="efecty.png" alt="Efecty"/>
                    </div>
                  </div>

                  <a href="#" className="enlace">Conoce otros medios de pago</a>
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
        <div className='max-w-6xl mx-auto mt-10 content'>
          <h2 className="text-xl font-bold">Preguntas y respuestas</h2>
          
          {/* Approved questions from the product */}
          {approvedQuestions.length > 0 && (
            <ul className="space-y-4 mb-6">
              {approvedQuestions.map((item, index) => (
                <li key={index} className="border p-3 rounded">
                  <p className="font-semibold">❓ {item.question}</p>
                  <p className="text-green-700">💬 {item.answer}</p>
                </li>
              ))}
            </ul>
          )}
          
          {/* User questions */}
          <div className="mb-4">
            <input
              type="text"
              className="border p-2 w-full rounded"
              placeholder="Escribe tu pregunta aquí..."
              value={nuevaPregunta}
              onChange={(e) => setNuevaPregunta(e.target.value)}
            />
            <button
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={enviarPregunta}
            >
              Enviar pregunta
            </button>
          </div>

          {preguntas.length > 0 ? (
            <ul className="space-y-4">
              {preguntas.map((item, index) => (
                <li key={index} className="border p-3 rounded">
                  <p className="font-semibold">❓ {item.pregunta}</p>
                  <p className="text-green-700">💬 {item.respuesta}</p>
                </li>
              ))}
            </ul>
          ) : (
            approvedQuestions.length === 0 && <p>Aún no hay preguntas sobre este producto.</p>
          )}
        </div>
      </div>
    </>
  );
}