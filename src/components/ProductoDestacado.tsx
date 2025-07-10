import '../styles/ProductDest.css';
import { useRouter } from 'next/navigation';
import Image from 'next/image';


interface ProductoDestacadoProps {
  id: string | number;
  img: string;
  name: string;
  price?: string;
}

const ProductoDestacado: React.FC<ProductoDestacadoProps> = ({ img, name, price, id }) => {
  const router = useRouter();

  return (
    <div className="group relative   overflow-hidden rounded-2xl bg-gradient-to-br from-black  to-black p-4 shadow-lg border border-amber-600/30 transition-all hover:shadow-amber-500/30">
      
      {/* Borde dorado animado */}
      <div className="absolute inset-0 rounded-2xl border border-amber-500/30 group-hover:border-amber-400/70 transition-all duration-500 pointer-events-none"></div>
      
      {/* Imagen del producto */}
      <div className="flex justify-center items-center mb-4 relative z-10">
        <Image
          src={img}
          onError={(e) => {
            const target = e.target as HTMLImageElement;  
            target.onerror = null;
            target.src = '/images/default.png';
          }}
          alt={name}
          onClick={() => router.push(`/detalle/${id}`)}
          className="border-amber-600/30 object-cover w-full  transition-transform duration-300 group-hover:scale-105 cursor-pointer"
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
      <div className="text-center text-xs text-amber-300 italic mb-2">Producto destacado</div>

      {/* Precio */}
      {price && (
        <div className="text-center mt-2">
          <span className="inline-block px-4 py-1 bg-amber-500/10 text-amber-300 border border-amber-500/30 rounded-full font-semibold backdrop-blur-sm shadow-inner">
            ${price.toLocaleString()}
          </span>
        </div>
      )}

      {/* Fondo animado opcional (más sutil) */}
      <div className="absolute -z-10 w-40 h-40 bg-amber-400/10 blur-2xl rounded-full top-0 right-0 group-hover:opacity-20 transition-opacity duration-700"></div>
    </div>
  );
};

export default ProductoDestacado;
