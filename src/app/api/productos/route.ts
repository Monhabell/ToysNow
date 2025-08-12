// src/app/api/productos/route.ts
import { NextResponse } from 'next/server'

// Define interfaces for the API response structure
interface Image {
  id: number;
  product_id: number;
  url: string;
}

interface Brand {
  id: number;
  name: string;
}

interface Category {
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
}

interface Seo {
  title: string | null;
  description: string | null;
  keywords: string | null;
}

interface Product {
  id: number;
  name: string;
  slug: string | null;
  description: string;
  price: string;
  compare_price: string;
  stock: number;
  is_available: boolean;
  is_feature: boolean;
  relevance: number;
  qualification: number;
  brand: Brand;
  images: Image[];
  categories: Category[];
  reviews_count: number;
  created_at: string | null;
  updated_at: string | null;
  seo: Seo;
}

interface Link {
  url: string | null;
  label: string;
  active: boolean;
}

interface Links {
  self: string;
  first: string[];
  last: string[];
  prev: (string | null)[];
  next: (string | null)[];
}

interface Meta {
  current_page: number[];
  from: number[];
  last_page: number[];
  per_page: number[];
  to: number[];
  total: number[];
  links: Link[];
  path: string;
}

interface ApiResponse {
  data: Product[];
  links: Links;
  meta: Meta;
  type: string;
  version: string;
  timestamp: string;
  status: string;
}

export async function GET() {
  const API_URL_BASE = `${process.env.API_TENANT_BASE_URL_V1}/products`;
  const API_KEY = process.env.API_KEY || '';

  if (process.env.API_TENANT_BASE_URL_V1 || process.env.API_KEY) {
    console.log("API_TENANT_BASE_URL_V1:", process.env.API_TENANT_BASE_URL_V1);
    console.log("API_KEY:", process.env.API_KEY);
  }


  try {
    const allProducts: Product[] = [];
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
        return NextResponse.json(
          { error: `Error al obtener la página ${currentPage}` },
          { status: res.status }
        );
      }

      const responseData: ApiResponse = await res.json();
      const products = responseData.data || [];

      allProducts.push(...products);

      // Handle the pagination (note: meta.last_page is an array in the response)
      const meta = responseData.meta;
      lastPage = Array.isArray(meta.last_page) ? meta.last_page[0] : 1;
      currentPage++;

    } while (currentPage <= lastPage);

    return NextResponse.json({ data: allProducts });

  } catch (error) {
    console.error('Error al obtener productos:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}