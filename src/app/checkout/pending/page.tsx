'use client';

import { useSearchParams } from 'next/navigation';

export default function PendingPage() {
  const params = useSearchParams();

  const paymentId = params.get('payment_id');
  const status = params.get('status');
  const orderId = params.get('merchant_order_id');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-yellow-50 text-yellow-800 px-4">
      <h1 className="text-4xl font-bold mb-4">⏳ Pago pendiente</h1>
      <p className="text-lg mb-6">Estamos procesando tu pago. Te notificaremos una vez sea confirmado.</p>

      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md space-y-2 text-gray-700">
        <p><strong>ID de pago:</strong> {paymentId}</p>
        <p><strong>ID de orden:</strong> {orderId}</p>
        <p><strong>Estado:</strong> {status}</p>
      </div>

      <a
        href="/"
        className="mt-8 inline-block px-6 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
      >
        Volver al inicio
      </a>
    </div>
  );
}
