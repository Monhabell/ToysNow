'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from "@/components/Navbar";
import '../../styles/checkout.css';
import { useSession, signOut } from 'next-auth/react'

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  selectedVariant?: any;
}

interface Order {
  items: OrderItem[];
  total: number;
  shipping: number;
}

interface DeliveryInfo {
  address: string;
  apartment: string;
  city: string;
  province: string;
  postalCode: string;
  phone: string;
  deliveryType: 'casa' | 'oficina' | 'otro';
  deliveryNotes: string;
}

const CheckoutForm = () => {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo>({
    address: '',
    apartment: '',
    city: '',
    province: '',
    postalCode: '',
    phone: '',
    deliveryType: 'casa',
    deliveryNotes: ''
  });
  const [editAddress, setEditAddress] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    const orderData = sessionStorage.getItem('currentOrder');
    if (!orderData) {
      router.push('/');
      return;
    }
    setOrder(JSON.parse(orderData));

    // Cargar datos de envío si existen
    const savedDeliveryInfo = localStorage.getItem('deliveryInfo');
    if (savedDeliveryInfo) {
      setDeliveryInfo(JSON.parse(savedDeliveryInfo));
    }
  }, [router]);

  useEffect(() => {
    if (preferenceId) {
      window.location.href = `https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=${preferenceId}`;
    }
  }, [preferenceId]);

  const handleDeliveryInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDeliveryInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const saveDeliveryInfo = () => {
    localStorage.setItem('deliveryInfo', JSON.stringify(deliveryInfo));
    setEditAddress(false);
  };

  const handleBuyNow = async () => {
    setLoading(true);
    try {
      if (!order || order.items.length === 0) {
        throw new Error('No hay items en el pedido');
      }

      // Validar información de envío
      if (!deliveryInfo.address || !deliveryInfo.city || !deliveryInfo.phone) {
        throw new Error('Por favor complete toda la información de envío');
      }

      const items = order.items.map(item => ({
        title: `${item.name}${item.selectedVariant?.color ? ` - Color: ${item.selectedVariant.color}` : ''}${item.selectedVariant?.size ? ` - Tamaño: ${item.selectedVariant.size}` : ''}`,
        unit_price: item.price,
        quantity: item.quantity,
        description: `este producto es malo no retarda`,
        id_user: session?.userId,
        email: session?.user?.email,
        delivery_info: deliveryInfo
      }));

      const res = await fetch('/api/create-preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: items[0].title + " " + items[0].description,
          unit_price: items[0].unit_price,
          quantity: items[0].quantity,
          id_user: session?.userId,
          email: session?.user?.email,
          delivery_info: deliveryInfo
        }),
      });

      const data = await res.json();
      console.log("datos")
      console.log(data)
      console.log("...")


      if (res.ok) {
        window.open(data.init_point, '_blank');
        console.log(data.orderId)

        let tries = 0;
        const maxTries = 10; // hasta 10 veces (5 minutos si el intervalo es de 30s)

        const interval = setInterval(async () => {
          tries++;

          const resStatus = await fetch('/api/get-order-status', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ orderId: data.orderId }) // asegúrate de retornar `orderId` desde create-preference
          });

          const statusData = await resStatus.json();
          console.log('🔄 Estado de la orden:', statusData.status);

          if (statusData.status === 'approved') {
            clearInterval(interval);
            alert('✅ ¡Pago realizado con éxito!');
            // puedes redirigir a otra página o mostrar un mensaje
          }

          if (tries >= maxTries) {
            clearInterval(interval);
            console.warn('⏱ Tiempo de espera agotado');
          }
        }, 30000); 
      } else {
        console.error('Error al crear la preferencia de pago:', data);
        setError('Error al crear la preferencia de pago. Inténtalo de nuevo más tarde.');
      }
    } catch (error) {
      console.error('Error al crear la preferencia de pago:', error);
      setError(
        error instanceof Error
          ? error.message
          : 'Error al crear la preferencia de pago. Inténtalo de nuevo más tarde.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (!order) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white">
      <Navbar />

      <div className="container mx-auto py-8 px-4 mt-32">
        <h1 className="text-3xl font-bold mb-8 text-gold-500 text-center ">Finalizar compra</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sección izquierda - Información de envío */}
          <div className="lg:w-2/3">
            <div className="bg-gray-900 rounded-lg p-6 mb-6 border border-vinotinto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gold-500">1. Dirección de entrega</h2>
                {!editAddress ? (
                  <button
                    onClick={() => setEditAddress(true)}
                    className="text-gold-500 hover:text-gold-300 text-sm font-medium"
                  >
                    Modificar
                  </button>
                ) : null}
              </div>

              {editAddress ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Dirección</label>
                      <input
                        type="text"
                        name="address"
                        value={deliveryInfo.address}
                        onChange={handleDeliveryInfoChange}
                        className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                        placeholder="Calle y número"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Departamento/Piso</label>
                      <input
                        type="text"
                        name="apartment"
                        value={deliveryInfo.apartment}
                        onChange={handleDeliveryInfoChange}
                        className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                        placeholder="Opcional"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Ciudad</label>
                      <input
                        type="text"
                        name="city"
                        value={deliveryInfo.city}
                        onChange={handleDeliveryInfoChange}
                        className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Provincia</label>
                      <input
                        type="text"
                        name="province"
                        value={deliveryInfo.province}
                        onChange={handleDeliveryInfoChange}
                        className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Código Postal</label>
                      <input
                        type="text"
                        name="postalCode"
                        value={deliveryInfo.postalCode}
                        onChange={handleDeliveryInfoChange}
                        className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Teléfono</label>
                    <input
                      type="tel"
                      name="phone"
                      value={deliveryInfo.phone}
                      onChange={handleDeliveryInfoChange}
                      className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                      placeholder="Ej: 11 1234-5678"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Tipo de entrega</label>
                    <select
                      name="deliveryType"
                      value={deliveryInfo.deliveryType}
                      onChange={handleDeliveryInfoChange}
                      className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                    >
                      <option value="casa">Casa</option>
                      <option value="oficina">Oficina</option>
                      <option value="otro">Otro</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Indicaciones adicionales</label>
                    <textarea
                      name="deliveryNotes"
                      value={deliveryInfo.deliveryNotes}
                      onChange={handleDeliveryInfoChange}
                      className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                      placeholder="Ej: Timbre roto, dejar con portero, etc."
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={saveDeliveryInfo}
                      className="bg-gold-500 hover:bg-gold-600 text-black font-bold py-2 px-6 rounded"
                    >
                      Guardar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-gray-300">
                  <p className="font-medium">{deliveryInfo.address || 'No especificada'}</p>
                  {deliveryInfo.apartment && <p>Departamento: {deliveryInfo.apartment}</p>}
                  <p>{deliveryInfo.city}, {deliveryInfo.province} {deliveryInfo.postalCode}</p>
                  <p>Teléfono: {deliveryInfo.phone || 'No especificado'}</p>
                  <p>Recibir en: {deliveryInfo.deliveryType === 'casa' ? 'Casa' : deliveryInfo.deliveryType === 'oficina' ? 'Oficina' : 'Otro'}</p>
                  {deliveryInfo.deliveryNotes && <p className="mt-2 italic">Notas: {deliveryInfo.deliveryNotes}</p>}
                </div>
              )}
            </div>

            <div className="bg-gray-900 rounded-lg p-6 border border-vinotinto">
              <h2 className="text-xl font-bold text-gold-500 mb-4">2. Método de pago</h2>

              <div className="space-y-4">
                <div className="flex items-center p-4 border border-gray-700 rounded-lg hover:border-gold-500 cursor-pointer">
                  <input
                    type="radio"
                    id="mercadoPago"
                    name="paymentMethod"
                    className="h-5 w-5 text-gold-500 focus:ring-gold-500"
                    defaultChecked
                  />
                  <label htmlFor="mercadoPago" className="ml-3 flex items-center">
                    <img
                      src="https://http2.mlstatic.com/frontend-assets/ui-navigation/5.18.9/mercadopago/logo__small@2x.png"
                      alt="Mercado Pago"
                      className="h-8 ml-2"
                    />
                    <span className="ml-2 text-gray-300">Paga con Mercado Pago</span>
                  </label>
                </div>

                <div className="flex items-center p-4 border border-gray-700 rounded-lg hover:border-gold-500 cursor-pointer">
                  <input
                    type="radio"
                    id="cashOnDelivery"
                    name="paymentMethod"
                    className="h-5 w-5 text-gold-500 focus:ring-gold-500"
                  />
                  <label htmlFor="cashOnDelivery" className="ml-3 flex items-center">
                    <svg className="h-6 w-6 text-gold-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="ml-2 text-gray-300">Pago contra entrega</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Sección derecha - Resumen de compra */}
          <div className="lg:w-1/3">
            <div className="bg-gray-900 rounded-lg p-6 border border-vinotinto sticky top-4">
              <h2 className="text-xl font-bold text-gold-500 mb-4">Resumen de tu compra</h2>

              <div className="space-y-3 mb-6">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between py-2 border-b border-gray-700">
                    <div className="flex items-center">
                      <span className="text-gray-300">
                        {item.name}
                        {item.selectedVariant?.color && <span className="text-gold-300"> - {item.selectedVariant.color}</span>}
                        {item.selectedVariant?.size && <span className="text-gold-600"> - {item.selectedVariant.size}</span>}
                      </span>
                      <span className="text-gray-500 text-sm ml-2">x{item.quantity}</span>
                    </div>
                    <span className="text-white">
                      ${(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal</span>
                  <span>${order.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Envío</span>
                  <span>${order.shipping.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gold-500 pt-2 mt-2 border-t border-gray-700">
                  <span>Total</span>
                  <span>${(order.total + order.shipping).toLocaleString()}</span>
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-900 text-white rounded-md text-center">
                  {error}
                </div>
              )}

              <button
                onClick={handleBuyNow}
                disabled={loading}
                className="w-full bg-gold-500 hover:bg-gold-600 text-black font-bold py-3 px-4 rounded-lg flex justify-center items-center cursor-pointer"
              >
                {loading ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/20000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : null}
                {loading ? 'Procesando...' : 'Finalizar compra'}
              </button>

              <div className="mt-4 text-center text-xs text-gray-500">
                <p>Al hacer clic en "Finalizar compra", aceptas nuestros Términos y Condiciones</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;