import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Layers, Box, Armchair, Grid2x2, CircleDot, MapPin, Lamp, Flame,
    Flower2, Maximize, Gem, Feather, Mountain, Grip, Circle,
    ChevronLeft, ChevronRight, Maximize2
} from 'lucide-react';
import api from '../api/axios';
import { useTranslation } from 'react-i18next';
import ProjectCarousel from '../components/ProjectCarousel';

// Icon mapping helper
const getIcon = (slug) => {
    if (!slug) return <Box size={48} strokeWidth={1} />;

    // Normalize slug (remove -az suffix if present)
    const normalized = slug.replace(/-az$/, '');

    switch (normalized) {
        case 'concrete-panels': return <Layers size={48} strokeWidth={1} />;
        case 'concrete-planters': return <Flower2 size={48} strokeWidth={1} />;
        case 'concrete-benches': return <Armchair size={48} strokeWidth={1} />;
        case 'large-format-slabs': return <Maximize size={48} strokeWidth={1} />;
        case 'landscape-sculptures': return <Gem size={48} strokeWidth={1} />;
        case 'bollards': return <MapPin size={48} strokeWidth={1} />;
        case 'street-lights': return <Lamp size={48} strokeWidth={1} />;
        case 'fire-pits': return <Flame size={48} strokeWidth={1} />;
        case 'fiber-panels': return <Feather size={48} strokeWidth={1} />;
        case 'relief-panels': return <Mountain size={48} strokeWidth={1} />;
        case 'perforated-panels': return <Grip size={48} strokeWidth={1} />;
        case 'curved-panels': return <Circle size={48} strokeWidth={1} />;
        default: return <Box size={48} strokeWidth={1} />;
    }
};

