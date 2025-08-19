import { Metadata } from 'next';

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/productoDetalle?slug=${id}`);
    
    if (!response.ok) {
      return {
        title: 'Producto no encontrado | ToysNow',
        description: 'El producto que buscas no está disponible.'
      };
    }

    const result = await response.json();
    const producto = result.data;

    console.log(producto)

    if (!producto) {
      return {
        title: 'Producto no encontrado | ToysNow',
        description: 'El producto que buscas no está disponible.'
      };
    }

    return {
      title: `${producto.name} | ToysNow`,
      description: producto.description 
        ? producto.description.substring(0, 160) + '...'
        : 'Descubre este producto exclusivo en ToysNow. Envío discreto y garantía de calidad.',
      openGraph: {
        title: `${producto.name} | ToysNow`,
        description: producto.description 
          ? producto.description.substring(0, 160) + '...'
          : 'Descubre este producto exclusivo en ToysNow',
        images: producto.images.length > 0 
          ? [`${process.env.NEXT_PUBLIC_BACKEND_URL}/${producto.images[0].url}`]
          : [],
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/productos/${id}`,
        // 👈 Se omite la propiedad type (es opcional)
      },
      twitter: {
        card: 'summary_large_image',
        title: `${producto.name} | ToysNow`,
        description: producto.description 
          ? producto.description.substring(0, 160) + '...'
          : 'Descubre este producto exclusivo en ToysNow',
        images: producto.images.length > 0 
          ? [`${process.env.NEXT_PUBLIC_BACKEND_URL}/${producto.images[0].url}`]
          : []
      }
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Error | ToysNow',
      description: 'Error al cargar la información del producto.'
    };
  }
}