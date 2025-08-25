import { NextResponse } from "next/server";

const ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN!;

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("🔔 Webhook recibido:", body);

    // si el webhook trae un pago
    if (body.type === "payment" && body.data?.id) {
      const paymentId = body.data.id;

      // pedir info del pago a Mercado Pago
      const resp = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
      });

      const payment = await resp.json();

      console.log("✅ Detalle del pago recibido:");
      console.log({
        id: payment.id,
        status: payment.status,               // approved, pending, rejected
        status_detail: payment.status_detail, // más detalle
        preference_id: payment.preference_id, // para saber a qué compra corresponde
        external_reference: payment.external_reference, // tu referencia interna
        transaction_amount: payment.transaction_amount,
        payment_method: payment.payment_method_id,
      });
    }

    return new NextResponse("ok", { status: 200 });
  } catch (error) {
    console.error("❌ Error en webhook:", error);
    return new NextResponse("internal server error", { status: 500 });
  }
}
