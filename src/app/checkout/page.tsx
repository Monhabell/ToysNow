'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from "@/components/Navbar";
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';

initMercadoPago(process.env.NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY!);

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

const CheckoutForm = () => {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [preferenceId, setPreferenceId] = useState<string | null>(null);

  useEffect(() => {
    const orderData = sessionStorage.getItem('currentOrder');
    if (!orderData) {
      router.push('/');
      return;
    }
    setOrder(JSON.parse(orderData));
  }, [router]);

  const createPreference = async () => {
    setLoading(true);
    setError('');
    
    try {
      if (!order) return;

      // Transformar los items del carrito al formato que espera MercadoPago
      const items = order.items.map(item => ({
        title: `${item.name}${item.selectedVariant?.color ? ` - ${item.selectedVariant.color}` : ''}${item.selectedVariant?.size ? ` - ${item.selectedVariant.size}` : ''}`,
        unit_price: item.price,
        quantity: item.quantity,
      }));

      // Si hay costo de envío, lo agregamos como un ítem adicional
      if (order.shipping > 0) {
        items.push({
          title: 'Costo de envío',
          unit_price: order.shipping,
          quantity: 1,
        });
      }

      const response = await fetch('/api/create-preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items,
          back_urls: {
            success: `${window.location.origin}/checkout/success`,
            failure: `${window.location.origin}/checkout/failure`,
            pending: `${window.location.origin}/checkout/pending`,
          },
          auto_return: 'approved',
        }),
      });

      if (!response.ok) {
        throw new Error('Error al crear la preferencia de pago');
      }

      const { id } = await response.json();
      setPreferenceId(id);
    } catch (err) {
      console.error('Error:', err);
      setError('Ocurrió un error al procesar el pago. Por favor intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (preferenceId) {
      // Redirigir al checkout de MercadoPago
      window.location.href = `https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=${preferenceId}`;
    }
  }, [preferenceId]);

  const handleOpenMercadoPago = () => {
    createPreference();
  };

  if (!order) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-900 rounded-lg border border-gold-500 shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-gold-500 text-center font-serif">Finalizar Compra</h2>
      
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-white border-b border-gold-500 pb-2">Resumen del Pedido</h3>
        <div className="space-y-3">
          {order.items.map((item, index) => (
            <div key={index} className="flex justify-between py-2 border-b border-gray-700">
              <span className="text-white">
                {item.name} 
                {item.selectedVariant?.color && <span className="text-gold-300"> - {item.selectedVariant.color}</span>}
                {item.selectedVariant?.size && <span className="text-gold-600"> - {item.selectedVariant.size}</span>}
              </span>
              <span className="text-white">
                ${item.price.toLocaleString()} x {item.quantity}
              </span>
            </div>
          ))}
          <div className="flex justify-between py-2 border-b border-gray-700">
            <span className="text-gray-300">Envío</span>
            <span className="text-gold-600">${order.shipping.toLocaleString()}</span>
          </div>
          <div className="flex justify-between py-3 font-bold text-xl mt-4">
            <span className="text-gold-600">Total</span>
            <span className="text-gold-500">${(order.total + order.shipping).toLocaleString()}</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-900 text-white rounded-md text-center">
          {error}
        </div>
      )}
      
      <div className="mb-6">
        {loading ? (
          <div className="flex justify-center items-center h-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gold-500"></div>
          </div>
        ) : (
          <button
            onClick={handleOpenMercadoPago}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded transition duration-200"
            disabled={loading}
          >
            Pagar con Mercado Pago
          </button>
        )}
      </div>

      <div className="mt-6 text-center text-gray-400 text-sm">
        <p>Su compra está protegida con Mercado Pago</p>
      </div>
    </div>
  );
};

export default function CheckoutPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black pt-32 pb-20 px-4">
        <div className="container mx-auto">
          <CheckoutForm />
        </div>
      </div>
    </>
  );
}