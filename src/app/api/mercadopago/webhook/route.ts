import { NextResponse } from "next/server";

// Interfaces necesarias (puedes dejarlas igual que antes)
interface Payment {
  id: string;
  net_amount: number;
  status: string;
  transaction_amount: number;
  payment_method: string;
  order?: { id: string };
  metadata?: { token_id_user?: string };
}
interface MerchantOrder {
  id: string;
  preference_id: string;
  payments: { id: string }[];
}
interface WebhookPayload {
  type: "payment" | "merchant_order";
  action?: string;
  data: { id: string };
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

// Helpers para consultar MP
async function getPaymentDetails(paymentId: string, accessToken: string): Promise<Payment> {
  const res = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error(`Error al obtener pago: ${res.status}`);
  return res.json();
}

async function getOrderDetails(orderId: string, accessToken: string): Promise<MerchantOrder> {
  const res = await fetch(`https://api.mercadopago.com/merchant_orders/${orderId}`, {
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error(`Error al obtener orden: ${res.status}`);
  return res.json();
}

// Guardar directamente en tu API
async function saveToDatabase(data: DatabasePayload): Promise<void> {
  const token = data.paymentData?.metadata?.token_id_user || "";

  const datasave = {
    transaction_id: data.paymentId,
    status: data.paymentData?.status,
    order_id: data.orderData?.preference_id,
    amount: data.paymentData?.net_amount,
    payment_method: "Mercado pago",
  }

  console.log(datasave)

  const response = await fetch(`${process.env.API_TENANT_BASE_URL_V1}/order-payments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "X-API-Key": process.env.API_KEY || "",
    },
    body: JSON.stringify(datasave),
  });
  if (!response.ok) {
    throw new Error(`Error al guardar en BD: ${response.status}`);
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as WebhookPayload;
    //console.log("📩 Webhook recibido:", body);

    const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
    if (!accessToken) throw new Error("Falta MERCADO_PAGO_ACCESS_TOKEN");

    const eventType = body.type;
    const resourceId = body.data.id;
    let output: DatabasePayload;

    if (eventType === "payment") {
      const paymentData = await getPaymentDetails(resourceId, accessToken);
      //console.log("💳 Pago obtenido:", paymentData);

      let orderData: MerchantOrder | undefined;
      if (paymentData.order?.id) {
        try {
          orderData = await getOrderDetails(paymentData.order.id, accessToken);
        } catch (err) {
          console.warn("⚠️ No se pudo obtener la orden asociada:", err);
        }
      }

      output = {
        eventType,
        paymentId: resourceId,
        paymentData,
        orderData,
        receivedAt: new Date().toISOString(),
      };

    } else if (eventType === "merchant_order") {
      const orderData = await getOrderDetails(resourceId, accessToken);
      console.log("📦 Orden obtenida:", orderData);

      const paymentsData = await Promise.all(
        orderData.payments.map(async (pago) => {
          try {
            return await getPaymentDetails(pago.id, accessToken);
          } catch (err) {
            console.error(`Error obteniendo pago ${pago.id}:`, err);
            return undefined;
          }
        })
      );

      output = {
        eventType,
        orderId: resourceId,
        orderData,
        paymentsData: paymentsData.filter((p): p is Payment => p !== undefined),
        receivedAt: new Date().toISOString(),
      };
    } else {
      return new NextResponse("Tipo de evento no soportado", { status: 400 });
    }

    // 👉 Aquí solo se guarda en tu API
    await saveToDatabase(output);
    console.log("✅ Datos enviados a API con éxito");

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error("❌ Error en webhook:", error);
    return NextResponse.json({ error: "Error interno", details: String(error) }, { status: 500 });
  }
}
