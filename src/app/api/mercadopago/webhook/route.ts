import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log('📩 Webhook recibido:', body);

    console.log(body)

    const orderId = body.data?.id || body.id;
    const topic = body.type;

    console.log('ID de la orden:', orderId);
    console.log('Tipo:', topic);

    if (!orderId ) {
      console.warn('⚠️ Webhook no válido:', body);
      return new Response('Webhook no válido', { status: 400 });
    }

    const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;

    // 1. Obtener la orden de compra
    const orderRes = await fetch(`https://api.mercadopago.com/merchant_orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    const orderData = await orderRes.json();
    console.log("📦 Orden completa:", orderData);

    const pagos = orderData.payments || [];

    // 2. Si hay pagos, obtener metadata desde cada pago
    const pagosConMetadata = [];

    for (const pago of pagos) {
      const paymentId = pago.id;

      const paymentRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      const paymentData = await paymentRes.json();

      pagosConMetadata.push({
        paymentId,
        metadata: paymentData.metadata,
        status: paymentData.status,
        amount: paymentData.transaction_amount,
      });
    }

    // 3. Guardar todo en el archivo
    const output = {
      orderId,
      orderData,
      pagosConMetadata,
    };


    const dir = path.resolve(process.cwd(), 'webhook_logs');
    await mkdir(dir, { recursive: true });

    const filePath = path.resolve(dir, `log-order-${Date.now()}.json`);
    await writeFile(filePath, JSON.stringify(output, null, 2), 'utf-8');

    return new Response('Orden + metadata guardada', { 
      status: 200 ,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Error al procesar webhook:', error);
    return new Response('Error', { status: 500 });
  }
}
