import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import { ChevronRight } from 'lucide-react';

const Catalog = () => {
    const { t, i18n } = useTranslation();
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [activeCategory, setActiveCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();

    useEffect(() => {
        fetchCategories();
    }, [i18n.language]);

    useEffect(() => {
        fetchProducts();
    }, [activeCategory, i18n.language]);

    const fetchCategories = async () => {
        try {
            const response = await api.get('/categories');
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    // React to URL parameter changes
    useEffect(() => {
        const catSlug = searchParams.get('cat');
        if (categories.length > 0) {
            if (catSlug) {
                // Find category ID by slug (recursive search for subcategories)
                const findIdBySlug = (list) => {
                    for (const item of list) {
                        if (item.slug === catSlug) return item.id;
                        if (item.children && item.children.length > 0) {
                            const found = findIdBySlug(item.children);
                            if (found) return found;
                        }
                    }
                    return null;
                };
                const targetId = findIdBySlug(categories);
                setActiveCategory(targetId); // Sets null if not found (optional: or keep previous?)
            } else {
                setActiveCategory(null);
            }
        }
    }, [searchParams, categories]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const params = activeCategory ? { categoryId: activeCategory } : {};
            const response = await api.get('/products', { params });
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pt-48 pb-16 min-h-screen bg-white">
            <div className="max-w-[1600px] mx-auto px-4 md:px-8">
                <div className="flex flex-col md:flex-row gap-12">

                    {/* Sidebar Filters (Desktop) */}
                    <aside className="w-full md:w-64 flex-shrink-0">
                        <h2 className="font-sans text-xl font-bold uppercase mb-8 pb-4 border-b border-gray-100">
                            {t('nav.catalog')}
                        </h2>
                        <nav className="flex flex-col gap-2">
                            <button
                                onClick={() => setActiveCategory(null)}
                                className={`text-left text-sm uppercase tracking-wide py-2 transition-colors ${activeCategory === null ? 'font-bold text-black pl-2 border-l-2 border-black' : 'text-gray-500 hover:text-black'}`}
                            >
                                All Products
                            </button>
                            {categories.map((cat) => (
                                <div key={cat.id} className="flex flex-col">
                                    <button
                                        onClick={() => setActiveCategory(cat.id)}
                                        className={`text-left text-sm uppercase tracking-wide py-2 transition-colors ${activeCategory === cat.id ? 'font-bold text-black pl-2 border-l-2 border-black' : 'text-gray-500 hover:text-black'}`}
                                    >
                                        {cat.name}
                                    </button>

                                    {/* Subcategories */}
                                    {cat.children && cat.children.length > 0 && (
                                        <div className="pl-4 flex flex-col gap-1 border-l border-gray-100 ml-1 mb-2">
                                            {cat.children.map(sub => (
                                                <button
                                                    key={sub.id}
                                                    onClick={() => setActiveCategory(sub.id)}
                                                    className={`text-left text-xs uppercase tracking-wide py-1.5 transition-colors ${activeCategory === sub.id ? 'font-bold text-black text-red-500' : 'text-gray-400 hover:text-black'}`}
                                                >
                                                    {sub.name}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </nav>
                    </aside>

                    {/* Product Grid */}
                    <main className="flex-1">
                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {[1, 2, 3].map(n => <div key={n} className="bg-gray-100 aspect-square animate-pulse"></div>)}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
                                {products.map((product) => (
                                    <Link key={product.id} to={`/product/${product.id}`} className="group flex flex-col">
                                        {/* Card Image Area */}
                                        <div className="relative aspect-[4/5] bg-concrete-light overflow-hidden mb-4 p-8 flex items-center justify-center">
                                            {product.image ? (
                                                <img
                                                    src={product.image.startsWith('http') ? product.image : `http://localhost:3000${product.image}`}
                                                    alt={product.title}
                                                    className="w-full h-auto object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                                                />
                                            ) : (
                                                <span className="text-gray-300">No Image</span>
                                            )}

                                            {/* Hover Overlay with Button */}
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 flex items-center justify-center">
                                                <span className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 bg-white text-black px-6 py-3 uppercase text-xs font-bold tracking-widest hover:bg-black hover:text-white">
                                                    View Details
                                                </span>
                                            </div>
                                        </div>

                                        {/* Card Info */}
                                        <div className="flex flex-col gap-1">
                                            <div className="flex justify-between items-start">
                                                <h3 className="font-sans font-bold text-black uppercase text-sm leading-tight pr-4">
                                                    {product.title}
                                                </h3>
                                                <ChevronRight size={16} className="text-gray-300 group-hover:text-black transition-colors" />
                                            </div>
                                            {product.price && (
                                                <p className="font-bold text-black text-sm mt-1">{product.price}</p>
                                            )}
                                            <p className="font-sans text-xs text-gray-400 mt-1">
                                                {product.specs?.dimensions || 'STD'}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1 pb-2 border-b border-transparent group-hover:border-black/10 transition-colors inline-block w-full">
                                                {product.category}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Catalog;
