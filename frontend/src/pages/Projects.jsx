import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import api from '../api/axios';
import ProjectCarousel from '../components/ProjectCarousel';

const Projects = () => {
    const { t, i18n } = useTranslation();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null); // For fullscreen lightbox

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await api.get('/projects');
                setProjects(res.data);
            } catch (err) {
                console.error('Failed to fetch projects', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-gray-400 font-sans text-xl animate-pulse">PROTERRA...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white text-gray-900 pt-48 pb-20 font-sans">
            <div className="container mx-auto px-6 max-w-7xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="mb-24 text-center"
                >
                    <h1 className="text-4xl md:text-6xl font-sans font-medium mb-6 tracking-wide text-gray-900 uppercase">
                        {t('projectsPage.title', 'OUR PROJECTS')}
                    </h1>
                    <div className="w-24 h-0.5 bg-gray-300 mx-auto rounded-full"></div>
                </motion.div>

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
                                    <h2 className="text-4xl font-sans font-bold leading-tight text-gray-900">
                                        {title}
                                    </h2>
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

                    {projects.length === 0 && (
                        <div className="text-center text-gray-400 py-20 font-sans">
                            {t('projectsPage.noProjects', 'No projects added yet.')}
                        </div>
                    )}
                </div>
            </div>

            {/* Lightbox Modal */}
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
                            <Maximize2 size={24} className="rotate-45" /> {/* Use rotate to make generic X icon */}
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
        </div>
    );
};

export default Projects;
