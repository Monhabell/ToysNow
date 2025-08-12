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
}

interface CheckoutRequestBody {
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
}

interface Product {
  product_id: string;
  unit_price: number;
  quantity: number;
  currency: string;
  variante_id?: number;
  variantesProducto: string;
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


    // Validación de datos requeridos
    const {
      title,
      quantity,
      unit_price,
      id_user,
      email,
      user_token,
      id_product,
      variants,
      variantes_producto,
      delivery_info,
      discount = 0,
      shipping_cost = 0
    } = body;

    if (!title || !quantity || !unit_price || !id_user || !email || !user_token) {
      return NextResponse.json(
        { error: 'Faltan datos obligatorios: title, quantity, unit_price, id_user, email o user_token' },
        { status: 400 }
      );
    }

    // Crear preferencia en Mercado Pago
    const preferenceData = {
      items: [
        {
          id: id_product || 'default-id',
          title,
          quantity: Number(quantity),
          currency_id: 'COP',
          unit_price: Number(unit_price) - Number(discount),
        },
      ],
      shipments: {
        cost: Number(shipping_cost),
        mode: 'not_specified',
      },
      metadata: {
        id_user,
        email,
        token_id_user: user_token,
        varaintes_id: variants,
        variantesProducto: JSON.stringify(variantes_producto || []),
        ...(typeof delivery_info === 'string' ? { delivery_info } : delivery_info)
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

    if (!preference_id) {
      throw new Error('No se pudo obtener el ID de preferencia de Mercado Pago');
    }

    // Preparar datos para la orden
    const products: Product[] = [{
      product_id: id_product || 'default-id',
      unit_price: Number(body.totalCompra),
      quantity: Number(quantity),
      currency: 'COP',
      ...(variants && { variante_id: Number(variants) }),
      variantesProducto: JSON.stringify(variantes_producto || [])
    }];

    // Procesar delivery_info
    let deliveryInfoObj: DeliveryInfo;
    try {
      deliveryInfoObj = typeof delivery_info === 'string' ?
        JSON.parse(delivery_info) :
        (delivery_info as DeliveryInfo) || {};
    } catch (e) {
      deliveryInfoObj = {
        deliveryNotes: typeof delivery_info === 'string' ? delivery_info : 'No hay notas adicionales'
      };
    }

    // Estructura final para la orden
    const orderRequestBody = {
      preference_id,
      products,
      status: 'pending',
      delivery_info: {
        address: deliveryInfoObj.address || '',
        apartment: deliveryInfoObj.department || '',
        city: deliveryInfoObj.city || '',
        province: deliveryInfoObj.department || '',
        postalCode: deliveryInfoObj.postalCode || '',
        phone: deliveryInfoObj.phone || '',
        deliveryType: deliveryInfoObj.deliveryType || 'casa',
        deliveryNotes: deliveryInfoObj.deliveryNotes || 'No hay notas adicionales'
      }
    };

    console.log('📤 Enviando orden:', JSON.stringify(orderRequestBody, null, 2));

    // Crear orden en el sistema
    try {
      const orderRes = await fetch(`${process.env.API_TENANT_BASE_URL_V1}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user_token}`,
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
      token_id: user_token
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