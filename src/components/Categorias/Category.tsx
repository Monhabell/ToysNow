import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation'
import '../../styles/Category.css';
import Image from 'next/image';

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
    <div className="mt-8 bg-gray-900/50 rounded-xl p-6 border border-pink-500/20 sensual-content">
      <div className="max-w-7xl mx-auto">
        <div className="category-menu flex flex-wrap justify-center gap-6  pt-1">
          {categories.map((category) => (
            <button
              key={category.slug}
              onClick={() => handleCategoryClick(category)}
              className={`  cursor-pointer flex flex-col items-center min-w-[20px] text-center group transition-all duration-300 ${
                selectedCategory?.slug === category.slug 
                  ? "text-gold-600 transform scale-110" 
                  : "text-gray-300 hover:text-gold-600"
              }`}
            >
              
              <span className=" holographic-card text-lg font-medium">{category.name}</span>
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
                  className="holographic-card "
                >
                  <span className="text-gray-200 hover:text-gold-400 font-medium holographic-card">
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