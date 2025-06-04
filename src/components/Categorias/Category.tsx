import React, { useState } from "react";
import '../../styles/Category.css';

// Tipos de datos
interface Subcategory {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
  icon: string;
  subcategories: Subcategory[];
}

// Componente principal
const CategoryMenu: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  // Lista de categorías actualizada para sex shop
  const categories: Category[] = [
    {
      id: 1,
      name: "Juguetes",
      icon: "/icons/vibrador.svg",
      subcategories: [
        { id: 101, name: "Vibradores" },
        { id: 102, name: "Anillos" },
        { id: 103, name: "Consoladores" },
        { id: 104, name: "Para parejas" },
      ],
    },
    {
      id: 2,
      name: "Lencería",
      icon: "/icons/lenceria.svg",
      subcategories: [
        { id: 201, name: "Conjuntos" },
        { id: 202, name: "Bodys" },
        { id: 203, name: "Medias" },
        { id: 204, name: "Corsés" },
      ],
    },
    {
      id: 3,
      name: "Aceites",
      icon: "/icons/aceite.svg",
      subcategories: [
        { id: 301, name: "Masajes" },
        { id: 302, name: "Sensuales" },
        { id: 303, name: "Comestibles" },
        { id: 304, name: "Calientes" },
      ],
    },
    {
      id: 4,
      name: "Fetiches",
      icon: "/icons/fetiche.svg",
      subcategories: [
        { id: 401, name: "Bondage" },
        { id: 402, name: "Fustas" },
        { id: 403, name: "Máscaras" },
        { id: 404, name: "Vendas" },
      ],
    },
    {
      id: 5,
      name: "Relaciones",
      icon: "/icons/pareja.svg",
      subcategories: [
        { id: 501, name: "Preservativos" },
        { id: 502, name: "Lubricantes" },
        { id: 503, name: "Juegos" },
        { id: 504, name: "Posiciones" },
      ],
    },
  ];

  return (
    <div className="bg-black text-white py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Título inspirado en la imagen */}
        <div className="text-center mb-8">
                
          <h2 className="text-3xl font-bold text-gold-600  mb-2 border-b-2 border-pink-500 pb-2 inline-block">
            Nuestras Categorías
          </h2>
        </div>
        
        {/* Menú de categorías */}
        <div className="category-menu flex flex-wrap justify-center gap-6 mb-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category)}
              className={`flex flex-col items-center min-w-[120px] text-center group transition-all duration-300 ${
                selectedCategory?.id === category.id 
                  ? "text-pink-500 transform scale-110" 
                  : "text-gray-300 hover:text-pink-400"
              }`}
            >
              <div className={`w-20 h-20 mb-3 flex items-center justify-center rounded-full transition-all duration-300 ${
                selectedCategory?.id === category.id
                  ? "bg-pink-500/20 border-2 border-pink-500"
                  : "bg-gray-800 border-2 border-gray-700 group-hover:border-pink-400 group-hover:bg-pink-500/10"
              }`}>
                <img
                  src={category.icon}
                  alt={category.name}
                  className="w-12 h-12 object-contain transition-all duration-300"
                  style={{
                    filter: selectedCategory?.id === category.id 
                    ? "invert(77%) sepia(31%) saturate(1209%) hue-rotate(300deg) brightness(102%) contrast(96%)" 
                    : "invert(100%)"
                  }}
                />
              </div>
              <span className="text-lg font-medium">{category.name}</span>
            </button>
          ))}
        </div>

        {/* Subcategorías */}
        {selectedCategory && (
          <div className="subCategorias animate-fadeIn">
            <h2 className="text-2xl font-semibold text-pink-500 mb-6 flex items-center justify-center">
              <span className="mr-2">🔥</span>
              Explora {selectedCategory.name}
              <span className="ml-2">🔥</span>
            </h2>
            <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {selectedCategory.subcategories.map((sub) => (
                <li
                  key={sub.id}
                  className="bg-gray-900 hover:bg-pink-500/20 transition-all duration-300 p-4 rounded-lg text-center border border-gray-800 hover:border-pink-500 cursor-pointer transform hover:scale-105"
                >
                  <span className="text-gray-200 hover:text-pink-400 font-medium">
                    {sub.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      {/* Estilos globales actualizados */}
      <style jsx global>{`
        .text-pink-500 {
          color: #EC4899;
        }
        .border-pink-500 {
          border-color: #EC4899;
        }
        .bg-pink-500/20 {
          background-color: rgba(236, 72, 153, 0.2);
        }
        .hover\:text-pink-400:hover {
          color: #F472B6;
        }
        .hover\:border-pink-400:hover {
          border-color: #F472B6;
        }
        .bg-pink-500/10 {
          background-color: rgba(236, 72, 153, 0.1);
        }
        .border-pink-400 {
          border-color: #F472B6;
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default CategoryMenu;