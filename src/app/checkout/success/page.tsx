'use client';

import { useSearchParams } from 'next/navigation';
import Navbar from "@/components/Navbar";

export default function SuccessPage() {
  const params = useSearchParams();

  const paymentId = params.get('payment_id');
  const status = params.get('status');
  const orderId = params.get('merchant_order_id');
  const paymentType = params.get('payment_type');
  const preferenceId = params.get('preference_id');

  // guardar en la api wen la base de datos los detalles de confirmacion de la compra 
    
  return (
    <>
      <Navbar />
      
      <div className="min-h-screen bg-black text-gray-100 px-4 py-8 mt-35">
        <div className="max-w-2xl mx-auto">
          {/* Encabezado simple */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-yellow-500 mb-2">Pago confirmado</h1>
            <p className="text-gray-400">Hemos recibido tu pago correctamente.</p>
          </div>

          {/* Detalles de la transacción */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-medium text-yellow-500 mb-4">Detalles de la transacción</h2>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">ID de pago:</span>
                <span className="font-mono">{paymentId}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-400">ID de orden:</span>
                <span className="font-mono">{orderId}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-400">Estado:</span>
                <span className="text-green-400 font-medium">{status}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-400">Tipo de pago:</span>
                <span>{paymentType}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-400">Preferencia:</span>
                <span className="font-mono">{preferenceId}</span>
              </div>
            </div>
          </div>

          {/* Botón de acción */}
          <div className="text-center">
            <a
              href="/productos"
              className="inline-block px-6 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded transition-colors"
            >
              Continuar
            </a>
          </div>
        </div>
      </div>
    </>
  );
}