const Home = () => {
    const { t, i18n } = useTranslation();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [categories, setCategories] = useState([]);
    const [projects, setProjects] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        api.get('/categories')
            .then(res => {
                setCategories(res.data);
            })
            .catch(err => console.error(err));

        // Fetch Projects for Home Page (limit 3 ideally, but getAll is fine for now)
        api.get('/projects')
            .then(res => {
                setProjects(res.data);
            })
            .catch(err => console.error('Failed to fetch projects', err));
    }, [i18n.language]);

    const [slides, setSlides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [initAnimation, setInitAnimation] = useState(false);

    useEffect(() => {
        const fetchSlides = async () => {
            try {
                const res = await api.get('/hero-slides');
                if (res.data && res.data.length > 0) {
                    setSlides(res.data);
                } else {
                    // Fallback slides if none from API
                    setSlides([
                        {
                            id: 1,
                            imagePath: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?q=80&w=2669&auto=format&fit=crop',
                            translations: [
                                { locale: 'en', title: 'MAKI', subtitle: 'COLLECTION' },
                                { locale: 'az', title: 'MAKI', subtitle: 'KOLLEKSİYA' },
                                { locale: 'ru', title: 'MAKI', subtitle: 'КОЛЛЕКЦИЯ' }
                            ]
                        },
                        {
                            id: 2,
                            imagePath: 'https://images.unsplash.com/photo-1598337770857-e17578a48b8b?q=80&w=2600&auto=format&fit=crop',
                            translations: [
                                { locale: 'en', title: 'URBAN', subtitle: 'CONCRETE' },
                                { locale: 'az', title: 'ŞƏHƏR', subtitle: 'BETON' },
                                { locale: 'ru', title: 'УРБАН', subtitle: 'БЕТОН' }
                            ]
                        }
                    ]);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
                // Trigger animation shortly after loading finishes
                setTimeout(() => setInitAnimation(true), 100);
            }
        };
        fetchSlides();
    }, []);

    useEffect(() => {
        if (slides.length === 0) return;
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 8000);
        return () => clearInterval(timer);
    }, [slides]);

    // Helper for image URL
    const getImageUrl = (path) => {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        return `http://localhost:3000${path}`;
    };

    if (loading) {
        return <div className="h-[90vh] bg-gray-900 flex items-center justify-center text-white">Loading...</div>;
    }

    return (
        <div className="flex flex-col min-h-screen bg-white">
            {/* Hero Slider */}
            <section className="relative h-[90vh] flex items-center overflow-hidden bg-gray-900">
                {slides.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'
                            }`}
                    >
                        <div
                            className="absolute inset-0 bg-cover bg-center transform scale-105 transition-transform duration-[15000ms]"
                            style={{
                                backgroundImage: `url(${slide.imagePath?.startsWith('http') ? slide.imagePath : `http://localhost:3000${slide.imagePath}`})`,
                                transform: index === currentSlide && initAnimation ? 'scale(1.1)' : 'scale(1.0)'
                            }}
                        ></div>
                        <div className="absolute inset-0 bg-black/30"></div>
                    </div>
                ))}

                <div className="relative z-10 w-full max-w-[1600px] mx-auto px-4 md:px-8 pt-32 md:pt-0">
                    <div className="max-w-4xl">
                        {slides.length > 0 && (
                            <h1 key={currentSlide} className="font-sans font-medium text-white text-6xl md:text-8xl leading-none tracking-tight mb-16 animate-fade-in-up drop-shadow-lg">
                                {slides[currentSlide].translations?.find(t => t.locale === i18n.language)?.title || slides[currentSlide].translations?.find(t => t.locale === 'az')?.title || 'Title'} <br />
                                <span className="block mt-4 text-2xl md:text-3xl font-light tracking-[0.2em] opacity-90">
                                    {slides[currentSlide].translations?.find(t => t.locale === i18n.language)?.subtitle || slides[currentSlide].translations?.find(t => t.locale === 'az')?.subtitle || 'Subtitle'}
                                </span>
                            </h1>
                        )}

                        <Link
                            to="/catalog"
                            className="inline-flex items-center gap-4 text-white uppercase tracking-widest text-sm hover:translate-x-2 transition-transform duration-300 group font-bold"
                        >
                            <div className="w-12 h-[1px] bg-white group-hover:w-20 transition-all duration-300"></div>
                            {t('hero.cta')}
                        </Link>
                    </div>

                    <div className="absolute bottom-8 left-8 md:left-8 flex items-center gap-4 text-white font-sans text-sm">
                        <span>0{currentSlide + 1}</span>
                        <div className="w-16 h-[1px] bg-white/50 relative">
                            <div
                                className="absolute top-0 left-0 h-full bg-white transition-all duration-5000 ease-linear"
                                style={{ width: '100%' }}
                            ></div>
                        </div>
                        <span>0{slides.length}</span>
                    </div>

                    <div className="absolute bottom-8 right-8 flex gap-4 text-white">
                        <button
                            onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
                            className="p-3 border border-white/20 hover:bg-white hover:text-black transition-all rounded-full"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
                            className="p-3 border border-white/20 hover:bg-white hover:text-black transition-all rounded-full"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </section>

            {/* Directions Grid (Направления) - Flex Wrap for robustness */}
            <section className="py-20 max-w-6xl mx-auto px-4 md:px-8 w-full">
                <h2 className="font-sans text-4xl font-bold mb-12 text-black uppercase pl-4 border-l-4 border-black">
                    {t('nav.catalog')}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {categories.map((cat) => (
                        <Link
                            key={cat.id}
                            to={`/catalog?cat=${cat.slug}`}
                            className="group relative h-[280px] overflow-hidden block shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 bg-gray-900"
                        >
                            {/* Background Image */}
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                style={{ backgroundImage: `url(${getImageUrl(cat.imagePath)})` }}
                            >
                                {/* Gradient Overlay for Depth */}
                                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/80 opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
                            </div>

                            {/* Content */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10 p-4">
                                {/* Icon */}
                                <div className="mb-4 p-3 border-[1.5px] border-white/70 rounded-full group-hover:border-white group-hover:bg-white/10 group-hover:scale-110 transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.3)] backdrop-blur-[2px]">
                                    {React.cloneElement(getIcon(cat.slug), { size: 32 })}
                                </div>

                                <h3 className="font-sans font-bold text-lg uppercase tracking-widest text-center mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                                    {cat.name}
                                </h3>

                                {/* Hover Button */}
                                <div className="absolute bottom-12 opacity-0 translate-y-8 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-75">
                                    <span className="border-2 border-white px-8 py-2 uppercase text-[11px] font-bold tracking-widest hover:bg-white hover:text-black transition-colors shadow-lg">
                                        {t('homePage.viewCatalog', 'View Catalog')}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* PROJECTS SECTION (New) */}
            <section className="pb-20 pt-0 bg-white">
                <div className="max-w-6xl mx-auto px-4 md:px-8">
                    <h2 className="font-sans text-4xl font-bold mb-16 text-black uppercase pl-4 border-l-4 border-black">
                        {t('projectsPage.title', 'OUR PROJECTS')}
                    </h2>

                    <div className="space-y-40">
                        {projects.map((project, index) => {
                            const translation = project.translations.find(t => t.locale === i18n.language) || {};
                            const title = translation.title || 'Untitled Project';
                            const description = translation.description || '';
                            const images = project.images || [];

                            return (
                                <motion.div
                                    key={project.id}
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    transition={{ duration: 0.8 }}
                                    className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-16 items-center`}
                                >
                                    {/* Project Info */}
                                    <div className="lg:w-1/3 space-y-8">
                                        <h3 className="text-4xl font-sans font-bold leading-tight text-gray-900">
                                            {title}
                                        </h3>
                                        <div className="h-px w-12 bg-gray-300"></div>
                                        <p className="text-gray-600 text-lg leading-relaxed font-light font-sans">
                                            {description}
                                        </p>
                                    </div>

                                    {/* Project Slider (Carousel) */}
                                    <div className="lg:w-2/3 w-full">
                                        <ProjectCarousel
                                            images={images}
                                            onMaximize={(img) => setSelectedImage(img)}
                                        />
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                    <div className="text-center mt-20">
                        <Link to="/projects" className="inline-block border-2 border-black text-black px-12 py-3 rounded-full hover:bg-black hover:text-white transition-all font-bold tracking-widest uppercase">
                            {t('homePage.viewAllProjects', 'View All Projects')}
                        </Link>
                    </div>
                </div>
            </section>

            {/* Lightbox Modal (Shared) */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] bg-white/95 flex items-center justify-center p-4 backdrop-blur-md font-sans"
                        onClick={() => setSelectedImage(null)}
                    >
                        <button className="absolute top-8 right-8 text-gray-800 hover:text-black transition-colors p-2 bg-gray-100 rounded-full">
                            <Maximize2 size={24} className="rotate-45" />
                        </button>
                        <motion.img
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            src={selectedImage}
                            alt="Project Fullscreen"
                            className="max-w-full max-h-[90vh] object-contain shadow-2xl rounded-lg"
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <section className="py-24 px-4 bg-white text-center border-t border-gray-100">
                <div className="max-w-3xl mx-auto">
                    <h2 className="font-sans text-4xl md:text-5xl font-medium mb-8 text-black">
                        {t('homePage.aboutTitle', 'ProTerra')}
                    </h2>
                    <p className="text-gray-500 text-lg font-light leading-relaxed">
                        {t('homePage.aboutText', 'We create unique architectural forms...')}
                    </p>
                </div>
            </section>
        </div>
    );
};

export default Home;
