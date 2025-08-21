// src/app/merchant.xml/route.ts
import { NextResponse } from "next/server";

interface Product {
  id: string;
  slug: string | null;
  title: string;
  description: string;
  image: string;
  price: number;
  currency: string;
  brand: string;
  updated_at: string | null;
}

export async function GET() {
  const BASE_URL = "https://www.toysnow.com.co";

  const res = await fetch(`${BASE_URL}/api/productos`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    return new Response("Error obteniendo productos", { status: 500 });
  }

  const data = await res.json();
  const productos: Product[] = data.data || [];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>Tienda ToysNow</title>
    <link>${BASE_URL}</link>
    <description>Feed de productos para Google Merchant Center</description>
    ${productos
      .filter((p) => p.slug)
      .map((p) => {
        return `
      <item>
        <g:id>${p.id}</g:id>
        <g:title><![CDATA[${p.title}]]></g:title>
        <g:description><![CDATA[${p.description}]]></g:description>
        <g:link>${BASE_URL}/productos/${p.slug}</g:link>
        <g:image_link>${p.image}</g:image_link>
        <g:availability>in stock</g:availability>
        <g:price>${p.price} ${p.currency}</g:price>
        <g:condition>new</g:condition>
        <g:brand>${p.brand}</g:brand>
      </item>`;
      })
      .join("\n")}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
