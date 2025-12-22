import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

const ProjectCarousel = ({ images, onMaximize }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    // If no images
    if (!images || images.length === 0) {
        return <div className="w-full aspect-video bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 font-sans">No Images</div>;
    }

    // Prepare URL helper
    const getUrl = (path) => path.startsWith('http') ? path : `http://localhost:3000${path}`;

    const handleNext = () => {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const handlePrev = () => {
        setDirection(-1);
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const variants = {
        enter: (dir) => ({
            x: dir > 0 ? 1000 : -1000,
            opacity: 0,
            scale: 0.95
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            scale: 1
        },
        exit: (dir) => ({
            zIndex: 0,
            x: dir < 0 ? 1000 : -1000,
            opacity: 0,
            scale: 1.05
        })
    };

    return (
        <div className="relative w-full aspect-[16/10] md:aspect-[16/9] group bg-gray-100 rounded-xl overflow-hidden shadow-lg">
            <AnimatePresence initial={false} custom={direction} mode='popLayout'>
                <motion.img
                    key={currentIndex}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        x: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.4 }
                    }}
                    src={getUrl(images[currentIndex].imagePath)}
                    alt={`Slide ${currentIndex}`}
                    className="absolute w-full h-full object-cover"
                />
            </AnimatePresence>

            {/* Controls */}
            {images.length > 1 && (
                <>
                    <button
                        onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white backdrop-blur-md p-3 rounded-full transition-all border border-white/20 z-10"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); handleNext(); }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white backdrop-blur-md p-3 rounded-full transition-all border border-white/20 z-10"
                    >
                        <ChevronRight size={24} />
                    </button>

                    {/* Dots */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                        {images.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => {
                                    setDirection(idx > currentIndex ? 1 : -1);
                                    setCurrentIndex(idx);
                                }}
                                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 border border-white/50 ${idx === currentIndex ? 'bg-white scale-125' : 'bg-transparent hover:bg-white/50'}`}
                            />
                        ))}
                    </div>
                </>
            )}

            {/* Maximize Button */}
            <button
                onClick={() => onMaximize(getUrl(images[currentIndex].imagePath))}
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/80 text-white p-2 rounded-lg transition-all backdrop-blur-sm opacity-0 group-hover:opacity-100"
                title="Fullscreen"
            >
                <Maximize2 size={20} />
            </button>
        </div>
    );
};

export default ProjectCarousel;
