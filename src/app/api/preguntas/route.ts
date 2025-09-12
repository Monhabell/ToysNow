import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
    // Leer JSON del body
    const { token, productoId, pregunta } = await request.json();
    console.log(token.apiToken, productoId, pregunta);

    // Obtener IP del cliente
    const ip =
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || // detrás de proxy / vercel / nginx
        request.headers.get("x-real-ip") || // algunos proxys lo usan
        "IP no disponible";

    try {
        const apiUrl = `${process.env.API_TENANT_BASE_URL_V1}/reviews`;
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token.apiToken}`,
                'X-API-Key': process.env.API_KEY || '',
            },
            body: JSON.stringify({
                rating: 3,
                product_id: productoId,
                comment: pregunta,
                ip_address: ip, 
            }),
        });

        if (!response.ok) {
            console.error("❌ Error en la respuesta de la API:", response.statusText);
            return new Response(JSON.stringify({ error: 'Error al enviar la pregunta' }), { status: response.status });
        }

        const data = await response.json();
        console.log("✅ Pregunta enviada exitosamente:", data);
        return new Response(JSON.stringify(data), { status: 200 });

    } catch (error) {
        console.error("🚨 Error al procesar la solicitud:", error);
        return new Response(JSON.stringify({ error: 'Error interno del servidor' }), { status: 500 });
    }
}
