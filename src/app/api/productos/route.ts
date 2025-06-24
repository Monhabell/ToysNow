// src/app/api/productos/route.ts
import { NextResponse } from 'next/server'

const API_URL = `${process.env.API_TENANT_BASE_URL_V1}/products`;

export async function GET() {
  try {
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
