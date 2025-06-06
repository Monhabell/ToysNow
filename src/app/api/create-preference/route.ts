// src/app/api/create-preference/route.ts
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { NextResponse } from 'next/server';

const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;

if (!accessToken) {
  throw new Error('⚠️ MERCADO_PAGO_ACCESS_TOKEN no está definido');
}

const client = new MercadoPagoConfig({ accessToken });

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('📦 Datos recibidos:', body);

    const preferenceData = {
      items: [
        {
          id: body.id || 'default-id',
          title: body.title,
          quantity: body.quantity,
          currency_id: 'COP', // o 'USD' si estás en otros países
          unit_price: body.unit_price,
        },
      ],
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success`,
        failure: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/failure`,
        pending: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/pending`,
      },

    };

    const preference = new Preference(client);
    const response = await preference.create({ body: preferenceData });

    return NextResponse.json({ init_point: response.init_point });

  } catch (error: any) {
    console.error('❌ Error al crear preferencia:', error?.response?.data || error?.message || error);
    return NextResponse.json(
      { error: 'Error al crear preferencia', details: error?.message || 'Desconocido' },
      { status: 500 }
    );
  }

}
