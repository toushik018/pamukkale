"use client";

import { motion } from "framer-motion";
import { HiArrowLongRight } from "react-icons/hi2";
import { useRouter } from "next/navigation";
import Image from "next/image";

const OrderHome = () => {
  const router = useRouter();

  const handleOrderNow = () => {
    router.push("/shop");
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/background.jpg"
          alt="Elegant Catering"
          fill
          priority
          className="object-cover"
          sizes="100vw"
          quality={100}
        />
        <div className="absolute inset-0 backdrop-blur-[2px] bg-gradient-to-r from-black/60 to-black/30" />
        <div className="absolute inset-0 bg-white/20" />
      </div>

      {/* Main Content */}
      <div className="relative container mx-auto px-4 min-h-screen">
        <div className="grid lg:grid-cols-2 gap-12 min-h-screen items-center">
          {/* Left Content */}
          <div className="max-w-2xl">
            {/* Location Badge */}
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 px-5 py-2 rounded-full mb-8">
              <div className="size-2 rounded-full bg-first animate-pulse" />
              <span className="text-white/90 text-sm font-medium tracking-wide">
                Möllner Landstraße 3, 22111 Hamburg
              </span>
            </div>

            {/* Main Title */}
            <div className="mb-6">
              <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
                Hardal
                <span className="text-first block mt-3">Restaurant</span>
                <span className="block mt-3">& Catering</span>
              </h1>
            </div>

            {/* Description */}
            <p className="text-xl text-white/80 max-w-2xl mb-12 leading-relaxed">
              Erleben Sie erstklassiges türkisches Catering für Ihre
              Veranstaltungen. Von exklusiven Firmenfeiern bis zu
              unvergesslichen Hochzeiten - wir bieten authentische
              Geschmackserlebnisse.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-5">
              <a
                href="tel:+4940847082"
                className="group px-8 py-4 bg-first rounded-xl font-medium hover:bg-first/90 transition-all"
              >
                <span className="flex items-center gap-3 text-white">
                  Jetzt Anrufen
                  <HiArrowLongRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </a>
              <button
                onClick={handleOrderNow}
                className="group px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-medium 
                     hover:bg-white/20 transition-all border border-white/20 cursor-pointer
                     flex items-center gap-3"
              >
                Jetzt Bestellen
                <HiArrowLongRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Stats Section */}
            <div className="mt-20 grid grid-cols-3 gap-12 max-w-2xl">
              {[
                { number: "15+", label: "Jahre Erfahrung" },
                { number: "1000+", label: "Zufriedene Kunden" },
                { number: "4.9", label: "Google Bewertung" },
              ].map((stat, index) => (
                <div key={index} className="relative">
                  <div className="absolute -top-3 -left-3 size-12 rounded-lg bg-first/10" />
                  <div className="relative">
                    <div className="text-3xl font-bold text-white mb-1">
                      {stat.number}
                    </div>
                    <div className="text-sm text-white/60">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Image */}
          <div className="hidden lg:block">
            <div className="relative">
              <div className="relative w-full h-96">
                <Image
                  src="/images/main.jpg"
                  alt="Turkish Catering"
                  fill
                  className="object-cover rounded-2xl shadow-lg"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  quality={100}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderHome;
