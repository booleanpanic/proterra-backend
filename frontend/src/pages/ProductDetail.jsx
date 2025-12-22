import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { i18n } = useTranslation();
    const [product, setProduct] = useState(null);
    const [activeImage, setActiveImage] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const response = await api.get(`/products/${id}`);
                console.log('Product Data:', response.data);
                setProduct(response.data);
                if (response.data.images && response.data.images.length > 0) {
                    setActiveImage(response.data.images[0]);
                }
            } catch (error) {
                console.error("Failed to fetch product", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id, i18n.language]);

    if (loading) return <div className="pt-48 text-center">Loading...</div>;
    if (!product) return <div className="pt-48 text-center">Product not found.</div>;

    return (

        <div className="pt-44 pb-20 min-h-screen bg-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <button
                    onClick={() => navigate(-1)}
                    className="mb-8 flex items-center gap-2 text-gray-500 hover:text-black transition-colors uppercase text-sm font-medium"
                >
                    &larr; Back to Catalog
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                    {/* Image Gallery */}
                    <div className="space-y-4">
                        <div className="aspect-[4/3] bg-gray-100 overflow-hidden rounded-sm">
                            {activeImage ? (
                                <img
                                    src={activeImage}
                                    alt={product.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                            )}
                        </div>
                        {product.images && product.images.length > 1 && (
                            <div className="grid grid-cols-6 gap-3">
                                {product.images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImage(img)}
                                        className={`aspect-square border-2 rounded-sm overflow-hidden ${activeImage === img ? 'border-black' : 'border-transparent hover:border-gray-300'}`}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-2 leading-tight">{product.title}</h1>
                        <p className="text-sm text-gray-500 font-sans mb-6">CODE: {product.code}</p>

                        {/* Price */}
                        {product.price && (
                            <p className="text-2xl font-bold text-black mb-6">{product.price}</p>
                        )}

                        <div className="prose prose-base text-gray-600 mb-8 max-w-none leading-relaxed">
                            <p>{product.description}</p>
                        </div>

                        {/* Specs Table */}
                        <div className="border border-gray-200 rounded-sm overflow-hidden mb-8">
                            <table className="min-w-full divide-y divide-gray-200">
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {product.specs?.dimensions && (
                                        <tr>
                                            <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50 w-1/3">Dimensions</td>
                                            <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{product.specs.dimensions}</td>
                                        </tr>
                                    )}
                                    {product.specs?.weight && (
                                        <tr>
                                            <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">Weight</td>
                                            <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{product.specs.weight}</td>
                                        </tr>
                                    )}
                                    {product.specs?.material && (
                                        <tr>
                                            <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">Material</td>
                                            <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{product.specs.material}</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex gap-4">
                            <a
                                href={`mailto:sales@proterra.az?subject=Quote Request: ${product.title}&body=Hello, I am interested in ${product.title} (Code: ${product.code}). Please provide a quote.`}
                                className="flex-1 bg-black text-white py-4 px-6 font-medium hover:bg-gray-800 transition-colors uppercase tracking-wider text-sm flex items-center justify-center text-center"
                            >
                                Request Quote
                            </a>
                            <a
                                href={`https://wa.me/994503403938?text=${encodeURIComponent(`Hello, I am interested in ${product.title} (Code: ${product.code}).`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 border border-black text-black py-4 px-6 font-medium hover:bg-gray-50 transition-colors uppercase tracking-wider text-sm flex items-center justify-center gap-2 text-center"
                            >
                                WhatsApp
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
