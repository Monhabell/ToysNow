import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation'
import '../../styles/Category.css';

interface Subcategory {
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
}

interface Category {
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  subcategories: Subcategory[];
}

interface ApiResponse {
  data: Category[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    links: {
      url: string | null;
      label: string;
      active: boolean;
    }[];
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
}

const CategoryMenu: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/categorias'); // Your API endpoint
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data: ApiResponse = await response.json();
        setCategories(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (category: Category) => {
    if (category.subcategories.length === 0) {
      router.push(`/productos?buscar=${encodeURIComponent(category.name)}&categoria=${encodeURIComponent(category.slug)}`);
    } else {
      setSelectedCategory(category);
    }
  };

  const handleSubcategoryClick = (subcategory: Subcategory, category: Category) => {
    router.push(`/productos?buscar=${encodeURIComponent(subcategory.name)}&categoria=${encodeURIComponent(category.slug)}&subcategoria=${encodeURIComponent(subcategory.slug)}`);
  };

  // Default icons mapping for categories without images
  const getCategoryIcon = (categoryName: string) => {
    const iconMap: Record<string, string> = {
      'Plug': '/images/icons/plug.png',
      'Retardantes': '/images/icons/retardantes.png',
      'Aceites': '/images/icons/aceite.png',
      // Add more mappings as needed
    };
    
    return iconMap[categoryName] || '/images/icons/default.png';
  };

  if (loading) {
    return (
      <div className="bg-black text-white py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p>Loading categories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-black text-white py-8 px-4">
        <div className="max-w-7xl mx-auto text-center text-red-500">
          <p>Error loading categories: {error}</p>
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="bg-black text-white py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p>No categories available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black text-white py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gold-600 mb-2 border-b-2 border-redBlack pb-2 inline-block">
            Nuestras Categorías
          </h2>
        </div>

        <div className="category-menu flex flex-wrap justify-center gap-6 mb-2 pt-2">
          {categories.map((category) => (
            <button
              key={category.slug}
              onClick={() => handleCategoryClick(category)}
              className={`cursor-pointer flex flex-col items-center min-w-[120px] text-center group transition-all duration-300 ${
                selectedCategory?.slug === category.slug 
                  ? "text-gold-600 transform scale-110" 
                  : "text-gray-300 hover:text-gold-600"
              }`}
            >
              <div className={`w-20 h-20 mb-3 flex items-center justify-center rounded-full transition-all duration-300 ${
                selectedCategory?.slug === category.slug
                  ? "bg-gold-600 border-2 border-red-600"
                  : "bg-gray-800 border-2 border-gray-700 group-hover:border-gold-500 group-hover:bg-gold-600"
              }`}>
                <img
                  src={category.image || '/images/icons/logoDefaulCategories.png'}
                  alt={category.name}
                  className="rounded-full" 
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
                  key={sub.slug}
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