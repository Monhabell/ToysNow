// app/api/create-preference/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, back_urls, auto_return } = body;

    // Validación básica
    if (!items || !Array.isArray(items)) {
      return NextResponse.json(
        { error: "Items are required and must be an array" },
        { status: 400 }
      );
    }

    // Crear preferencia en MercadoPago
    const response = await axios.post(
      'https://api.mercadopago.com/checkout/preferences',
      {
        items,
        back_urls,
        auto_return,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`,
        },
      }
    );

    return NextResponse.json({ id: response.data.id });

  } catch (error) {
    console.error("Error en /api/create-preference:", error);
    return NextResponse.json(
      { error: "Failed to create MercadoPago preference" },
      { status: 500 }
    );
  }
}