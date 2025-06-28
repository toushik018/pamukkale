"use client";

import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { Link } from "react-scroll";
import { useState, useEffect, useRef } from "react";

const Section4 = () => {
  const [activeImage, setActiveImage] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { amount: 0.3, once: false });

  // Array of baking images for the cycle
  const bakingImages = [
    "https://images.unsplash.com/photo-1606101273945-e9eba91c0dc4?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1608830597604-619220679440?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1509365465985-25d11c17e812?q=80&w=1000&auto=format&fit=crop",
  ];

  // Change images when in view
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isInView) {
      // Start changing images when in view
      interval = setInterval(() => {
        setActiveImage((prev) => (prev + 1) % bakingImages.length);
      }, 2500); // Change image every 2.5 seconds when in view
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isInView, bakingImages.length]);

  return (
    <section
      ref={sectionRef}
      className="relative py-16 md:py-24 overflow-hidden flex items-center justify-center bg-white"
    >
      {/* Background with 90% width and rounded corners */}
      <div className="absolute inset-0 w-[80%] mx-auto h-[90%] my-auto bg-black rounded-[3rem] left-0 right-0 top-0 bottom-0" />

      <div className="container mx-auto px-4 relative z-10 w-full">
        {/* Decorative elements */}
        <div className="absolute top-10 right-10">
          <svg
            width="40"
            height="40"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="50"
              cy="50"
              r="30"
              stroke="#F9A254"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
          </svg>
        </div>

        <div className="absolute bottom-10 left-1/4">
          <svg
            width="60"
            height="60"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M30,30 L70,70 M30,70 L70,30"
              stroke="#F9A254"
              strokeWidth="1"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div className="w-full mx-auto">
          <div className="grid md:grid-cols-2 items-center">
            {/* Left side: Image carousel that changes when in viewport */}
            <div className="relative h-[300px] md:h-[500px] order-2 md:order-1">
              {/* Image carousel */}
              {bakingImages.map((img, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: activeImage === index ? 1 : 0,
                    scale: activeImage === index ? 1 : 0.9,
                  }}
                  transition={{ duration: 0.7 }}
                  className="absolute inset-0 p-6"
                >
                  <div className="relative h-full w-full rounded-3xl overflow-hidden">
                    <Image
                      src={img}
                      alt="Turkish baking"
                      fill
                      className="object-cover"
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Right side: Text content */}
            <div className="p-8 md:p-12 order-1 md:order-2">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6 }}
                className="text-3xl md:text-5xl font-bold text-white leading-tight mb-4"
              >
                SEIT 1988
                <br />
                <span className="text-[#F9A254]">AUTHENTISCHE</span>
                <br />
                TÜRKISCHE KÜCHE
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-white/80 mb-8 max-w-lg"
              >
                Mit exzellenten und qualitativ hochwertigen Zutaten, bereiten
                wir mit Liebe und Leidenschaft jedes einzelne Gericht vor, so
                dass Sie einen unvergesslichen Geschmack erleben!
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Link to="menu-section" smooth>
                  <button className="bg-white text-black px-8 py-3 rounded-full font-medium hover:bg-black hover:text-white transition-all duration-300 border-2 border-white">
                    MENÜ ENTDECKEN
                  </button>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Section4;
