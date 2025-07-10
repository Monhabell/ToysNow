'use client'
import { useCart } from '@/context/CartContext'
import Navbar from '@/components/Navbar'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';



export default function CarritoPage() {
  const { data: session,  } = useSession()
    const router = useRouter();

  const { carrito, eliminarProducto, aumentarCantidad, disminuirCantidad, calcularSubtotal, calcularEnvioTotal, calcularTotalFinal} = useCart()

  console.log(carrito)

  const handleComprarAhora = () => {
    if (carrito.length === 0) return;

    // Crear array de productos para el checkout
    const productsToCheckout = carrito.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      compare_price: item.compare_price || null,
      quantity: item.cantidad,
      image: item.image[0] || '/images/default.png',
      variant: item.variant?.id ? {
        id: item.variant.id,
        attributes: item.variant.attributes?.map(attr => ({
          name: attr.name,
          value: attr.value
        })) || []
      } : null,
      stock: item.stock,
      shipment: item.shipment || 0
    }));

    // Calcular totales
    const subtotal = calcularSubtotal();
    const shipping = calcularEnvioTotal();
    const total = calcularTotalFinal();

    // Guardar en sessionStorage para el checkout
    sessionStorage.setItem('currentOrder', JSON.stringify({
      items: productsToCheckout,
      subtotal,
      shipping,
      total
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


  return (
    <>
      <Navbar />
      <div className="p-6  min-h-screen mt-32 text-gray-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Columna de Productos */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-lg">
              <h2 className="text-xl font-semibold flex items-center gap-3 text-gold-500">
                <span className="text-2xl">🛒</span> 
                <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                  Tu Carrito de Compras
                </span>
              </h2>

              <div className="divide-y divide-gray-800 mt-4">
                {carrito.map((item) => (
                  <div key={`${item.id}-${item.variant?.id || '0'}`} className="flex justify-between items-center py-6 group hover:bg-gray-800/50 transition-all duration-300 px-2 rounded-lg">
                    <div className="flex items-center gap-5">
                      <div className="relative">
                        <Image 
                          src={item.image[0]} 
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;  
                            target.onerror = null;
                            target.src = '/images/default.webp';
                          }}
                          alt={item.name} 
                          className="w-20 h-20 object-cover rounded-lg border-2 border-gray-700 group-hover:border-yellow-500 transition-all" 
                        />
                        <span className="absolute -top-2 -right-2 bg-yellow-500 text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                          {item.cantidad}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-100 group-hover:text-yellow-400 transition-colors">{item.name}</p>
                        {item.variant.id &&(
                          <p className="text-sm text-gray-400 mt-1">
                            Detalle: <span className="text-yellow-400">{item.variant.attributes[0].name}  {item.variant.attributes[0].value}</span>
                          </p>
                        )}
                        {item.color && (
                          <p className="text-sm text-gray-400 mt-1">
                            Color: <span className="text-yellow-400">{item.color}</span>
                          </p>
                        )}
                        <div className="flex gap-4 mt-3 text-sm">
                          <button 
                            onClick={() => eliminarProducto(item.id)} 
                            className="text-gray-400 hover:text-yellow-500 transition-colors"
                          >
                            Eliminar
                          </button>
                          <button className="text-gray-400 hover:text-yellow-500 transition-colors">
                            Guardar para después
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center justify-end gap-3 mb-3">
                        <button 
                          onClick={() => disminuirCantidad(item.id)} 
                          className={`border border-gray-700 px-2.5 py-0.5 rounded-lg ${item.cantidad <= 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-yellow-500/10 hover:border-yellow-500/50'}`}
                          disabled={item.cantidad <= 1}
                        >
                          <span className="text-gray-300">−</span>
                        </button>

                        <span className="w-8 text-center text-gray-100">{item.cantidad}</span>

                        <button 
                          onClick={() => aumentarCantidad(item.id)} 
                          className={`border border-gray-700 px-2.5 py-0.5 rounded-lg ${item.cantidad >= item.stock ? 'opacity-50 cursor-not-allowed' : 'hover:bg-yellow-500/10 hover:border-yellow-500/50'}`}
                          disabled={item.cantidad >= item.stock}
                        >
                          <span className="text-gray-300">+</span>
                        </button>
                      </div>

                      <div>
                        {item.compare_price && (
                          <div className="text-yellow-500 text-xs mb-1">
                            <span className="line-through text-gray-500 mr-1">${item.compare_price}</span>
                            <span className="font-bold">-{Math.round((1 - item.price / item.compare_price) * 100)}%</span>
                          </div>
                        )}
                        <p className="text-xl font-bold text-yellow-400">
                          ${(Number(item.price) * item.cantidad).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Sección de Envío */}
              <div className="pt-6 mt-6 border-t border-gray-800">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 font-medium">Envío</span>
                  
                  <span className={`text-lg font-medium ${calcularEnvioTotal() === 0 ? 'text-yellow-400' : 'text-gray-300'}`}>
                    {calcularEnvioTotal() === 0 ? '¡Gratis!' : `$${calcularEnvioTotal().toLocaleString()}`}
                  </span>
                </div>
                  
                <div className="w-full bg-gray-800 h-2.5 rounded-full mt-3">
                  <div 
                    className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-2.5 rounded-full" 
                    style={{ width: '70%' }}
                  ></div>
                </div>
                <p className="text-sm text-gray-400 mt-3">
                  Agrega más productos para obtener envío gratis
                  <Link href="#" className="text-yellow-400 hover:text-yellow-300 ml-2 transition-colors">
                    Ver productos premium ›
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Columna Resumen */}
          <div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-lg sticky top-32">
              <h3 className="font-bold text-xl mb-6 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                Resumen del Pedido
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between text-gray-300">
                  <span>Productos ({carrito.reduce((acc, i) => acc + i.cantidad, 0)})</span>
                  <span>${calcularSubtotal().toLocaleString()}</span>
                </div>


                <div className="pt-4 border-t border-gray-800">
                  <button className="text-yellow-400 hover:text-yellow-300 text-sm underline flex items-center transition-colors">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.121 15.536c-1.171 1.952-3.07 1.952-4.242 0-1.172-1.953-1.172-5.119 0-7.072 1.171-1.952 3.07-1.952 4.242 0"/>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
                    </svg>
                    Aplicar código de descuento
                  </button>
                </div>
              </div>

              <div className="flex justify-between text-2xl font-bold mt-8 pt-6 border-t border-gray-800">
                <span className="text-gray-300">Total</span>
                <span className="text-yellow-400">${calcularTotalFinal().toLocaleString()}</span>
              </div>

              <button
                onClick={handleComprarAhora}
               className="w-full bg-gradient-to-r from-yellow-600 to-yellow-700 text-black font-bold py-4 rounded-xl mt-8 hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 shadow-lg shadow-yellow-500/10 hover:shadow-yellow-500/20 flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                </svg>
                Finalizar Compra
              </button>

              
            </div>
          </div>
        </div>
      </div>
    </>
  )
}