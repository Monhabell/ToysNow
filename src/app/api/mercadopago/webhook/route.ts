import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

// Configuración de tipos mejorados
interface Metadata {
  token_id_user?: string;
  [key: string]: unknown; // Para propiedades dinámicas pero con tipo más seguro
}

interface PaymentOrder {
  id: string;
  // Agrega aquí otros campos específicos del order si los conoces
}

interface Payment {
  id: string;
  status: string;
  transaction_amount: number;
  order?: PaymentOrder;
  metadata?: Metadata;
  // Agrega aquí otros campos específicos del pago
}

interface MerchantOrderPayment {
  id: string;
  // Agrega aquí otros campos específicos del pago en la orden
}

interface MerchantOrder {
  id: string;
  payments: MerchantOrderPayment[];
  // Agrega aquí otros campos específicos de la orden
}

interface WebhookPayload {
  type: 'payment' | 'merchant_order';
  action?: string;
  data: {
    id: string;
  };
  // Solo si realmente necesitas propiedades dinámicas
  [key: string]: unknown;
}

interface DatabasePayload {
  eventType: string;
  paymentId?: string;
  paymentData?: Payment;
  orderData?: MerchantOrder;
  orderId?: string;
  paymentsData?: Payment[];
  receivedAt: string;
}

// Función para validar la firma del webhook
function validateWebhookSignature(signature: string | null, payload: unknown): boolean {
  // Implementación real debería verificar la firma con tu secret key
  return true; // En producción, implementar validación real
}

// Función para obtener detalles de un pago
async function getPaymentDetails(paymentId: string, accessToken: string): Promise<Payment> {
  const paymentRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!paymentRes.ok) {
    throw new Error(`Error al obtener pago: ${paymentRes.status}`);
  }

  return await paymentRes.json() as Payment;
}

// Función para obtener detalles de una orden
async function getOrderDetails(orderId: string, accessToken: string): Promise<MerchantOrder> {
  const orderRes = await fetch(`https://api.mercadopago.com/merchant_orders/${orderId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!orderRes.ok) {
    throw new Error(`Error al obtener orden: ${orderRes.status}`);
  }

  return await orderRes.json() as MerchantOrder;
}

// Función para guardar en la base de datos
async function saveToDatabase(data: DatabasePayload): Promise<void> {
  const token = data.paymentData?.metadata?.token_id_user || '';
  const response = await fetch(`${process.env.API_TENANT_BASE_URL_V1}/order-payments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      'X-API-Key': process.env.API_KEY || '',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Error al guardar en BD: ${response.status}`);
  }
}

// Función para guardar logs en archivo
async function saveToLogFile(data: unknown, prefix: string): Promise<void> {
  try {
    const dir = path.resolve(process.cwd(), 'webhook_logs');
    await mkdir(dir, { recursive: true });
    
    const filePath = path.resolve(dir, `${prefix}-${Date.now()}.json`);
    await writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('⚠️ Error al guardar archivo de log:', error);
  }
}

export async function POST(req: Request) {
  try {
    // Validar método HTTP
    if (req.method !== 'POST') {
      return new Response('Método no permitido', { status: 405 });
    }

    // Validar tamaño del payload
    const contentLength = Number(req.headers.get('content-length') || '0');
    if (contentLength > 1000000) {
      return new Response('Payload demasiado grande', { status: 413 });
    }

    // Parsear el cuerpo con tipo específico
    const body = await req.json() as WebhookPayload;
    console.log('📩 Webhook recibido:', body);

    // Validar firma del webhook
    const signature = req.headers.get('x-signature') || null;
    if (!validateWebhookSignature(signature, body)) {
      console.warn('⚠️ Firma de webhook inválida');
      return new Response('Firma inválida', { status: 401 });
    }

    const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
    if (!accessToken) {
      throw new Error('Falta MERCADO_PAGO_ACCESS_TOKEN');
    }

    const eventType = body.type;
    const resourceId = body.data.id;
    let output: DatabasePayload;

    if (eventType === 'payment') {
      // Procesar notificación de pago
      const paymentData = await getPaymentDetails(resourceId, accessToken);
      console.log("💳 Pago obtenido:", paymentData);

      // Buscar orden asociada si existe
      let orderData: MerchantOrder | undefined;
      if (paymentData.order?.id) {
        try {
          orderData = await getOrderDetails(paymentData.order.id, accessToken);
          console.log("📦 Orden asociada:", orderData);
        } catch (orderError) {
          console.warn("⚠️ No se pudo obtener la orden asociada:", orderError);
        }
      }

      // Preparar datos para guardar
      output = {
        eventType,
        paymentId: resourceId,
        paymentData,
        orderData,
        receivedAt: new Date().toISOString(),
      };

    } else if (eventType === 'merchant_order') {
      // Procesar notificación de orden
      const orderData = await getOrderDetails(resourceId, accessToken);
      console.log("📦 Orden obtenida:", orderData);

      // Obtener detalles de todos los pagos asociados
      const paymentsData = await Promise.all(
        orderData.payments.map(async (pago) => {
          try {
            return await getPaymentDetails(pago.id, accessToken);
          } catch (error) {
            console.error(`Error obteniendo pago ${pago.id}:`, error);
            return undefined;
          }
        })
      );

      // Filtrar pagos undefined y preparar datos
      output = {
        eventType,
        orderId: resourceId,
        orderData,
        paymentsData: paymentsData.filter((p): p is Payment => p !== undefined),
        receivedAt: new Date().toISOString(),
      };

    } else {
      return new Response('Tipo de evento no soportado', { status: 400 });
    }

    // Guardar en archivo de log (para depuración)
    await saveToLogFile(output, `webhook-${eventType}`);

    // Guardar en base de datos
    await saveToDatabase(output);
    console.log('✅ Datos guardados exitosamente');

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Error al procesar webhook:', error);
    
    // Guardar error en archivo de log
    await saveToLogFile({
      error: error instanceof Error ? error.message : String(error),
      receivedAt: new Date().toISOString()
    }, 'webhook-error');

    return new Response(JSON.stringify({ 
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}