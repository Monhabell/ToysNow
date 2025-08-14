// src/app/api/productos/route.ts
import { NextResponse } from 'next/server'


export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');
  

  if (!slug) {
    return NextResponse.json(
      { error: 'Se requiere el parámetro ID' },
      { status: 400 }
    );
  }

  try {
    const API_URL = `${process.env.API_TENANT_BASE_URL_V1}/products/${slug}`;

    const res = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': process.env.API_KEY || ''

      },
      // Si usas Next.js 13+, puedes deshabilitar la caché:
      cache: 'no-store'
    })

    if (!res.ok) {
      return NextResponse.json({ error: 'No se pudieron obtener los productos' }, { status: res.status })
    }

    const data = await res.json()
    return NextResponse.json(data)

  } catch (error) {
    console.error('Error al obtener productos:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
