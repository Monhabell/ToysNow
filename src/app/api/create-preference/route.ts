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
    const token = body.user_token || '';


    // ✅ Validación básica de datos requeridos
    const { title, quantity, unit_price, id_user, email, descripcion_envio, delivery_info, variants, id_product, user_token } = body;

    if (!title || !quantity || !unit_price || !id_user || !email) {
      return NextResponse.json(
        { error: 'Faltan datos obligatorios: title, quantity, unit_price, id_user o email' },
        { status: 400 }
      );
    }

    const preferenceData = {
      items: [
        {
          id: id_product || 'default-id',
          title,
          quantity: Number(quantity),
          currency_id: 'COP',
          unit_price: Number(unit_price),
          varaintes: body.variantes_producto || [],
        },
      ],
      metadata: {
        id_user,
        email,
        descripcion_envio,
        delivery_info,
        token_id_user: token
      },
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success`,
        failure: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/failure`,
        pending: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/pending`,
      },
    };

    const preference = new Preference(client);
    const response = await preference.create({ body: preferenceData });

    console.log('✅ Preferencia creada:', response);

    const preference_id = response?.id;

    const products = response?.items?.map((item: any) => ({
      product_id: item.id,
      unite_price: item.unit_price,
      quantity: item.quantity,
      currency: item.currency_id,
      variant_id: body.variants || [],
    })) || [];

    const status = 'pending';
    const delivery_notes = delivery_info || 'No hay notas adicionales';


    try {
      const orderRes = await fetch(`${process.env.API_TENANT_BASE_URL_V1}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'X-API-Key': process.env.API_KEY || '',
        },
        body: JSON.stringify({
          preference_id,
          products,
          status,
          delivery_info: delivery_notes,
        }),
      });

      const orderData = await orderRes.json();
      console.log('✅ Orden creada1111:', orderData);
    } catch (orderError) {
      console.error('❌ Error al crear la orden en sistema:', orderError);
    }

    return NextResponse.json({
      init_point: response.init_point,
      orderId: preference_id,
      token_id : token    
    });

  } catch (error: any) {
    console.error('❌ Error al crear preferencia:', error?.message || error);
    return NextResponse.json(
      {
        error: 'Error al crear preferencia',
        details: error?.message || 'Error desconocido',
      },
      { status: 500 }
    );
  }
}
