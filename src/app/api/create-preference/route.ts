/* eslint-disable @typescript-eslint/no-explicit-any */

import { MercadoPagoConfig, Preference } from 'mercadopago';
import { NextResponse } from 'next/server';

// Interfaces para tipado
interface MercadoPagoItem {
  id: string;
  title: string;
  quantity: number;
  currency_id: string;
  unit_price: number;
  picture_url?: string;
  description?: string;
  variant_id?: string | number;
  variant_attributes?: any[]; // Puedes definir un tipo más específico si lo conoces
}

interface CheckoutRequestBody {
  items: MercadoPagoItem[];
  shipping_cost?: number | string;
  variantes_producto?: any[];
  discount?: number | string;
  title: string;
  quantity: number | string;
  unit_price: number | string;
  id_user: string;
  email: string;
  descripcion_envio?: string;
  delivery_info?: string | object;
  variants?: string;
  id_product?: string;
  user_token: string;
  totalCompra?: number | string;
  user?: {
    userId: string;
    email: string;
    token: string;
  };
}



interface DeliveryInfo {
  address?: string;
  department?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  phone?: string;
  deliveryType?: string;
  deliveryNotes?: string;
}

interface MercadoPagoResponse {
  id?: string;
  init_point?: string;
  items?: MercadoPagoItem[];
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

    console.log('📦 Datos user:', body.user?.token);

    // validar que body.user_token no sea null o vacio

    if (!body.user?.token) {
      throw new Error('⚠️ Usuario no autenticado');
    }

    const preferenceData = {
      items: body.items
        .filter((item) => item.id !== 'discount') // 👈 filtramos los descuentos
        .map((item) => ({
          id: item.id || 'default-id',
          title: item.title,
          quantity: Number(item.quantity),
          currency_id: 'COP',
          unit_price: Number(item.unit_price),
          picture_url: item.picture_url || undefined,
          description: item.description || ''
        })),
      shipments: {
        cost: Number(body.shipping_cost || 0),
        mode: 'not_specified',
      },
      metadata: {
        id_user: body.id_user || body.user?.userId,
        email: body.email || body.user?.email,
        token_id_user: body.user_token || body.user?.token,
        variantesProducto: JSON.stringify(body.variantes_producto || []),
        ...(typeof body.delivery_info === 'string'
          ? { delivery_info: body.delivery_info }
          : body.delivery_info)
      },
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success`,
        failure: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/failure`,
        pending: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/pending`,
      },
    };


    const preference = new Preference(client);
    const response = await preference.create({ body: preferenceData }) as MercadoPagoResponse;
    //console.log('✅ Preferencia creada:', response);

    const preference_id = response?.id;

    if (!preference_id) {
      throw new Error('No se pudo obtener el ID de preferencia de Mercado Pago');
    }




    // Procesar información de envío
    let deliveryInfoObj: DeliveryInfo = {};

    if (body.delivery_info) {
      if (typeof body.delivery_info === 'string') {
        try {
          deliveryInfoObj = JSON.parse(body.delivery_info);
        } catch {
          deliveryInfoObj = { deliveryNotes: body.delivery_info };
        }
      } else {
        deliveryInfoObj = body.delivery_info as DeliveryInfo;
      }
    } else {
      deliveryInfoObj = { deliveryNotes: 'No hay notas adicionales' };
    }



    const orderRequestBody = {
      payment_type: "mercado_pago",
      preference_id,
      products: body.items
        .filter((item) => item.id !== 'discount') // 👈 igual aquí excluimos el descuento
        .map((item) => ({
          product_id: item.id || 'default-id',
          unit_price: Number(item.unit_price) + Number(body.shipping_cost),
          quantity: Number(item.quantity),
          currency: 'COP',
          ...(item.variant_id && { variante_id: Number(item.variant_id) }),
          variantesProducto: JSON.stringify(item.variant_attributes || [])
        })),
      status: 'pending',
      delivery_info: {
        address: deliveryInfoObj.address || '',
        apartment: deliveryInfoObj.department || '',
        city: deliveryInfoObj.city || '',
        province: deliveryInfoObj.city || '',
        postalCode: deliveryInfoObj.postalCode || '',
        phone: deliveryInfoObj.phone || '',
        deliveryType: deliveryInfoObj.deliveryType || 'casa',
        deliveryNotes: deliveryInfoObj.deliveryNotes || 'No hay notas adicionales',
        ...(body.discount ? { discount: body.discount } : {}), // 👈 aquí va el descuento
      }
    };


    console.log('📤 Enviando orden:', JSON.stringify(orderRequestBody, null, 2));
    // Crear orden en el sistema
    try {
      const orderRes = await fetch(`${process.env.API_TENANT_BASE_URL_V1}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${body.user?.token}`,
          'X-API-Key': process.env.API_KEY || '',
        },
        body: JSON.stringify(orderRequestBody),
      });

      if (!orderRes.ok) {
        const errorData = await orderRes.json();
        console.error('❌ Error en la respuesta al crear orden:', errorData);
        throw new Error(errorData.message || 'Error al crear la orden');
      }

      const orderData = await orderRes.json();
      console.log('✅ Orden creada exitosamente:', orderData);
    } catch (orderError) {
      console.error('❌ Error al crear la orden:', orderError);
      // Continuamos aunque falle la creación de la orden para no interrumpir el flujo de pago
    }

    return NextResponse.json({
      init_point: response.init_point,
      orderId: preference_id,
      token_id: body.user?.token
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    console.error('❌ Error en el proceso de checkout:', errorMessage);
    return NextResponse.json(
      {
        error: 'Error al procesar el checkout',
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}