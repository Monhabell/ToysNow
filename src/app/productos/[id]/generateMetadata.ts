import { Metadata } from "next";

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = params;
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

    const imageUrl =
      producto.images?.length > 0
        ? `https://www.softgenix.space/storage/tenants/f2d79397-a55f-45fb-b957-1a69d77e6115/images/${producto.images[0].url}`
        : `${siteUrl}/images/default.jpg`;

    const description = producto.description
      ? producto.description.substring(0, 160).replace(/\s+\S*$/, "") + "..."
      : `Compra ${producto.name} en ToysNow. Envío discreto y garantía de calidad.`;

    const canonicalUrl = `${siteUrl}/productos/${id}`;

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
        canonical: canonicalUrl,
      },
      openGraph: {
        title: `${producto.name} | ToysNow`,
        description,
        images: [{ url: imageUrl, width: 800, height: 600, alt: producto.name }],
        url: canonicalUrl,
        type: "website",
        siteName: "ToysNow",
      },
      twitter: {
        card: "summary_large_image",
        title: `${producto.name} | ToysNow`,
        description,
        images: [imageUrl],
      },
      robots: {
        index: true,
        follow: true,
      },
      other: {
        "application/ld+json": JSON.stringify({
          "@context": "https://schema.org/",
          "@type": "Product",
          name: producto.name,
          image: imageUrl,
          description,
          sku: producto.sku || id,
          brand: { "@type": "Brand", name: producto.brand?.name || "ToysNow" },
          category: producto.category?.name || "Productos",
          offers: {
            "@type": "Offer",
            url: canonicalUrl,
            priceCurrency: "COP",
            price: producto.price || "0.00",
            availability: producto.stock > 0
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
            seller: { "@type": "Organization", name: "ToysNow" },
          },
          aggregateRating: producto.rating
            ? { "@type": "AggregateRating", ratingValue: producto.rating, reviewCount: producto.reviews_count || 1 }
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

