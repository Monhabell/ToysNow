// components/productos/SkeletonProductos.jsx
import { Card, Skeleton } from "@heroui/react";

// components/productos/SkeletonProductos.jsx
const SkeletonProductos = ({ isSlider = false, cantidad = 5 }) => {
  const skeletonCard = (
    <div className="w-[200px] space-y-9 p-4 bg-black rounded-lg shadow-md">
      {/* Imagen del producto */}
      <div className="relative overflow-hidden rounded-lg h-24 bg-default-300 animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-shimmer"></div>
      </div>
      
      {/* Contenido del producto */}
      <div className="space-y-3">
        <div className="relative overflow-hidden rounded-lg h-3 w-3/5 bg-default-200 animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-shimmer"></div>
        </div>
        <div className="relative overflow-hidden rounded-lg h-3 w-4/5 bg-default-200 animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-shimmer"></div>
        </div>
        <div className="relative overflow-hidden rounded-lg h-3 w-2/5 bg-default-300 animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-shimmer"></div>
        </div>
      </div>
    </div>
  );

  if (isSlider) {
    return (
      <div className="flex space-x-4 sm:space-x-6 py-4 sm:py-6">
        {Array.from({ length: cantidad }).map((_, index) => (
          <div key={index} className="flex-none">
            {skeletonCard}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: cantidad }).map((_, index) => (
        <div key={index}>
          {skeletonCard}
        </div>
      ))}
    </div>
  );
};

export default SkeletonProductos;