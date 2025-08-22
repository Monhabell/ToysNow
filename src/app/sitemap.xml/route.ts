// src/app/sitemap.xml/route.ts
import { NextResponse } from "next/server";

interface Product {
    slug: string | null;
    updated_at: string | null;
}

export async function GET() {
    // URL base de tu sitio
    const BASE_URL = "https://www.toysnow.com.co";

    // Obtener productos desde tu API interna
    const res = await fetch(`${BASE_URL}/api/productos`, {
        next: { revalidate: 3600 }, // refresca cada hora
    });

    if (!res.ok) {
        return new Response("Error obteniendo productos", { status: 500 });
    }

    const data = await res.json();
    const productos: Product[] = data.data || [];

    // Páginas estáticas
    const staticPages = [
        { loc: `${BASE_URL}`, changefreq: "daily", priority: 1.0, lastmod: undefined },
        { loc: `${BASE_URL}/productos`, changefreq: "daily", priority: 0.9, lastmod: undefined },
    ];

    // Convertir productos en URLs del sitemap
    const productPages = productos
        .filter(p => p.slug) // solo productos con slug
        .map(p => ({
            loc: `${BASE_URL}/productos/${p.slug}`,
            lastmod: p.updated_at || new Date().toISOString(),
            changefreq: "weekly",
            priority: 0.8,
        }));

    // Unir todo
    const urls = [...staticPages, ...productPages];

    // Construir XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${urls
                    .map(url => {
                        return `<url>
        <loc>${url.loc}</loc>
        ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ""}
        <changefreq>${url.changefreq}</changefreq>
        <priority>${url.priority}</priority>
        </url>`;
                    })
                    .join("\n")}
        </urlset>`;

    return new NextResponse(sitemap, {
        headers: {
            "Content-Type": "application/xml",
        },
    });
}
