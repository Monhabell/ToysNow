import { Metadata } from "next";


interface Props {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.toysnow.com.co";

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/productoDetalle?slug=${id}`,
      { next: { revalidate: 60 } }
    );

    if (!response.ok) {
      return {
        title: "Producto no encontrado | ToysNow",
        description: "El producto que buscas no está disponible en ToysNow.",
        robots: { index: false, follow: false },
      };
    }

    const result = await response.json();
    const producto = result.data;

    if (!producto) {
      return {
        title: "Producto no encontrado | ToysNow",
        description: "El producto que buscas no está disponible en ToysNow.",
        robots: { index: false, follow: false },
      };
    }

    const imageUrl =
      producto.images?.length > 0
        ? `https://www.softgenix.space/storage/tenants/2b85d6a6-1059-4929-a8bb-5f3d7ca5c732/images/${producto.images[0].url}`
        : `${siteUrl}/images/default.jpg`;

    const description = producto.description
      ? producto.description.substring(0, 160).replace(/\s+\S*$/, "") + "..."
      : `Compra ${producto.name} en ToysNow. Envío discreto, precios competitivos y garantía de calidad.`;

    return {
      metadataBase: new URL(siteUrl),
      title: `${producto.name} | ToysNow`,
      description,
      keywords: [
        "juguetes eróticos",
        "tienda sexual online",
        "productos para adultos",
        "ToysNow",
        producto.category?.name,
        producto.name,
        producto.brand?.name || "",
      ].filter(Boolean),
      alternates: {
        canonical: `${siteUrl}/productos/${id}`,
      },
      openGraph: {
        title: `${producto.name} | ToysNow`,
        description,
        images: [
          {
            url: imageUrl,
            width: 800,
            height: 600,
            alt: producto.name,
          },
        ],
        url: `${siteUrl}/productos/${id}`,
        type: "website",
        siteName: "ToysNow",
      },
      twitter: {
        card: "summary_large_image",
        title: `${producto.name} | ToysNow`,
        description,
        images: [imageUrl],
      },
      verification: {
        google: "X_T0lOIJ4i2qyF4yYUStziUnAYuC9u1r7snzmUuDb9Q",
      },
      robots: {
        index: true,
        follow: true,
        nocache: false,
      },
      // 👇 Aquí añadimos el JSON-LD para Rich Snippets
      other: {
        "application/ld+json": JSON.stringify({
          "@context": "https://schema.org/",
          "@type": "Product",
          name: producto.name,
          image: imageUrl,
          description,
          sku: producto.sku || id,
          brand: {
            "@type": "Brand",
            name: producto.brand?.name || "ToysNow",
          },
          category: producto.category?.name || "Productos",
          offers: {
            "@type": "Offer",
            url: `${siteUrl}/productos/${id}`,
            priceCurrency: "COP",
            price: producto.price || "0.00",
            availability: producto.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            seller: {
              "@type": "Organization",
              name: "ToysNow",
            },
          },
          aggregateRating: producto.rating
            ? {
                "@type": "AggregateRating",
                ratingValue: producto.rating,
                reviewCount: producto.reviews_count || 1,
              }
            : undefined,
        }),
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Error | ToysNow",
      description: "Error al cargar la información del producto.",
      robots: { index: false, follow: false },
    };
  }
}
