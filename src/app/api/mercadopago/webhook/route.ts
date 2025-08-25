import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // 📦 obtenemos el body como texto primero
    const body = await req.text();

    // 📋 mostramos headers y body en consola
    console.log("🔔 Webhook recibido de Mercado Pago");
    console.log("Headers:", Object.fromEntries(req.headers));
    console.log("Body:", body);

    // devolvemos respuesta OK para que Mercado Pago no reintente
    return new NextResponse("ok", { status: 200 });
  } catch (error) {
    console.error("❌ Error en webhook:", error);
    return new NextResponse("internal server error", { status: 500 });
  }
}

// también responder a GET por si quieres probar rápido en navegador
export async function GET() {
  return new NextResponse("Webhook funcionando ✅", { status: 200 });
}
