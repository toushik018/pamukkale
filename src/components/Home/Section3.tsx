"use client";

import Image from "next/image";
import {
  motion,
  AnimatePresence,
  useAnimation,
  useMotionValue,
} from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

const galleryItems = [
  {
    src: "/images/img1.jpg",
    alt: "Vorspeisen",
    title: "Raffinierte Vorspeisen",
    description: "Kunstvolle Kompositionen aus frischen, saisonalen Zutaten",
    category: "Vorspeisen",
  },
  {
    src: "/images/img4.jpg",
    alt: "Hauptgerichte",
    title: "Hauptgerichte",
    description: "Perfekt abgestimmte Hauptgänge für jeden Geschmack",
    category: "Hauptgänge",
  },
  {
    src: "/images/img2.jpg",
    alt: "Desserts",
    title: "Dessert Variationen",
    description: "Süße Versuchungen als krönender Abschluss",
    category: "Desserts",
  },
  {
    src: "/images/buffet.jpg",
    alt: "Buffet",
    title: "Buffet Arrangements",
    description: "Vielfältige Auswahl für Ihre Veranstaltung",
    category: "Buffet",
  },
  {
    src: "/images/img5.jpg",
    alt: "Spezialitäten",
    title: "Besondere Kreationen",
    description: "Einzigartige Geschmackserlebnisse",
    category: "Spezialitäten",
  },
  {
    src: "/images/img6.jpg",
    alt: "Fingerfood",
    title: "Fingerfood",
    description: "Kleine Köstlichkeiten mit großer Wirkung",
    category: "Fingerfood",
  },
];

// Add transition types
const transitionEffects = {
  slide: {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.9,
    }),
  },
  fade: {
    enter: () => ({
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      opacity: 1,
    },
    exit: () => ({
      zIndex: 0,
      opacity: 0,
    }),
  },
  zoom: {
    enter: () => ({
      scale: 1.5,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      scale: 1,
      opacity: 1,
    },
    exit: () => ({
      zIndex: 0,
      scale: 0.5,
      opacity: 0,
    }),
  },
};

const Section3 = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [currentEffect, setCurrentEffect] =
    useState<keyof typeof transitionEffects>("slide");

  // Remove Ken Burns controls and keep only parallax
  const parallaxY = useMotionValue(0);

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = useCallback((newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      let nextIndex = prevIndex + newDirection;
      if (nextIndex < 0) nextIndex = galleryItems.length - 1;
      if (nextIndex >= galleryItems.length) nextIndex = 0;
      return nextIndex;
    });
  }, []);

  // Autoplay functionality
  useEffect(() => {
    if (isPlaying && !isHovered) {
      const timer = setInterval(() => {
        paginate(1);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [isPlaying, isHovered, paginate]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") paginate(-1);
      if (e.key === "ArrowRight") paginate(1);
      if (e.key === " ") setIsPlaying((prev) => !prev);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [paginate]);

  return (
    <section className="py-32 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <span className="inline-block text-first font-medium tracking-wider uppercase text-sm mb-4">
            Galerie
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Kulinarische Impressionen
          </h2>
          <p className="text-gray-600 text-lg">
            Ein visueller Einblick in unsere Kreationen
          </p>
        </motion.div>

        {/* Modern Carousel */}
        <div className="max-w-[1400px] mx-auto">
          <div className="relative flex flex-col">
            <div
              className="relative h-[650px] overflow-hidden rounded-t-3xl bg-second/5"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onMouseMove={(e) => {
                const { clientY } = e;
                const { top, height } = e.currentTarget.getBoundingClientRect();
                const y = (clientY - top) / height;
                parallaxY.set(y * 50);
              }}
            >
              <AnimatePresence initial={false} custom={direction}>
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={transitionEffects[currentEffect]}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                    scale: { duration: 0.3 },
                  }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={1}
                  onDragEnd={(e, { offset, velocity }) => {
                    const swipe = swipePower(offset.x, velocity.x);
                    if (swipe < -swipeConfidenceThreshold) {
                      paginate(1);
                    } else if (swipe > swipeConfidenceThreshold) {
                      paginate(-1);
                    }
                  }}
                  className="absolute inset-0"
                >
                  {/* Image Container */}
                  <div className="relative w-full h-full">
                    <Image
                      src={galleryItems[currentIndex].src}
                      alt={galleryItems[currentIndex].alt}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Fixed Overlay with subtle parallax */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none"
                style={{ y: parallaxY }}
              />

              {/* Fixed Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="absolute bottom-0 left-0 right-0 p-12 z-10"
              >
                <span className="inline-block px-3 py-1 bg-first/90 backdrop-blur-sm rounded-full text-xs font-medium text-second mb-4">
                  {galleryItems[currentIndex].category}
                </span>
                <h3 className="text-4xl font-bold text-white mb-3">
                  {galleryItems[currentIndex].title}
                </h3>
                <p className="text-white/90 text-lg max-w-2xl">
                  {galleryItems[currentIndex].description}
                </p>
              </motion.div>
            </div>

            {/* Always Visible Thumbnails Strip */}
            <div className="relative h-[100px] bg-white rounded-b-3xl border-t border-gray-100">
              <div className="relative h-full flex items-center px-4">
                {/* Combined Navigation Controls */}
                <div className="absolute left-4 flex items-center gap-2">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-800 hover:bg-gray-200 transition-colors duration-200"
                  >
                    {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                  </button>
                  <button
                    onClick={() => paginate(-1)}
                    className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-800 hover:bg-gray-200 transition-colors duration-200"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={() => paginate(1)}
                    className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-800 hover:bg-gray-200 transition-colors duration-200"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>

                <div className="flex-1 overflow-hidden">
                  <div className="flex gap-2 justify-center items-center h-full py-4 transition-transform duration-300">
                    {galleryItems.map((item, index) => (
                      <motion.button
                        key={index}
                        onClick={() => {
                          setDirection(index > currentIndex ? 1 : -1);
                          setCurrentIndex(index);
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`relative flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden transition-all duration-200 ${
                          index === currentIndex
                            ? "ring-2 ring-first scale-105"
                            : "opacity-60 hover:opacity-100"
                        }`}
                      >
                        <Image
                          src={item.src}
                          alt={item.alt}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20" />
                        <div className="absolute bottom-0 left-0 right-0 p-1 text-[10px] text-white text-center bg-black/40 truncate">
                          {item.category}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Section3;
