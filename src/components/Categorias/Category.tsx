'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Category } from './types';
import '../../styles/Category.css'

export default function CategoryMenu() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/categorias');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const result = await response.json();
                setCategories(result.data || result);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Error desconocido');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return (
        <div className="min-h-[300px] flex items-center justify-center bg-black text-gold-500">
            <div className="animate-pulse">Cargando categorías...</div>
        </div>
    );
    
    if (error) return (
        <div className="min-h-[300px] flex items-center justify-center bg-black text-red-500">
            Error: {error}
        </div>
    );

    return (
        <div className="category">
            <div className="container mx-auto px-4 py-8">
                <h2 className="text-2xl font-semibold font-bold mb-8 text-gold-500 border-b border-gold-500 pb-2">
                    Nuestras Categorías
                </h2>
                
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Lista de categorías principales */}
                    <div className="contenedor-categorias">
                        <ul className="lista-categorias">
                            {categories.map((category) => (
                            <li key={category.id}>
                                <button
                                onClick={() => setSelectedCategory(category)}
                                className={`button-category ${selectedCategory?.id === category.id ? 'selected' : ''}`}
                                >
                                {category.name}
                                {category.subcategory_id?.length > 0 && (
                                    <span>›</span>
                                )}
                                </button>
                            </li>
                            ))}
                        </ul>
                    </div>

                    {/* Panel de subcategorías */}
                    <div className="panel_SubCategory">
                        {selectedCategory ? (
                            <>
                                <h3 className="text-xl font-serif font-bold mb-6 text-gold-500 flex items-center">
                                    <button 
                                        onClick={() => setSelectedCategory(null)}
                                        className="mr-4 hover:text-gold-300"

                                    >
                                        ‹
                                    </button>
                                    {selectedCategory.name}
                                </h3>
                                
                                {selectedCategory.subcategory_id?.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {selectedCategory.subcategory_id.map((subcategory) => (
                                            <Link
                                                key={subcategory.id}
                                                href={`/productos?buscar=${subcategory.name}`}
                                                className="block p-4 border border-gold-500/20 rounded-lg hover:bg-gold-500/10 hover:border-gold-500/40 transition-all group"
                                            >
                                                <h4 className="font-medium text-gold-400 group-hover:text-gold-300">
                                                    {subcategory.name}
                                                </h4>
                                                <p className="text-sm text-gray-400 mt-1">
                                                    Ver productos ›
                                                </p>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                        <p>No hay subcategorías disponibles</p>
                                        <Link 
                                            href={`/${selectedCategory.slug}`}
                                            className="mt-4 px-6 py-2 bg-gold-500 text-black rounded-lg hover:bg-gold-600 transition-colors"
                                        >
                                            Ver todos los productos
                                        </Link>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <div className="text-center text-gray-500">
                                    <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    <p className="mt-4">Selecciona una categoría para ver sus subcategorías</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}