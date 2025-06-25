import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log('📩 Webhook recibido:', body);

    const paymentId = body.id;
    const topic = body.type;

    console.log('ID del pago:', paymentId);

    if (!paymentId || !topic) {
      console.warn('⚠️ Webhook incompleto:', body);
      return new Response('Webhook incompleto', { status: 400 });
    }

    const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
    const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    // Ruta absoluta para guardar los datos
    const dir = path.resolve(process.cwd(), 'webhook_logs');
    const filePath = path.resolve(dir, `log-${Date.now()}.json`);

    // Crear el directorio si no existe
    await mkdir(dir, { recursive: true });
    

    // Guardar los datos en un archivo con marca de tiempo
    await writeFile(filePath, JSON.stringify(body, null, 2), 'utf-8');

    return new Response('Datos guardados', { status: 200 });
  } catch (error) {
    console.error('❌ Error al guardar webhook:', error);
    return new Response('Error', { status: 500 });
  }
}
