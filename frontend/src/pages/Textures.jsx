import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';

const Textures = () => {
    const { t, i18n } = useTranslation();
    const [activeTab, setActiveTab] = useState('all');
    const [textures, setTextures] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTextures = async () => {
            try {
                const res = await api.get('/textures');
                setTextures(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchTextures();
    }, []);

    const tabs = [
        { id: 'all', label: 'All Finishes' },
        { id: 'standard', label: 'Standard Colors' },
        { id: 'exposed', label: 'Exposed Aggregate' },
        { id: 'terrazzo', label: 'Terrazzo' }
    ];

    const filtered = activeTab === 'all' ? textures : textures.filter(tx => tx.type === activeTab);

    return (
        <div className="pt-48 pb-24 min-h-screen bg-white">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <h1 className="font-sans text-4xl md:text-5xl font-bold uppercase tracking-widest mb-6">
                        {t('texturesPage.title')}
                    </h1>
                    <p className="text-gray-500 text-lg leading-relaxed mb-8">
                        {t('texturesPage.description')}
                    </p>

                    {/* Contact Buttons */}
                    <div className="flex justify-center gap-4">
                        <a
                            href="tel:+994503403938"
                            className="bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors uppercase tracking-wider text-sm"
                        >
                            {t('texturesPage.contact')}
                        </a>
                        <a
                            href="https://wa.me/994503403938"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-[#25D366] text-white px-8 py-3 rounded-full font-medium hover:bg-[#20bd5a] transition-colors uppercase tracking-wider text-sm"
                        >
                            {t('texturesPage.whatsapp')}
                        </a>

                    </div>
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-8 py-3 text-sm font-bold uppercase tracking-wider transition-all duration-300 border-b-2 ${activeTab === tab.id
                                ? 'border-black text-black'
                                : 'border-transparent text-gray-400 hover:text-black hover:border-gray-200'
                                }`}
                        >
                            {t(`texturesPage.tabs.${tab.id}`)}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {filtered.map(item => (
                        <div key={item.id} className="group cursor-pointer">
                            <div className="aspect-square bg-gray-100 mb-4 overflow-hidden rounded-sm relative">
                                {item.imagePath ? (
                                    <img
                                        src={item.imagePath.startsWith('http') ? item.imagePath : `http://localhost:3000${item.imagePath}`}
                                        alt={item.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                ) : (
                                    <div
                                        className="w-full h-full transition-transform duration-700 group-hover:scale-110 bg-gray-200 flex items-center justify-center text-gray-400"
                                    >
                                        {t('texturesPage.no_image')}
                                    </div>
                                )}

                                {/* Overlay Effect */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                            </div >
                            <h3 className="font-sans font-bold text-center uppercase tracking-wide text-sm group-hover:text-red-600 transition-colors">
                                {item.translations?.find(t => t.locale === i18n.language)?.name || item.translations?.find(t => t.locale === 'az')?.name || item.name}
                            </h3>
                        </div >
                    ))}
                </div>

                {/* Divider */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-32">
                    <div className="border-t border-gray-200"></div>
                </div>

                {/* Factures Section (Selection of Texture) */}
                <div className="mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start mb-24">
                        <div>
                            <h2 className="text-3xl font-bold font-sans">{t('factures.title')}</h2>
                        </div>
                        <div>
                            <p className="text-gray-600 leading-relaxed mb-8 text-sm md:text-base">
                                {t('factures.description')}
                            </p>
                            <a
                                href="https://wa.me/994503403938"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block bg-black text-white px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
                            >
                                {t('factures.orderSamples')}
                            </a>
                        </div>
                    </div>

                    <div className="mb-12">
                        <h3 className="text-2xl font-bold font-sans mb-12">{t('factures.concreteTextures')}</h3>
                        {/* Smaller cards wrapper - max-w-2xl */}
                        <div className="max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Smooth Content */}
                            <div className="group">
                                <div className="aspect-[4/3] bg-gray-100 overflow-hidden mb-4 relative">
                                    <img
                                        src="/images/textures/smooth_concrete.png"
                                        alt={t('factures.smooth')}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 grayscale hover:grayscale-0"
                                    />
                                </div>
                                <span className="bg-black text-white px-4 py-2 text-xs font-bold uppercase tracking-wider inline-block">
                                    {t('factures.smooth')}
                                </span>
                            </div>

                            {/* Porous Content */}
                            <div className="group">
                                <div className="aspect-[4/3] bg-gray-100 overflow-hidden mb-4 relative">
                                    <img
                                        src="/images/textures/porous_concrete.png"
                                        alt={t('factures.porous')}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 grayscale hover:grayscale-0"
                                    />
                                </div>
                                <span className="bg-black text-white px-4 py-2 text-xs font-bold uppercase tracking-wider inline-block">
                                    {t('factures.porous')}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Note */}
                <div className="mt-16 pt-8 border-t border-gray-100 text-center text-xs text-gray-400 uppercase tracking-widest">
                    {t('texturesPage.disclaimer')}
                </div>

            </div >
        </div >
    );
};

export default Textures;
