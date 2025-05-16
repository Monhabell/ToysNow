'use client'

import { useEffect, useState, use } from 'react';
import { useCart } from '@/context/CartContext';
import { CiHeart } from "react-icons/ci";
import ListaProductos from '@/components/productos/ListaProductos';
import Navbar from "@/components/Navbar";
import { GoChevronRight , GoChevronLeft } from "react-icons/go";
import React from 'react';
import '../../../styles/detalles.css';
import { div } from 'framer-motion/client';
import { Separator } from "@/components/ui/separator"


interface Feature {
  color?: {
    [key: string]: {
      price: number;
      images: string[];
    };
  };
  size?: {
    [key: string]: {
      price: number;
      images: string[];
    };
  };
}

interface Producto {
  id: number;
  name: string;
  price: number;
  description: string;
  compare_price: number;
  features: Feature[];  // <-- Cambiado a array de Feature
  img: string[];
  nuevo: number;
  stock: number;
  quialification: number;
  categories: string;
  is_feature: string[];
  created_at: string;
  shipment: string;
}

interface Props {
  params: {
    id: string;
    img: string;
    shipment?: string;
    [key: string]: any;
  };
}

export default function ProductoDetalle({ params }: Props) {
  // Unwrap the params promise first
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



  useEffect(() => {
    const obtenerProducto = async () => {
      try {
        const response = await fetch('/api/productos');
        const productos: Producto[] = await response.json();
        const encontrado = productos.find((prod) => prod.id.toString() === id);
        setProducto(encontrado || null);
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
          p.categories.some((cat) => producto.categories.includes(cat))
        );

        setRelaciones(relacionados);
      } catch (error) {
        console.error('Error al cargar productos relacionados:', error);
      }
    };

    obtenerRelacionados();
  }, [producto]);

  // Verificar si el slider necesita scroll
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

  const handleMouseMove = (e: any) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setPosicion({ x, y });
  };

  if (!producto) {
    return <div>Cargando...</div>;
  }

  // Eslider de botones 

  const scrollLeft = () => {
    const slider = document.getElementById('slider');
    slider?.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollRight = () => {
    const slider = document.getElementById('slider');
    slider?.scrollBy({ left: 500, behavior: 'smooth' });
  };

  //  Seccion de preguntas y respuestas 

  const enviarPregunta = () => {
    if (nuevaPregunta.trim() === '') return;
  
    // Simulando una respuesta automática
    const nueva = {
      pregunta: nuevaPregunta,
      respuesta: "¡Gracias por tu pregunta! Pronto alguien del equipo te responderá."
    };
  
    setPreguntas([...preguntas, nueva]);
    setNuevaPregunta('');
  };
  
  const fechaCreacion = new Date(producto.created_at);
  const hoy = new Date();
  const diffDias = Math.ceil((hoy.getTime() - fechaCreacion.getTime()) / (1000 * 60 * 60 * 24));
  const nuevoOk = diffDias <= 30; // producto es nuevo si se creó hace menos de 30 días.

  const textoNuevo = (nuevoOk === true ? 'Nuevo' : '') + ' | +5 vendidos';
  const valor =  producto.price - producto.compare_price ;
  const star = producto.quialification;

  const descuento = Math.round((producto.compare_price / producto.price) * 100);

  const colores = producto.features && producto.features.length > 0 && producto.features[0].color
  ? Object.keys(producto.features[0].color)
  : [];

  const sizeProduct = producto.features && producto.features.length > 0 && producto.features[0].size
  ? Object.keys(producto.features[0].size)
  : [];

  const detalles = producto.description

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
                onClick={() => setImgSeleccionada(index)} // cuando hacen click
              />
            ))}

            </div>
            <div className="imgProduct itemImg" onMouseMove={handleMouseMove}>
              <img 
                src={producto.img[imgSeleccionada]} 

                style={{
                  transformOrigin: `${posicion.x}% ${posicion.y}%`
                }}
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

                <p className='valorPresio'>$ {valor.toLocaleString('en-CO', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</p>
                
                {descuento > 0 && (
                  <p>{descuento}% OFF</p>
                )}
                
                <p>Existencias: {producto.stock}</p>

                <button className="btnsed">Comprar ahora</button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    agregarProducto(producto);
                  }}
                  className="btnsed"
                >
                  🛒 Agregar al carrito
                </button>

                {producto.is_feature && producto.is_feature.length > 0 && (
                  <>
                    <p className='mt-5 mb-3'>Lo que tienes que saber de este producto</p>
                    <ul className=' mb-5'>
                      {producto.is_feature.map((detalle, index) => (
                        <li key={index}>{detalle}</li>
                      ))}
                    </ul>
                  </>
                )}

                {colores.length > 0 && (
                  <div className='mt-5'>
                    <h3>Colores Disponibles</h3>
                    {colores.map((col, index) => (
                    <div 
                      key={index} 
                      className={`color-option mt-5 `}
                      // onClick={() => handleColorSelect(index)}
                    >
                      <div 
                        className="color-swatch" 
                        style={{ 
                          backgroundColor: col,
                          
                        }}
                      >
                      </div>
                    </div>
                  
                ))}
                  </div>
                )}

               

                { star != null && (
                  <div>
                    {Array(star).fill(0).map((_, index) => (
                      <span key={index}>⭐</span>
                    ))}
                    <p>Calificación: {star === null ? 0 : star} </p>
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
                {detalles && detalles.length > 0 && (
                  <div className='text-sm'>
                    <p>{detalles}</p>
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

        <div className='max-w-6xl mx-auto mt-10 content'>
          <h2 className="text-xl font-bold">Preguntas y respuestas</h2>
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
            <p>Aún no hay preguntas sobre este producto.</p>
          )}
        </div>


        {/* <div className='max-w-6xl mx-auto mt-10'>
          <h2 className="text-xl font-bold">Opiniones del producto</h2>
          <p>Opiniones de clientes sobre este producto...</p>
        </div> */}
      </div>
    </>
  );
}
