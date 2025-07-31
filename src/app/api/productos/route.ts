// src/app/api/productos/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  const API_URL_BASE = `${process.env.API_TENANT_BASE_URL_V1}/products`;
  const API_KEY = process.env.API_KEY || '';

  try {
    let allProducts: any[] = [];
    let currentPage = 1;
    let lastPage = 1;

    do {
      const url = `${API_URL_BASE}?page=${currentPage}`;

      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': API_KEY
        },
        cache: 'no-store'
      });

      if (!res.ok) {
        return NextResponse.json({ error: `Error al obtener la página ${currentPage}` }, { status: res.status });
      }

      const responseData = await res.json();
      const products = responseData.data || [];

      allProducts.push(...products);

      // Extraer paginación desde la primera respuesta
      const meta = responseData.meta;
      lastPage = Array.isArray(meta?.last_page) ? meta.last_page[0] : 1;
      currentPage++;

    } while (currentPage <= lastPage);

    return NextResponse.json({ data: allProducts });

  } catch (error) {
    console.error('Error al obtener productos:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
