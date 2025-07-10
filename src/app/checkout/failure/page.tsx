'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function FailurePage() {
  const params = useSearchParams();

  const paymentId = params.get('payment_id');
  const status = params.get('status');
  const orderId = params.get('merchant_order_id');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 text-red-800 px-4">
      <h1 className="text-4xl font-bold mb-4">❌ Pago fallido</h1>
      <p className="text-lg mb-6">Tu pago no se ha podido procesar. Por favor, intenta nuevamente.</p>

      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md space-y-2 text-gray-700">
        <p><strong>ID de pago:</strong> {paymentId || 'N/A'}</p>
        <p><strong>ID de orden:</strong> {orderId || 'N/A'}</p>
        <p><strong>Estado:</strong> {status || 'Fallido'}</p>
      </div>

      <Link 
        href="/"
        className="mt-8 inline-block px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Volver al inicio
      </Link >
    </div>
  );
}
