import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { couponCode } = await request.json();
    
    // Validar que couponCode existe
    if (!couponCode) {
      return NextResponse.json(
        { valid: false, message: 'Código de cupón requerido' },
        { status: 400 }
      );
    }

    // Lógica de validación de cupones
    const validCoupons: Record<string, number> = {
      'DESCUENTO10': 0.10, // 10% de descuento
      'DESCUENTO15': 0.15, // 15% de descuento
      'PROMO20': 0.20,     // 20% de descuento
    };

    const discount = validCoupons[couponCode.toUpperCase()] || 0;
    
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

// Opcional: agregar otros métodos si es necesario
export async function GET() {
  return NextResponse.json(
    { message: 'Método no permitido' },
    { status: 405 }
  );
}