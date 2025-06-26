import { NextRequest } from 'next/server';
import { readFile, readdir, unlink } from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
  const { orderId } = await req.json(); // en realidad es preference_id

  console.log('🔍 Buscando orden localmente por preference_id:', orderId);

  try {
    const dir = path.resolve(process.cwd(), 'webhook_logs');
    const files = await readdir(dir);

    const jsonFiles = files.filter(f => f.startsWith('log-order') && f.endsWith('.json'));

    let foundOrderData = null;
    let foundFilePath = '';

    for (const fileName of jsonFiles) {
      const filePath = path.join(dir, fileName);
      const content = await readFile(filePath, 'utf-8');
      const json = JSON.parse(content);

      if (json.orderData?.preference_id === orderId) {
        foundOrderData = json;
        foundFilePath = filePath;
        break;
      }
    }

    if (!foundOrderData) {
      return new Response(`Orden con preference_id ${orderId} no encontrada localmente`, { status: 404 });
    }

    const status = foundOrderData.pagosConMetadata?.[0]?.status || 'unknown';

    // Eliminar archivo después de usarlo
    await unlink(foundFilePath);
    console.log(`🧹 Archivo eliminado: ${foundFilePath}`);

    return new Response(JSON.stringify({
      status,
      data: foundOrderData,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('❌ Error leyendo o eliminando archivo local:', err);
    return new Response('Error al leer orden local', { status: 500 });
  }
}
