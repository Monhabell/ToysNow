// src/app/api/pedidos/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      console.error("❌ No se envió token desde el cliente");
      return NextResponse.json({ message: 'Token no proporcionado' }, { status: 401 });
    }

    const API_URL_BASE = `${process.env.API_TENANT_BASE_URL_V1}/orders`;
    const API_KEY = process.env.API_KEY || '';

    console.log("🔍 Llamando API externa:", API_URL_BASE);
    console.log("🔑 API_KEY:", API_KEY ? "Cargada" : "Vacía");

    const res = await fetch(API_URL_BASE, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY,
        'Authorization': `Bearer ${token}`,
      },
      cache: 'no-store'
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ message: 'Error desconocido en API externa' }));
      console.error("❌ Error de API externa:", errorData);
      return NextResponse.json(errorData, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error("💥 Error interno en /api/pedidos:", error);
    return NextResponse.json({ message: 'Error interno', error: String(error) }, { status: 500 });
  }
}
