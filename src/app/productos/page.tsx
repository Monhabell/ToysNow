// src/app/productos/page.tsx
import type { Metadata } from "next";
'use client';

import { Suspense } from 'react';
import ProductosContent from './ProductosContent';

// 🟢 Metadatos para SEO
export const metadata: Metadata = {
  title: "Catálogo de productos eróticos",
  description:
    "Explora el catálogo de juguetes eróticos, lencería sexy y productos para adultos en ToysNow. Envío discreto a toda Colombia.",
  keywords: [
    "juguetes eróticos",
    "lencería sexy",
    "tienda sexual",
    "productos para adultos",
    "vibradores",
    "ToysNow"
  ],
  alternates: {
    canonical: "/productos"
  },
  openGraph: {
    title: "Catálogo de productos eróticos",
    description:
      "Explora juguetes eróticos, lencería sexy y más en ToysNow. Envío discreto.",
    url: "https://www.toysnow.com.co/productos",
    siteName: "ToysNow",
    images: [
      {
        url: "/images/og-productos.jpg", // crea esta imagen en public/images
        width: 1200,
        height: 630,
        alt: "Catálogo de productos ToysNow"
      }
    ],
    type: "website",
    locale: "es_ES"
  },
  twitter: {
    card: "summary_large_image",
    title: "Catálogo de productos eróticos",
    description:
      "Explora juguetes eróticos, lencería sexy y más en ToysNow. Envío discreto.",
    images: ["/images/og-productos.jpg"]
  }
};

export default function ProductosPage() {
  return (
    <Suspense fallback={<div>Cargando productos...</div>}>
      <ProductosContent />
    </Suspense>
  );
}
