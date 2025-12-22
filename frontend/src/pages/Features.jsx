import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const ScrollReveal = ({ children, direction = 'left', className = '' }) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            {
                threshold: 0.2,
                rootMargin: '50px'
            }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, []);

    const getTransformClass = () => {
        if (direction === 'left') return '-translate-x-24';
        if (direction === 'right') return 'translate-x-24';
        return 'translate-y-12';
    };

    return (
        <div
            ref={ref}
            className={`transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-x-0 translate-y-0' : `opacity-0 ${getTransformClass()}`
                } ${className}`}
        >
            {children}
        </div>
    );
};

const Features = () => {
    const { t } = useTranslation();

    const sections = [
        { key: 'concreteFeatures', id: 1, image: '/images/features/concrete_features.jpg' },
        { key: 'pores', id: 2, image: '/images/features/pores.png' },
        { key: 'colorVariation', id: 3, image: '/images/features/color_variation.png' },
        { key: 'aggregate', id: 4, image: '/images/features/aggregate.png' },
        { key: 'textureLines', id: 5, image: '/images/features/texture_lines.png' },
        { key: 'craquelure', id: 6, image: '/images/features/craquelure.png' },
        { key: 'seams', id: 7, image: '/images/features/seams.png' },
        { key: 'protection', id: 8, image: '/images/features/protection.png' }
    ];

    return (
        <div className="pt-48 pb-24 min-h-screen bg-white overflow-x-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="mb-24 text-center">
                    <ScrollReveal direction="up">
                        <h1 className="text-4xl md:text-5xl font-bold font-sans uppercase tracking-widest">
                            {t('featuresPage.title')}
                        </h1>
                    </ScrollReveal>
                </div>

                <div className="space-y-32">
                    {sections.map((section, index) => {
                        const isEven = index % 2 === 0;
                        return (
                            <div key={section.id} className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-16 items-center`}>

                                {/* Text Content */}
                                <div className="flex-1 w-full">
                                    <ScrollReveal direction={isEven ? 'left' : 'right'}>
                                        <h2 className="text-2xl md:text-3xl font-bold font-sans mb-8">
                                            {t(`featuresPage.${section.key}.title`)}
                                        </h2>
                                        <div className="w-16 h-1 bg-black mb-8"></div>
                                        <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                                            {t(`featuresPage.${section.key}.desc`)}
                                        </p>
                                    </ScrollReveal>
                                </div>

                                {/* Image Placeholder or Actual Image */}
                                <div className="flex-1 w-full">
                                    <ScrollReveal direction={isEven ? 'right' : 'left'}>
                                        <div className={`aspect-[4/3] flex items-center justify-center relative overflow-hidden group ${!section.image ? 'bg-gray-100' : ''}`}>
                                            {section.image ? (
                                                <img
                                                    src={section.image}
                                                    alt={t(`featuresPage.${section.key}.title`)}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                />
                                            ) : (
                                                <>
                                                    <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
                                                    <span className="relative z-10 text-gray-400 font-bold uppercase tracking-widest text-xs border border-gray-400 px-4 py-2">
                                                        No Image
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </ScrollReveal>
                                </div>

                            </div>
                        );
                    })}
                </div>

            </div>
        </div>
    );
};

export default Features;
