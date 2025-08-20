import { Metadata } from "next";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/productoDetalle?slug=${id}`
    );

    if (!response.ok) {
      return {
        title: "Producto no encontrado | ToysNow",
        description: "El producto que buscas no está disponible.",
      };
    }

    const result = await response.json();
    const producto = result.data;

    if (!producto) {
      return {
        title: "Producto no encontrado | ToysNow",
        description: "El producto que buscas no está disponible.",
      };
    }

    const imageUrl =
      producto.images.length > 0
        ? `https://www.softgenix.space/storage/tenants/2b85d6a6-1059-4929-a8bb-5f3d7ca5c732/images/${producto.images[0].url}`
        : `${process.env.NEXT_PUBLIC_SITE_URL}/images/default.jpg`;

    return {
      metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://www.toysnow.com.co"),
      title: `${producto.name} | ToysNow`,
      description: producto.description
        ? producto.description.substring(0, 160) + "..."
        : "Descubre este producto exclusivo en ToysNow. Envío discreto y garantía de calidad.",
      keywords: [
        producto.name,
        "juguetes eróticos",
        "tienda sexual",
        "productos para adultos",
        "ToysNow",
      ],
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/productos/${id}`,
      },
      openGraph: {
        title: `${producto.name} | ToysNow`,
        description: producto.description
          ? producto.description.substring(0, 160) + "..."
          : "Descubre este producto exclusivo en ToysNow",
        images: [imageUrl],
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/productos/${id}`,
        type: "website",
        siteName: "ToysNow",
      },
      twitter: {
        card: "summary_large_image",
        title: `${producto.name} | ToysNow`,
        description: producto.description
          ? producto.description.substring(0, 160) + "..."
          : "Descubre este producto exclusivo en ToysNow",
        images: [imageUrl],
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Error | ToysNow",
      description: "Error al cargar la información del producto.",
    };
  }
}
