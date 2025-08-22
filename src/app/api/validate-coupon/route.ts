import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {

    console.log(request.json)
    const { couponCode, productData, user } = await request.json();

    console.log('Validating coupon:', couponCode, 'for products:', productData, 'UserToken', user);

    // crear data para order
    const orderRequestBody = {
      products: productData,
    };

    console.log(orderRequestBody);

    const orderRes = await fetch(`${process.env.API_TENANT_BASE_URL_V1}/coupons/${couponCode}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user}`,
        'X-API-Key': process.env.API_KEY || '',
      },
      body: JSON.stringify(orderRequestBody),
    });

    console.log(orderRes);

    

    const couponData = await orderRes.json();
    console.log('✅ Cupón validado exitosamente:', couponData);
    return NextResponse.json(
      { valid: true, message: 'Cupón válido', data: couponData },
      { status: 200 }
    );



    
  } catch (error) {
    console.error('Error validating coupon:', error);
    return NextResponse.json(
      { valid: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// Opcional: agregar otros métodos si es necesario
export async function GET() {
  return NextResponse.json(
    { message: 'Método no permitido' },
    { status: 405 }
  );
}