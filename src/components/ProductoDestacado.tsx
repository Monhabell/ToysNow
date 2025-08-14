import '../styles/ProductDest.css';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface ProductoDestacadoProps {
  slug?: string;
  img: string;
  name: string;
  price?: string;
}

const ProductoDestacado: React.FC<ProductoDestacadoProps> = ({ img, name, price, slug }) => {
  const router = useRouter();

  // separar por "/" img
  const imgParts = img.split('/');
  const lastPart = "https://www.softgenix.space/storage/tenants/2b85d6a6-1059-4929-a8bb-5f3d7ca5c732/images/products/"+imgParts[imgParts.length - 1];


  const getImageUrl = (url: string) => {
    if (!url) return '/images/default.webp';
    if (url.startsWith('http')) return url;
    if (url.startsWith('/images')) return `https://www.softgenix.space/storage/tenants/2b85d6a6-1059-4929-a8bb-5f3d7ca5c732/images/${url}`;
    return `/images/${url}`;
  };

  // Verifica si la imagen es válida antes de renderizar
  const imageUrl = getImageUrl(lastPart);

  return (
     <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-black to-black p-4 shadow-lg border border-amber-600/30 transition-all hover:shadow-amber-500/30">
      <div className="absolute inset-0 rounded-2xl border border-amber-500/30 group-hover:border-amber-400/70 transition-all duration-500 pointer-events-none"></div>
      <div className="relative h-70 mb-4 z-10">
        <Image
          src={imageUrl}
          alt={name}
          fill
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = '/images/default.webp';
          }}
          onClick={() => router.push(`/productos/${slug}`)}
          className="border-amber-600/30 object-cover w-full transition-transform duration-300 group-hover:scale-105 cursor-pointer"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          unoptimized={!imageUrl.startsWith('/')} // Desactiva optimización para imágenes externas
        />
      </div>

      {/* Texto promocional */}
      <div className="text-center text-sm uppercase tracking-wide text-amber-400 font-semibold mb-2">
        ¡Solo por hoy!
      </div>

      {/* Nombre del producto */}
      <h2 className="text-center text-white font-bold text-lg mb-1">
        {name.length > 20 ? `${name.slice(0, 20)}...` : name}
      </h2>

      {/* Etiqueta de producto destacado */}
      <div className="text-center text-xs text-amber-300 italic mb-2">Producto destacado </div>

      {/* Precio */}
      {price && (
        <div className="text-center mt-2">
          <span className="inline-block px-4 py-1 bg-amber-500/10 text-amber-300 border border-amber-500/30 rounded-full font-semibold backdrop-blur-sm shadow-inner">
            ${price.toLocaleString()}
          </span>
        </div>
      )}

      {/* Fondo animado opcional */}
      <div className="absolute -z-10 w-40 h-40 bg-amber-400/10 blur-2xl rounded-full top-0 right-0 group-hover:opacity-20 transition-opacity duration-700"></div>
    </div>
  );
};

export default ProductoDestacado;