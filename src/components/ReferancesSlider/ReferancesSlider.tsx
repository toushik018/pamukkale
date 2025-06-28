import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";

const ReferencesSlider = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    skipSnaps: false,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const testimonials = [
    {
      name: "Sarah Müller",
      role: "Geschäftsführerin",
      company: "Event Solutions Hamburg",
      quote:
        "Pamukkale Restaurant hat unser Firmenevent zu einem kulinarischen Highlight gemacht. Die authentische türkische Küche und der erstklassige Service haben alle unsere Erwartungen übertroffen.",
    },
    {
      name: "Thomas Weber",
      role: "Restaurantkritiker",
      company: "Hamburg Feinschmecker",
      quote:
        "Ein Stück Istanbul in Hamburg seit 1988. Die traditionellen Gerichte werden hier mit moderner Finesse serviert. Das Ambiente und die Gastfreundschaft sind einzigartig.",
    },
    {
      name: "Lisa Bergmann",
      role: "Food Bloggerin",
      company: "Hamburger Genussmomente",
      quote:
        "Die Qualität der Zutaten und die Liebe zum Detail in jedem Gericht sind bemerkenswert. Das Pamukkale in der Schanze ist definitiv eine kulinarische Institution.",
    },
  ];

  useEffect(() => {
    if (emblaApi) {
      emblaApi.on("select", () => {
        setSelectedIndex(emblaApi.selectedScrollSnap());
      });
    }
  }, [emblaApi]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <div className="relative">
      {/* Slider Container */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {testimonials.map((testimonial, idx) => (
            <div key={idx} className="flex-[0_0_100%] min-w-0 px-8 md:px-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: selectedIndex === idx ? 1 : 0.15,
                  y: selectedIndex === idx ? 0 : 10,
                  scale: selectedIndex === idx ? 1 : 0.95,
                }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="relative"
              >
                {/* Main Content */}
                <div className="max-w-4xl mx-auto">
                  {/* Quote */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mb-16"
                  >
                    <p className="text-2xl md:text-3xl lg:text-4xl text-white font-extralight leading-relaxed tracking-wide">
                      {testimonial.quote}
                    </p>
                  </motion.div>

                  {/* Author Info */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-center gap-6"
                  >
                    <div className="h-px w-16 bg-white/20" />
                    <div>
                      <h4 className="text-lg text-white/90 font-medium tracking-wide">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-white/50 tracking-wider uppercase">
                        {testimonial.role} • {testimonial.company}
                      </p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 flex items-center gap-12">
        {/* Arrows and Progress */}
        <div className="flex items-center gap-8">
          <motion.button
            whileHover={{ x: -3 }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollPrev}
            className="text-white/40 hover:text-white transition-all duration-300"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={0.75}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </motion.button>

          {/* Progress Indicator */}
          <div className="flex items-center gap-4">
            {testimonials.map((_, idx) => (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.2 }}
                onClick={() => emblaApi?.scrollTo(idx)}
                className="group relative h-1.5 w-1.5"
              >
                <span
                  className={`
                  absolute inset-0 rounded-full transition-all duration-300
                  ${
                    selectedIndex === idx
                      ? "bg-white scale-100"
                      : "bg-white/20 scale-75 group-hover:bg-white/40 group-hover:scale-100"
                  }
                `}
                />
              </motion.button>
            ))}
          </div>

          <motion.button
            whileHover={{ x: 3 }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollNext}
            className="text-white/40 hover:text-white transition-all duration-300"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={0.75}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default ReferencesSlider;
