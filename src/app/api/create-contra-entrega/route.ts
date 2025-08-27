import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    console.log("📦 Datos recibidos en la API contra entrega:");
    console.log(JSON.stringify(data, null, 2));


    const orderRequestBody = {
      payment_type: "contra_entrega", // o "mercado_pago" si es el caso
      preference_id: data.preference_id,
      products: data.items.map((item: any) => ({
        product_id: item.id || 'default-id',
        unit_price: Number(item.price), // 👈 solo el precio del producto
        quantity: Number(item.quantity),
        currency: 'COP',
        ...(item.variant?.id && { variante_id: Number(item.variant.id) }),
        variantesProducto: JSON.stringify(item.variant?.attributes || [])
      })),
      status: data.status || 'pending',
      delivery_info: {
        address: data.delivery_info?.address || '',
        apartment: data.delivery_info?.apartment || '',
        city: data.delivery_info?.city || '',
        province: data.delivery_info?.province || '',
        postalCode: data.delivery_info?.postalCode || '',
        phone: data.delivery_info?.phone || '',
        deliveryType: data.delivery_info?.deliveryType || 'casa',
        deliveryNotes: data.delivery_info?.deliveryNotes || 'No hay notas adicionales',
        ...(data.discount ? { discount: data.discount } : {}), // 👈 incluye descuento si existe
      },
      user: {
        email: data.user?.email,
        userId: data.user?.userId,
      }
    };


    const orderRes = await fetch(`${process.env.API_TENANT_BASE_URL_V1}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${data.user?.token}`,
        'X-API-Key': process.env.API_KEY || '',
      },
      body: JSON.stringify(orderRequestBody),
    });

    if (!orderRes.ok) {
      const errorData = await orderRes.json().catch(() => ({}));
      console.error('❌ Error en la respuesta al crear orden:', errorData);
      return NextResponse.json(
        { success: false, message: errorData.message || 'Error al crear la orden' },
        { status: orderRes.status }
      );
    }

    const orderData = await orderRes.json();
    console.log('✅ Orden creada exitosamente:', orderData);

    return NextResponse.json({
      success: true,
      message: "Orden contra entrega creada correctamente",
      order: orderData,
    });
  } catch (orderError: any) {
    console.error('❌ Error al crear la orden:', orderError);

    return NextResponse.json(
      { success: false, message: orderError.message || "Error inesperado" },
      { status: 500 }
    );
  }
}
