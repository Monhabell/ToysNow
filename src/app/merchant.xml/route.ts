// src/app/merchant.xml/route.ts
import { NextResponse } from "next/server";

interface Product {
  id: number;
  slug: string;
  name: string;
  description: string;
  price: string;
  brand: { id: number; name: string };
  images: { id: number; url: string }[];
  is_available: boolean;
  updated_at?: string | null;
}

export async function GET() {
  const BASE_URL = "https://www.toysnow.com.co";
  const NEXT_PUBLIC_BACKEND_URL = "https://www.softgenix.space/storage/tenants/2b85d6a6-1059-4929-a8bb-5f3d7ca5c732/images";

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
    <title>ToysNow - Feed de Productos</title>
    <link>${BASE_URL}</link>
    <description>Catálogo de productos ToysNow para Google Merchant Center</description>
    ${productos
      .filter((p) => p.slug)
      .map((p) => {
        // Imagen principal y adicionales
        const images = p.images?.map((img) => `${NEXT_PUBLIC_BACKEND_URL}/${img.url}`) || [];
        const mainImage = images[0] || "";
        const additionalImages = images.slice(1);

        // Marca
        const brand = p.brand?.name || "Genérica";

        return `
      <item>
        <g:id>${p.id}</g:id>
        <g:title><![CDATA[${p.name}]]></g:title>
        <g:description><![CDATA[${p.description}]]></g:description>
        <g:link>${BASE_URL}/productos/${p.slug}</g:link>
        <g:image_link>${mainImage}</g:image_link>
        ${additionalImages
          .map((img) => `<g:additional_image_link>${img}</g:additional_image_link>`)
          .join("\n")}
        <g:availability>${p.is_available ? "in stock" : "out of stock"}</g:availability>
        <g:price>${parseFloat(p.price).toFixed(2)} COP</g:price>
        <g:condition>new</g:condition>
        <g:brand><![CDATA[${brand}]]></g:brand>
        <g:shipping>
          <g:country>CO</g:country>
          <g:service>Estándar</g:service>
          <g:price>0.00 COP</g:price>
        </g:shipping>
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
