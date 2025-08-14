'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from "@/components/Navbar";
import '../../styles/checkout.css';
import { useSession } from 'next-auth/react';
import { FaCheckDouble } from "react-icons/fa";
import Image from 'next/image';

interface ProductVariant {
  id?: number;
  color?: string;
  size?: string;
  attributes?: Array<{
    name: string;
    value: string;
  }>;
}

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  variant?: ProductVariant;
  color?: string;
  compare_price?: number;
  image?: string;
}

interface Order {
  items: OrderItem[];
  total: number;
  shipping: number;
}

interface DeliveryInfo {
  address: string;
  department: string;
  city: string;
  province: string;
  postalCode: string;
  phone: string;
  deliveryType: 'casa' | 'oficina' | 'otro';
  deliveryNotes: string;
}

interface PreferenceId {
  init_point: string;
  orderId: string;
  token_id: string;
}


const CheckoutForm = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const token = session?.apiToken || '';

  // State management
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [preferenceId, setPreferenceId] = useState<PreferenceId | null>(null);
  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo>({
    address: '',
    department: '',
    city: '',
    province: '',
    postalCode: '',
    phone: '',
    deliveryType: 'casa',
    deliveryNotes: ''
  });
  const [editAddress, setEditAddress] = useState(false);
  const [deliveryMessage, setDeliveryMessage] = useState('');
  const [shippingCost, setShippingCost] = useState(0);
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);


  const colombiaData: Record<string, string[]> = {
    "Bogota": ["Bogotá"],
    "Antioquia": ["Medellín", "Envigado", "Bello", "Itagüí"],
    "Cundinamarca": ["Bogotá", "Soacha", "Zipaquirá", "Chía"],
    "Valle del Cauca": ["Cali", "Palmira", "Tuluá", "Buenaventura"],
    "Atlántico": ["Barranquilla", "Soledad", "Malambo"],
    "Bolívar": ["Cartagena", "Magangué", "Turbaco"],

    // Agrega más departamentos y ciudades según necesites
  };

  // Load order and delivery info from storage
  useEffect(() => {
    const orderData = sessionStorage.getItem('currentOrder');
    if (!orderData) {
      router.push('/');
      return;
    }

    const parsedOrder = JSON.parse(orderData);
    setOrder(parsedOrder);
    calculateDeliveryTime();

    const savedDeliveryInfo = localStorage.getItem('deliveryInfo');
    if (savedDeliveryInfo) {
      const parsedDeliveryInfo = JSON.parse(savedDeliveryInfo);
      setDeliveryInfo(parsedDeliveryInfo);
      calculateShippingCost(parsedDeliveryInfo.city);
    }
  }, [router]);

  // Handle preferenceId change to open MercadoPago payment
  useEffect(() => {
    if (preferenceId && preferenceId.init_point) {
      window.location.href = preferenceId.init_point;
    }
  }, [preferenceId]);

  // Calculate estimated delivery time
  const calculateDeliveryTime = () => {
    const currentTime = new Date();
    const hours = currentTime.getHours().toString().padStart(2, '0');
    const minutes = currentTime.getMinutes().toString().padStart(2, '0');
    const currentTimeString = `${hours}:${minutes}`;
    const cutoffTime = '11:00';

    setDeliveryMessage(
      currentTimeString > cutoffTime
        ? 'Tu pedido llega mañana'
        : 'Tu pedido llega hoy'
    );
  };

  // Calculate shipping cost based on city
  const calculateShippingCost = (city: string) => {
    const shippingRates: Record<string, number> = {
      'Bogotá': 15500,
      'Soacha': 20000,
      'Medellín': 25000,
      'Cali': 25000,
      // Add more cities as needed
    };

    setShippingCost(shippingRates[city] || 20000); // Default shipping cost
  };

  // Handle delivery info changes
  const handleDeliveryInfoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setDeliveryInfo(prev => ({ ...prev, [name]: value }));

    if (name === 'city') {
      calculateShippingCost(value);
    }
  };

  // Save delivery info to local storage
  const saveDeliveryInfo = () => {
    localStorage.setItem('deliveryInfo', JSON.stringify(deliveryInfo));
    setEditAddress(false);
  };

  // Update item quantity
  const updateQuantity = (index: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    setOrder(prev => {
      if (!prev) return null;

      const updatedItems = [...prev.items];
      updatedItems[index] = {
        ...updatedItems[index],
        quantity: newQuantity
      };

      const newTotal = updatedItems.reduce(
        (sum, item) => sum + (item.price * item.quantity), 0
      );

      // Update session storage
      const updatedOrder = {
        ...prev,
        items: updatedItems,
        total: newTotal
      };
      sessionStorage.setItem('currentOrder', JSON.stringify(updatedOrder));

      return updatedOrder;
    });
  };

  // Apply coupon code
  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    try {
      const discount = couponCode.toUpperCase() === 'DESCUENTO10' ? 0.50 : 0;
      setCouponDiscount(discount);

      if (discount === 0) {
        setError('Cupón no válido o expirado');
      }
    } catch (err) {
      setError('Error al validar el cupón' + err);
    }
  };

  // Process payment
  const handlePayment = async () => {
    setLoading(true);
    setError('');

    try {
      // Validaciones (se mantienen igual)
      if (!order || order.items.length === 0) {
        throw new Error('No hay items en el pedido');
      }

      if (!deliveryInfo.address || !deliveryInfo.city || !deliveryInfo.phone) {
        throw new Error('Por favor complete toda la información de envío');
      }

      const paymentMethod = document.querySelector<HTMLInputElement>(
        'input[name="paymentMethod"]:checked'
      )?.id;

      // Preparar items para MercadoPago
      const mercadoPagoItems = order.items.map(item => {
        console.log("Variant completo de:", item.name, JSON.stringify(item.variant, null, 2));

        return {
          title: `${item.name}${
            item.color && item.color !== 'N/A' ? ` - Color: ${item.color}` : ''
          }${
            item.variant?.attributes?.find(a => a.name.toLowerCase() === 'tamaño') 
              ? ` - Tamaño: ${item.variant.attributes.find(a => a.name.toLowerCase() === 'tamaño')?.value}`
              : ''
          }`,
          unit_price: item.price,
          quantity: item.quantity,
          picture_url: item.image || '/images/default.png',
          description: 'Producto de alta calidad',
          id: item.id.toString(),
          variant_id: item.variant?.id?.toString(),
          variant_attributes: item.variant

        };
      });

      
      // Lógica para pago contra entrega
      if (paymentMethod === 'cashOnDelivery') {
        const orderData = {
          items: order.items.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            variant: item.variant,
            color: item.color,
            compare_price: item.compare_price,
            image: item.image
          })),
          total: calculateTotal(),
          shipping: shippingCost,
          delivery_info: deliveryInfo,
          user: {
            email: session?.user?.email,
            userId: session?.userId,
            token: token,
          },
          coupon: couponDiscount > 0 ? couponCode : null,
          discount: couponDiscount
        };

        console.log("Datos de la orden:", JSON.stringify(orderData, null, 2));
        // Aquí deberías hacer una llamada a tu API para guardar la orden
        alert('Pedido registrado para entrega. Nos contactaremos contigo pronto.');
        return;
      }

      // Procesar pago con MercadoPago para múltiples productos
      const res = await fetch('/api/create-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: mercadoPagoItems,
          total: calculateTotal(),
          shipping_cost: shippingCost,
          delivery_info: deliveryInfo,
          user: {
            email: session?.user?.email,
            userId: session?.userId,
            token: token,
          },
          coupon: couponDiscount > 0 ? couponCode : null,
          discount: couponDiscount
        }),
      });
  
      const data = await res.json();
      
      if (data.init_point) {
        setPreferenceId(data);
      } else {
        throw new Error('No se pudo crear la preferencia de pago');
      }

    } catch (error) {
      console.error('Payment error:', error);
      setError(
        error instanceof Error
          ? error.message
          : 'Error al procesar el pago. Inténtalo de nuevo.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Calculate total with shipping and discounts
  const calculateTotal = () => {
    if (!order) return 0;

    console.log(order)

    const subtotal = order.items.reduce(
      (sum, item) => sum + (item.price * item.quantity), 0
    );

    const discountedSubtotal = subtotal * (1 - couponDiscount);
    return discountedSubtotal + shippingCost;
  };

  // Loading state
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

      <div className="container mx-auto py-8 px-4 mt-42 xs:mt-32">
        <h1 className="text-3xl font-bold mb-8 text-gold-500 text-center">Finalizar compra</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left section - Delivery info */}
          <div className="lg:w-2/3">
            <div className="bg-gray-900 rounded-lg p-6 mb-6 border border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gold-500">1. Dirección de entrega</h2>
                {!editAddress && (
                  <button
                    onClick={() => setEditAddress(true)}
                    className="text-gold-500 hover:text-gold-300 text-sm font-medium"
                  >
                    Modificar
                  </button>
                )}
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
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Departamento</label>
                      <select
                        name="department"
                        value={deliveryInfo.department}
                        onChange={handleDeliveryInfoChange}
                        className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                        required
                      >
                        <option value="">Selecciona un departamento</option>
                        {Object.keys(colombiaData).map(dep => (
                          <option key={dep} value={dep}>{dep}</option>
                        ))}
                      </select>
                    </div>

                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">


                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Ciudad</label>
                      <select
                        name="city"
                        value={deliveryInfo.city}
                        onChange={handleDeliveryInfoChange}
                        className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                        required
                        disabled={!deliveryInfo.department}
                      >
                        <option value="">Selecciona una ciudad</option>
                        {deliveryInfo.department &&
                          colombiaData[deliveryInfo.department].map(city => (
                            <option key={city} value={city}>{city}</option>
                          ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Barrio</label>
                      <input
                        type="text"
                        name="province"
                        value={deliveryInfo.province}
                        onChange={handleDeliveryInfoChange}
                        className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                      />
                    </div>

                    <div >
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
                      required
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
                  {deliveryInfo.department && <p>Departamento: {deliveryInfo.department}</p>}
                  <p>{deliveryInfo.city}, {deliveryInfo.province} {deliveryInfo.postalCode}</p>
                  <p>Teléfono: {deliveryInfo.phone || 'No especificado'}</p>
                  <p>Recibir en: {{
                    "casa": "Casa",
                    "oficina": "Oficina",
                    "otro": "Otro"
                  }[deliveryInfo.deliveryType]}</p>
                  {deliveryInfo.deliveryNotes && (
                    <p className="mt-2 italic">Notas: {deliveryInfo.deliveryNotes}</p>
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-col md:flex-row gap-6">
              {/* Order details */}
              <div className="fw-full md:w-1/2 bg-gray-900 rounded-lg p-6 mb-6  border border-gray-700 ">
               

                {deliveryMessage && (
                  <div className=" p-4 rounded-lg border-l-4 border-yellow-500 bg-gradient-to-r from-yellow-900 via-yellow-800 to-yellow-700 shadow-lg animate-fade-in">
                    <div className="flex items-center space-x-3">
                      <svg
                        className="w-6 h-6 text-yellow-300"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8 7V3M16 7V3M3 11h18M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <p className="text-yellow-100 font-semibold text-sm md:text-base">
                        {deliveryMessage}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Coupon section */}
              <div className="w-full md:w-1/2 bg-gray-900 rounded-lg p-6 mb-6  border border-gray-700 ">
                <h2 className="text-xl font-bold text-gold-500 mb-4">Cupón de descuento</h2>
                <div className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Ingresa tu cupón"
                    className="flex-1 bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                  />
                  <button
                    onClick={applyCoupon}
                    className="bg-gold-500 hover:bg-gold-600 text-black font-bold py-2 px-4 rounded"
                  >
                    <FaCheckDouble />
                  </button>
                </div>
                {couponDiscount > 0 && (
                  <p className="text-green-500 mt-2 text-sm">
                    Cupón aplicado: {couponDiscount * 100}% de descuento
                  </p>
                )}
              </div>
            </div>

            {/* Payment method */}
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-bold text-gold-500 mb-6">2. Método de pago</h2>

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
                    <Image
                      src="https://http2.mlstatic.com/frontend-assets/ui-navigation/5.18.9/mercadopago/logo__small@2x.png"
                      alt="Mercado Pago"
                      className="h-8 ml-2"
                      width={50}
                      height={32}
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

          {/* Right section - Order summary */}
          <div className="lg:w-1/3">
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-700 sticky top-4">
              <h2 className="text-xl font-bold text-gold-500 mb-4">Resumen de tu compra</h2>

              <div className="space-y-3 mb-6">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between py-2 border-b border-gray-700">
                    <div>
                      <span className="text-gray-300">
                        {item.name}
                        {item.variant?.attributes?.map((attr, idx) => (
                          <span key={idx} className="text-gray-400 ml-1">
                            {attr.name}: {attr.value}
                          </span>
                        ))}
                      </span>
                      <div className="flex items-center mt-2">
                        <button
                          onClick={() => updateQuantity(index, item.quantity - 1)}
                          className="bg-gray-700 hover:bg-gray-600 text-white w-8 h-8 rounded-l flex items-center justify-center"
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span className="bg-gray-800 text-white w-10 h-8 flex items-center justify-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(index, item.quantity + 1)}
                          className="bg-gray-700 hover:bg-gray-600 text-white w-8 h-8 rounded-r flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
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

                {couponDiscount > 0 && (
                  <div className="flex justify-between text-green-500">
                    <span>Descuento ({couponDiscount * 100}%)</span>
                    <span>-${(order.total * couponDiscount).toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-300">
                  <span>Envío</span>
                  <span>${shippingCost.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-lg font-bold text-gold-500 pt-2 mt-2 border-t border-gray-700">
                  <span>Total</span>
                  <span>${calculateTotal().toLocaleString('en-CO')}</span>
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-900 text-white rounded-md text-center">
                  {error}
                </div>
              )}

              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full bg-gold-500 hover:bg-gold-600 text-black font-bold py-3 px-4 rounded-lg flex justify-center items-center cursor-pointer disabled:opacity-70"
              >
                {loading && (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {loading ? 'Procesando...' : 'Finalizar compra'}
              </button>

              <div className="mt-4 text-center text-xs text-gray-500">
                <p>Al hacer clic en Finalizar compra, aceptas nuestros Términos y Condiciones</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;