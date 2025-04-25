'use client'
import { useCart } from '@/context/CartContext'
import Navbar from '@/components/Navbar'

export default function CarritoPage() {
  const { carrito, eliminarProducto, aumentarCantidad, disminuirCantidad, calcularSubtotal, calcularEnvioTotal, calcularTotalFinal } = useCart()

  return (
    <>
      <Navbar />
      <div className="p-6 bg-gray-100 min-h-screen">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Columna de Productos */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-lg shadow-sm p-4 border">
              <h2 className="text-lg font-semibold flex items-center gap-2 text-green-600">
                <span className="text-2xl">⚡</span> Productos
              </h2>

              <div className="divide-y">
                {carrito.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-4">
                    <div className="flex items-center gap-4">
                      <img src={item.img[0]} alt={item.name} className="w-16 h-16 object-cover rounded-md border" />
                      <div>
                        <p className="font-medium text-gray-800">{item.name}</p>
                        {item.color && <p className="text-sm text-gray-500">Color: {item.color}</p>}
                        <div className="flex gap-3 mt-2 text-sm text-blue-600">
                          <button onClick={() => eliminarProducto(item.id)}>Eliminar</button>
                          <span>|</span>
                          <button>Guardar</button>
                          <span>|</span>
                          <button>Modificar</button>
                          <span>|</span>
                          <button>Comprar ahora</button>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center justify-end gap-2 mb-2">
                        <button 
                          onClick={() => disminuirCantidad(item.id)} 
                          className="border px-2 rounded"
                          disabled={item.cantidad <= 1}
                        >-</button>

                        <span className="w-6 text-center">{item.cantidad}</span>

                        <button 
                          onClick={() => aumentarCantidad(item.id)} 
                          className="border px-2 rounded"
                          disabled={item.cantidad >= item.stock}
                        >+</button>
                      </div>

                      <div>
                        {item.compare_price && (
                          <div className="text-green-600 text-xs mb-1">
                            -{(item.price / item.compare_price)*100 }% <span className="line-through text-gray-400">${item.compare_price}</span>
                          </div>
                        )}
                        <p className="text-lg font-semibold text-gray-800">
                          ${(Number(item.price) * item.cantidad).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Envío Gratis Sección */}
              <div className="pt-4 mt-4 border-t">
                <div className="flex justify-between items-center text-green-600 font-medium">
                  <span>Envío</span>
      
                  {calcularEnvioTotal() === 0 && (
                    <span>Gratis</span>
                  )}

                  {calcularEnvioTotal() !== 0 && (
                    <span>${calcularEnvioTotal().toLocaleString()}</span>
                  )}
                </div>
                  
                <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '70%' }}></div>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Aprovecha tu envío Gratis agregando más productos 
                  <a href="#" className="text-blue-600 ml-1">Ver más productos Full ›</a>
                </p>
              </div>
            </div>
          </div>

          {/* Columna Resumen */}
          <div>
            <div className="bg-white border rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-lg text-gray-800 mb-4">Resumen de compra</h3>

              <div className="flex justify-between text-gray-700 mb-2">
                <span>Productos ({carrito.reduce((acc, i) => acc + i.cantidad, 0)})</span>
                <span>${calcularSubtotal().toLocaleString()}</span>
              </div>

              <div className="flex justify-between text-gray-700 mb-4">
                <span>Envío</span>
                <span>${calcularEnvioTotal().toLocaleString()}</span>
              </div>

              <button className="text-blue-600 text-sm underline mb-4">Ingresar código de cupón</button>

              <div className="flex justify-between text-xl font-bold text-gray-800 border-t pt-4">
                <span>Total</span>
                <span>${calcularTotalFinal().toLocaleString()}</span>
              </div>

              <button className="w-full bg-blue-600 text-white py-3 rounded-lg mt-6 hover:bg-blue-700 transition">
                Continuar compra
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}
