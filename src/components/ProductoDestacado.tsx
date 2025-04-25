import '../styles/ProductDest.css';


interface ProductoDestacadoProps {
  img: string;
  name: string;
  price?: string; // Propiedad opcional para el precio
}

const ProductoDestacado: React.FC<ProductoDestacadoProps> = ({ img, name, price }) => {
  return (
    <div className="relative productDestacado overflow-hidden rounded-2xl group h-full w-full">
      {/* Fondo dorado con efecto de profundidad */}
      <div className=""></div>

      {/* Efectos de luz dinámicos */}
      <div className="absolute w-72 h-72 bg-amber-300 rounded-full blur-[100px] opacity-20 -left-1/4 -top-1/4 group-hover:opacity-40 group-hover:-left-1/3 transition-all duration-700"></div>
      <div className="absolute w-64 h-64 bg-amber-200 rounded-full blur-[80px] opacity-10 -right-1/4 -bottom-1/4 group-hover:opacity-30 group-hover:-right-1/3 transition-all duration-700 delay-100"></div>

      {/* Contenedor principal */}
      <div className="">
        {/* Marco dorado con efecto 3D */}
        <div className="absolute inset-2 border-4 border-transparent group-hover:border-amber-300/50 rounded-xl transition-all duration-500 shadow-[0_0_30px_rgba(202,138,4,0.3)] group-hover:shadow-[0_0_40px_rgba(202,138,4,0.5)]"></div>

        {/* Contenedor de la imagen con efecto flotante */}
        <div className="relative z-20">
          <div className='title-Oferta'>
            <h1 className='of-day'>Oferta del dia</h1>
          </div>

          <img
            src={img}
            alt={name}
            className=""
          />

          {/* Información del producto */}
          <div className="Name-Of">
            <span >
              {name}
            </span>
          </div>
          
          <div className='price-of'>
            {price && (
              <span className="inline-block px-4 py-1.5 bg-black/90 text-amber-400 font-bold rounded-full  backdrop-blur-sm border border-amber-800/50 mt-1">
                ${price.toLocaleString('en-CO', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
              </span>
            )}
          </div>
          

        </div>

        
      </div>

      {/* Efecto de partículas doradas (opcional) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-amber-400 rounded-full opacity-20"
            style={{
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 10 + 5}s infinite ${Math.random() * 5}s`
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default ProductoDestacado;