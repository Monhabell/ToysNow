'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from "@/components/Navbar";

import { useSession } from 'next-auth/react';
import { FaTrash, FaPlus, FaMinus, FaShoppingCart } from "react-icons/fa";
import Image from 'next/image';

interface ProductAttribute {
  name: string;
  value: string;
}

interface ProductVariant {
  id?: number;
  attributes?: ProductAttribute[];
}

interface CartItem {
  id: number;
  name: string;
  price: number;
  compare_price?: number;
  color?: string;
  image: string;
  stock?: number;
  shipment?: number;
  cantidad: number;
  variant?: ProductVariant;
}

const CartPage = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [error, setError] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [shippingCost, setShippingCost] = useState(0);
  const [selectedCity, setSelectedCity] = useState('');

  // Cargar items del carrito desde localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Guardar carrito cuando cambia
  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    } else {
      localStorage.removeItem('cart');
    }
  }, [cartItems]);

  // Calcular subtotal
  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.cantidad), 0);
  };

  // Calcular total con descuentos y envío
  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discountedSubtotal = subtotal * (1 - couponDiscount);
    return discountedSubtotal + shippingCost;
  };

  // Actualizar cantidad de un item
  const updateQuantity = (index: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    setCartItems(prev => {
      const updatedItems = [...prev];
      updatedItems[index] = {
        ...updatedItems[index],
        cantidad: newQuantity
      };
      return updatedItems;
    });
  };

  // Eliminar item del carrito
  const removeItem = (index: number) => {
    setCartItems(prev => prev.filter((_, i) => i !== index));
  };

  // Aplicar cupón de descuento
  const applyCoupon = () => {
    if (!couponCode.trim()) return;
    
    // Ejemplo de lógica de cupón (puedes adaptarla a tu backend)
    const discount = couponCode.toUpperCase() === 'DESCUENTO10' ? 0.10 : 0;
    setCouponDiscount(discount);

    if (discount === 0) {
      setError('Cupón no válido o expirado');
    } else {
      setError('');
    }
  };

  // Calcular costo de envío basado en ciudad
  const calculateShipping = (city: string) => {
    const shippingRates: Record<string, number> = {
      'Bogotá': 15500,
      'Soacha': 20000,
      'Medellín': 25000,
      'Cali': 25000,
      // Agrega más ciudades según necesites
    };

    setShippingCost(shippingRates[city] || 20000); // Costo por defecto
    setSelectedCity(city);
  };

  // Proceder al checkout
  const proceedToCheckout = () => {

    if (!session) {
      router.push('/login');
      return;
    }

    if (cartItems.length === 0) {
      setError('No hay productos en el carrito');
      return;
    }

    // Preparar los datos para el checkout
    const orderItems = cartItems.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.cantidad,
      variant: item.variant
    }));

    const order = {
      items: orderItems,
      total: calculateSubtotal(),
      shipping: shippingCost
    };

    sessionStorage.setItem('currentOrder', JSON.stringify(order));
    router.push('/checkout');
  };

  // Carrito vacío
  if (cartItems.length === 0) {
    return (
      <div className="bg-black min-h-screen text-white">
        <Navbar />
        <div className="container mx-auto py-16 px-4 text-center mt-60">
          <div className="max-w-md mx-auto">
            <FaShoppingCart className="mx-auto text-6xl text-gold-600 mb-6" />
            <h2 className="text-2xl font-bold text-gray-300 mb-4">Tu carrito está vacío</h2>
            <p className="text-gray-500 mb-8">Agrega productos para continuar con tu compra</p>
            <button
              onClick={() => router.push('/productos')}
              className="bg-gray-600 hover:bg-white hover:text-red text-gold-600 font-bold py-3 px-6 rounded-lg cursor-pointer"
            >
              Seguir comprando
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white">
      <Navbar />
      <div className="container mx-auto py-8 px-4 mt-32 xs:mt-32">
        <h1 className="text-3xl font-bold mb-8 text-gold-500 text-center">Tu Carrito</h1>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Lista de productos */}
          <div className="lg:w-2/3">
            <div className="bg-gray-900 rounded-lg p-6 mb-6 border border-gray-700">
              <h2 className="text-xl font-bold text-gold-500 mb-6">Productos ({cartItems.length})</h2>
              
              <div className="space-y-6">
                {cartItems.map((item, index) => (
                  <div key={index} className="flex flex-col sm:flex-row gap-4 py-4 border-b border-gray-700">
                    <div className="sm:w-1/4">
                      <Image
                        src={`https://www.softgenix.space/storage/tenants/2b85d6a6-1059-4929-a8bb-5f3d7ca5c732/images${item.image}`}
                        alt={item.name}
                        width={200}
                        height={200}
                        className="rounded-lg object-cover"
                      />
                    </div>
                    
                    <div className="sm:w-3/4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-medium text-white">{item.name}</h3>
                          {item.color && (
                            <p className="text-gray-400 text-sm">Color: {item.color}</p>
                          )}
                          {item.variant?.attributes?.map((attr, idx) => (
                            <p key={idx} className="text-gray-400 text-sm">
                              {attr.name}: {attr.value}
                            </p>
                          ))}
                          {item.compare_price && item.compare_price > 0 && (
                            <div className="mt-1">
                              <span className="text-gray-500 line-through mr-2">
                                ${item.compare_price.toLocaleString()}
                              </span>
                              <span className="text-green-500">
                                {Math.round((1 - item.price / item.compare_price) * 100)}% OFF
                              </span>
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => removeItem(index)}
                          className="text-gray-500 hover:text-red-500 cursor-pointer"
                        >
                          <FaTrash />
                        </button>
                      </div>

                      <div className="mt-4 flex justify-between items-center">
                        <div className="flex items-center cursor-pointer">
                          <button
                            onClick={() => updateQuantity(index, item.cantidad - 1)}
                            className="bg-gray-700 cursor-pointer hover:bg-gray-600 text-white w-8 h-8 rounded-l flex items-center justify-center"
                            disabled={item.cantidad <= 1}
                          >
                            <FaMinus size={12} />
                          </button>
                          <span className="bg-gray-800 text-white w-10 h-8 flex items-center justify-center">
                            {item.cantidad}
                          </span>
                          <button
                            onClick={() => updateQuantity(index, item.cantidad + 1)}
                            className="bg-gray-700 cursor-pointer hover:bg-gray-600 text-white w-8 h-8 rounded-r flex items-center justify-center"
                            disabled={item.stock !== undefined && item.cantidad >= item.stock}
                          >
                            <FaPlus size={12} />
                          </button>
                        </div>
                        <span className="text-white font-medium">
                          ${(item.price * item.cantidad).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cupón y envío */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                <h3 className="text-lg font-bold text-gold-500 mb-4">Cupón de descuento</h3>
                <div className="flex">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Ingresa tu cupón"
                    className="flex-1 bg-gray-800 border border-gray-700 rounded-l px-3 py-2 text-white"
                  />
                  <button
                    onClick={applyCoupon}
                    className="bg-gold-500 hover:bg-gold-600 text-black font-bold py-2 px-4 rounded-r"
                  >
                    Aplicar
                  </button>
                </div>
                {couponDiscount > 0 && (
                  <p className="text-green-500 mt-2 text-sm">
                    Cupón aplicado: {couponDiscount * 100}% de descuento
                  </p>
                )}
              </div>

              <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                <h3 className="text-lg font-bold text-gold-500 mb-4">Calcular envío</h3>
                <div className="flex">
                  <select
                    value={selectedCity}
                    onChange={(e) => calculateShipping(e.target.value)}
                    className="flex-1 bg-gray-800 border border-gray-700 rounded-l px-3 py-2 text-white"
                  >
                    <option value="">Selecciona tu ciudad</option>
                    <option value="Bogotá">Bogotá</option>
                    <option value="Medellín">Medellín</option>
                    <option value="Cali">Cali</option>
                    <option value="Soacha">Soacha</option>
                  </select>
                  <button
                    className="bg-gray-700 text-white font-bold py-2 px-4 rounded-r cursor-default"
                    disabled
                  >
                    ${shippingCost.toLocaleString()}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Resumen del pedido */}
          <div className="lg:w-1/3">
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-700 sticky top-4">
              <h2 className="text-xl font-bold text-gold-500 mb-6">Resumen del pedido</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-300">Subtotal ({cartItems.reduce((sum, item) => sum + item.cantidad, 0)} productos)</span>
                  <span className="text-white">${calculateSubtotal().toLocaleString()}</span>
                </div>

                {couponDiscount > 0 && (
                  <div className="flex justify-between text-green-500">
                    <span>Descuento</span>
                    <span>-${(calculateSubtotal() * couponDiscount).toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-gray-300">Envío</span>
                  <span className="text-white">
                    {selectedCity ? `$${shippingCost.toLocaleString()}` : 'Selecciona ciudad'}
                  </span>
                </div>

                <div className="flex justify-between text-lg font-bold text-gold-500 pt-2 mt-2 border-t border-gray-700">
                  <span>Total</span>
                  <span>${calculateTotal().toLocaleString()}</span>
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-900 text-white rounded-md text-center">
                  {error}
                </div>
              )}

              <button
                onClick={proceedToCheckout}
                className="w-full bg-gold-500 hover:bg-gold-600 text-black font-bold py-3 px-4 rounded-lg"
              >
                Proceder al pago
              </button>

              <button
                onClick={() => router.push('/')}
                className="w-full mt-4 bg-transparent hover:bg-gray-800 text-gold-500 font-bold py-3 px-4 rounded-lg border border-gold-500"
              >
                Seguir comprando
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;