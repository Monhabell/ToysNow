'use client';

import { useSearchParams } from 'next/navigation';

export default function SuccessPage() {
  const params = useSearchParams();

  const paymentId = params.get('payment_id');
  const status = params.get('status');
  const orderId = params.get('merchant_order_id');
  const paymentType = params.get('payment_type');
  const preferenceId = params.get('preference_id');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 text-green-800 px-4">
      <h1 className="text-4xl font-bold mb-4">✅ ¡Pago exitoso!</h1>
      <p className="text-lg mb-6">Gracias por tu compra. Hemos recibido tu pago correctamente.</p>

      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md space-y-2 text-gray-700">
        <p><strong>ID de pago:</strong> {paymentId}</p>
        <p><strong>ID de orden:</strong> {orderId}</p>
        <p><strong>Estado:</strong> {status}</p>
        <p><strong>Tipo de pago:</strong> {paymentType}</p>
        <p><strong>Preferencia:</strong> {preferenceId}</p>
      </div>

      <a
        href="/"
        className="mt-8 inline-block px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Volver al inicio
      </a>
    </div>
  );
}
