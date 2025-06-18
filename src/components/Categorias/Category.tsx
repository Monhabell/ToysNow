import React, { useState } from "react";
import { useRouter } from 'next/navigation'
import '../../styles/Category.css';

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

const CategoryMenu: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const router = useRouter();

  const categories: Category[] = [
    {
      id: 1,
      name: "Vibradores",
      icon: "/images/icons/vibrador.png",
      subcategories: [],
    },
    {
      id: 2,
      name: "Lencería",
      icon: "/images/icons/lenceria.png",
      subcategories: [
        { id: 201, name: "Conjuntos" },
        { id: 202, name: "Bodys" },
        { id: 203, name: "Medias" },
        { id: 201, name: "Conjuntos" },
        { id: 202, name: "Bodys" },
        { id: 203, name: "Medias" }
      ],
    },
    {
      id: 3,
      name: "Aceites",
      icon: "/images/icons/aceite.png",
      subcategories: [],
    },
    {
      id: 4,
      name: "Fetiches",
      icon: "/images/icons/fetiche.png",
      subcategories: [],
    },
    {
      id: 5,
      name: "Relaciones",
      icon: "/images/icons/sexo.png",
      subcategories: [],
    },
  ];

  const handleCategoryClick = (category: Category) => {
    if (category.subcategories.length === 0) {
      router.push(`/productos?buscar=${encodeURIComponent(category.name)}`);
    } else {
      setSelectedCategory(category);
    }
  };

  const handleSubcategoryClick = (subcategory: Subcategory, category: Category) => {
    router.push(`/productos?buscar=${encodeURIComponent(subcategory.name)}&categoria=${encodeURIComponent(category.name)}`);
  };

  return (
    <div className="bg-black text-white py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gold-600  mb-2 border-b-2 border-redBlack pb-2 inline-block">
            Nuestras Categorías
          </h2>
        </div>

        <div className="category-menu flex flex-wrap justify-center gap-6 mb-2 pt-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category)}
              className={`cursor-pointer flex flex-col items-center min-w-[120px] text-center group transition-all duration-300 ${
                selectedCategory?.id === category.id 
                  ? "text-gold-600 transform scale-110" 
                  : "text-gray-300 hover:text-gold-600"
              }`}
            >
              <div className={`w-20 h-20 mb-3 flex items-center justify-center rounded-full transition-all duration-300 ${
                selectedCategory?.id === category.id
                  ? "bg-gold-600 border-2 border-red-600"
                  : "bg-gray-800 border-2 border-gray-700 group-hover:border-gold-500 group-hover:bg-gold-600"
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

        {selectedCategory && selectedCategory.subcategories.length > 0 && (
          <div className="subCategorias animate-fadeIn">
            <h2 className="text-2xl font-semibold text-gold-500 mb-6 flex items-center justify-center">
              <span className="mr-2">🔥</span>
              Explora {selectedCategory.name}
              <span className="ml-2">🔥</span>
            </h2>
            <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {selectedCategory.subcategories.map((sub) => (
                <li
                  key={sub.id}
                  onClick={() => handleSubcategoryClick(sub, selectedCategory)}
                  className="bg-gray-900 hover:bg-gold-500 transition-all duration-300 ml-5 p-4 rounded-lg text-center border border-gray-800 hover:border-gold-500 cursor-pointer transform hover:scale-105"
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
    </div>
  );
};

export default CategoryMenu;
 