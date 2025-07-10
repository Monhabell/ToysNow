import { MercadoPagoConfig, Preference } from 'mercadopago';
import { NextResponse } from 'next/server';

// Interfaces para tipado
interface MercadoPagoItem {
  id: string;
  title: string;
  quantity: number;
  currency_id: string;
  unit_price: number;
}

interface CheckoutRequestBody {
  shipping_cost?: number | string;
  variantes_producto?: any[]; // Reemplaza 'any' con una interfaz más específica si es posible
  discount?: number | string;
  title: string;
  quantity: number | string;
  unit_price: number | string;
  id_user: string;
  email: string;
  descripcion_envio?: string;
  delivery_info?: string;
  variants?: string;
  id_product?: string;
  user_token: string;
}

interface Product {
  product_id: string;
  unite_price: number;
  quantity: number;
  currency: string;
  variante_id?: string;
  variantesProducto: string;
}

interface MercadoPagoResponse {
  id?: string;
  init_point?: string;
  items?: MercadoPagoItem[];
  // Agrega otros campos que necesites
}

const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;

if (!accessToken) {
  throw new Error('⚠️ MERCADO_PAGO_ACCESS_TOKEN no está definido');
}

const client = new MercadoPagoConfig({ accessToken });

export async function POST(request: Request) {
  try {
    const body = await request.json() as CheckoutRequestBody;
    console.log('📦 Datos recibidos:', body);

    // ✅ Validación básica de datos requeridos
    const { 
      shipping_cost, 
      variantes_producto, 
      discount, 
      title, 
      quantity, 
      unit_price, 
      id_user, 
      email, 
      descripcion_envio, 
      delivery_info, 
      variants, 
      id_product, 
      user_token 
    } = body;

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
          unit_price: Number(unit_price) - Number(discount || 0),
        },
      ],
      shipments: {
        cost: Number(shipping_cost) || 0,
        mode: 'not_specified',
      },
      metadata: {
        id_user,
        email,
        descripcion_envio,
        delivery_info,
        token_id_user: user_token,
        varaintes_id: variants,
        variantesProducto: JSON.stringify(variantes_producto || []),
      },
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success`,
        failure: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/failure`,
        pending: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/pending`,
      },
    };

    const preference = new Preference(client);
    const response = await preference.create({ body: preferenceData }) as MercadoPagoResponse;

    console.log('✅ Preferencia creada:', response);

    const preference_id = response?.id;

    const products: Product[] = response?.items?.map((item: MercadoPagoItem) => ({
      product_id: item.id,
      unite_price: item.unit_price,
      quantity: item.quantity,
      currency: item.currency_id,
      variante_id: variants,
      variantesProducto: JSON.stringify(variantes_producto || []),
    })) || [];

    const status = 'pending';
    const delivery_notes = delivery_info || 'No hay notas adicionales';

    try {
      const orderRes = await fetch(`${process.env.API_TENANT_BASE_URL_V1}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user_token}`,
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
      console.log('✅ Orden creada:', orderData);
    } catch (orderError) {
      console.error('❌ Error al crear la orden en sistema:', orderError);
    }

    return NextResponse.json({
      init_point: response.init_point,
      orderId: preference_id,
      token_id: user_token    
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    console.error('❌ Error al crear preferencia:', errorMessage);
    return NextResponse.json(
      {
        error: 'Error al crear preferencia',
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
