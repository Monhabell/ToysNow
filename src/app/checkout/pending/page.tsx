'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';

function PendingContent() {
  const params = useSearchParams();
  const paymentId = params.get('payment_id');
  const status = params.get('status');
  const orderId = params.get('merchant_order_id');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-yellow-50 text-yellow-800 px-4">
      <h1 className="text-4xl font-bold mb-4">⏳ Pago pendiente</h1>
      <p className="text-lg mb-6">Estamos procesando tu pago. Por favor verifica más tarde.</p>

      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md space-y-2 text-gray-700">
        <p><strong>ID de pago:</strong> {paymentId || 'N/A'}</p>
        <p><strong>ID de orden:</strong> {orderId || 'N/A'}</p>
        <p><strong>Estado:</strong> {status || 'Pendiente'}</p>
      </div>

      <Link 
        href="/"
        className="mt-8 inline-block px-6 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
      >
        Volver al inicio
      </Link>
    </div>
  );
}

export default function PendingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Cargando...</div>}>
      <PendingContent />
    </Suspense>
  );
}