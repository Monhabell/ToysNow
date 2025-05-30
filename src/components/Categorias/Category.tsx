import React, { useState } from "react";
import '../../styles/Category.css'


// Tipos de datos
interface Subcategory {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
  icon: string; // Ruta del ícono
  subcategories: Subcategory[];
}

// Componente principal
const CategoryMenu: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  // Lista de categorías con íconos y subcategorías
  const categories: Category[] = [
    {
      id: 1,
      name: "Aceites",
      icon: "/icons/supermercado.svg",
      subcategories: [
        { id: 101, name: "Frutas" },
        { id: 102, name: "Lácteos" },
        { id: 103, name: "Carnes" },
        { id: 104, name: "Bebidas" },
      ],
    },
    {
      id: 2,
      name: "Retardantes",
      icon: "/icons/ropa.svg",
      subcategories: [
        { id: 201, name: "Hombres" },
        { id: 202, name: "Mujeres" },
        { id: 203, name: "Niños" },
        { id: 204, name: "Accesorios" },
      ],
    },
    
  ];

  return (
    <div >
      <div className="max-w-7xl mx-auto">
        <h1 className="text-1xl mt-3 font-bold text-gold-500 mb-8 text-center border-b-2 border-gold-500 pb-2">
          Nuestras Categorías
        </h1>
        
        {/* Menú de categorías */}
        <div className="category-menu">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category)}
              className={`flex flex-col items-center min-w-[100px] text-center group transition-all duration-300 ${
                selectedCategory?.id === category.id 
                  ? "text-gold-500 transform scale-105" 
                  : "text-gray-300 hover:text-gold-400"
              }`}
            >
              <div className={`w-16 h-16 mb-3 flex items-center justify-center rounded-full transition-all duration-300 ${
                selectedCategory?.id === category.id
                  ? "bg-gold-500/20 border-2 border-gold-500"
                  : "bg-gray-800 border-2 border-gray-700 group-hover:border-gold-400 group-hover:bg-gold-500/10"
              }`}>
                <img
                    src="https://img.freepik.com/fotos-premium/lambe-labios-boca-mujer-labios-sexy-lame-lengua-flor-boca-lamer-chupar-cerca-belleza-labios-naturales-sensual-lamer-abierta-boca-sexy-lame-concepto-lengua-chica-lamer-tulipan_265223-155280.jpg?semt=ais_hybrid&w=740"
                    alt={category.name}
                    className="w-full h-full object-cover rounded-full transition-all duration-300"
                    style={{
                        filter: selectedCategory?.id === category.id 
                        ? "invert(77%) sepia(31%) saturate(1209%) hue-rotate(360deg) brightness(102%) contrast(96%)" 
                        : "invert(100%)"
                    }}
                    />
              </div>
              <span className="text-sm font-medium">{category.name}</span>
            </button>
          ))}
        </div>

        {/* Subcategorías */}
        {selectedCategory && (
          <div className="subCategorias">
            <h2 className="text-2xl font-semibold text-gold-500 mb-4 flex items-center">
              <span className="mr-2">📋</span>
              Subcategorías de {selectedCategory.name}
            </h2>
            <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {selectedCategory.subcategories.map((sub) => (
                <li
                  key={sub.id}
                  className="bg-gray-900 hover:bg-gold-500/20 transition-all duration-300 p-4 rounded-lg text-center border border-gray-800 hover:border-gold-500 cursor-pointer"
                >
                  <span className="text-gray-200 hover:text-gold-400 font-medium">
                    {sub.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        
      </div>
      
      {/* Estilos globales para esta sección */}
      <style jsx global>{`
        .text-gold-500 {
          color: #D4AF37;
        }
        .border-gold-500 {
          border-color: #D4AF37;
        }
        .bg-gold-500/20 {
          background-color: rgba(212, 175, 55, 0.2);
        }
        .hover\:text-gold-400:hover {
          color: #E6C200;
        }
        .hover\:border-gold-400:hover {
          border-color: #E6C200;
        }
        .bg-gold-500/10 {
          background-color: rgba(212, 175, 55, 0.1);
        }
        .border-gold-400 {
          border-color: #E6C200;
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