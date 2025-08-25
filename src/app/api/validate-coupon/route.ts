import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {

    console.log(request.json)
    const { couponCode, productData, user } = await request.json();

    const orderRequestBody = {
      products: productData,
    };

    const orderRes = await fetch(`${process.env.API_TENANT_BASE_URL_V1}/coupons/validate/${couponCode}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user}`,
        'X-API-Key': process.env.API_KEY || '',
      },
      body: JSON.stringify(orderRequestBody),
    });


    if (orderRes.status === 404) {
      console.error('Cupón no encontrado');
      return NextResponse.json(
        { valid: false, message: 'Cupón no encontrado' },
        { status: 404 }
      );
    }

    const couponData = await orderRes.json();
    console.log('✅ Cupón validado exitosamente:', couponData);
    const valid = couponData.is_valid;
    const discount = couponData.discount_value;

    if (!valid) {
      return NextResponse.json({
        valid: false,
        discount: 0,
        message: 'Cupón no válido'
      });
    }

    if (discount > 0) {
      return NextResponse.json({ valid: true, discount });
    } else {
      return NextResponse.json({
        valid: false,
        discount: 0,
        message: 'Cupón no válido'
      });
    }


  } catch (error) {
    console.error('Error validating coupon:', error);
    return NextResponse.json(
      { valid: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
