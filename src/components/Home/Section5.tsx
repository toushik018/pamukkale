"use client";

import ReferencesSlider from "@/components/ReferancesSlider/ReferancesSlider";
import { motion } from "framer-motion";

const Section5 = () => {
  return (
    <section className="relative py-24 md:py-32 bg-black">
      <div className="absolute inset-0 opacity-10">
        {/* Subtle grid pattern for texture */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(#ffffff 0.5px, transparent 0.5px)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="container mx-auto px-4 md:px-6">
        {/* Header Section - Minimal and centered */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center mb-16 md:mb-24"
        >
          <span className="inline-block text-sm tracking-wider text-white/60 uppercase mb-4">
            Kundenstimmen
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-white mb-6">
            Was unsere Gäste über uns{" "}
            <span className="font-normal text-white">sagen</span>
          </h2>
          <div className="h-[1px] w-24 bg-white/20 mx-auto" />
        </motion.div>

        {/* Testimonials Container - Clean and modern */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="relative max-w-[1200px] mx-auto"
        >
          {/* Minimal decorative elements */}
          <div className="absolute -left-4 -top-4 w-24 h-24 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/5 rounded-full blur-3xl" />

          {/* Main Content */}
          <div className="relative backdrop-blur-sm rounded-2xl p-8 md:p-12">
            {/* Decorative quote marks */}
            <div className="absolute top-0 left-0 text-[120px] leading-none text-white/10 font-serif">
              "
            </div>
            <div className="absolute bottom-0 right-0 text-[120px] leading-none text-white/10 font-serif rotate-180">
              "
            </div>

            {/* Slider Component */}
            <ReferencesSlider />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Section5;
