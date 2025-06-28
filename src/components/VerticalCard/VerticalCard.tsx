"use client";

import Image from "next/image";
import { Package } from "@/types/package";
import { useGetMenuContentQuery } from "@/services/api";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface MenuContent {
  name: string;
  ids: number[];
  count: number;
}

interface VerticalCardProps {
  packageData: Package;
  onSelect?: (packageData: Package) => void;
}

const getImageSrc = (id: number) => {
  return `/images/package${id}.jpg`;
};

const VerticalCard = ({ packageData, onSelect }: VerticalCardProps) => {
  const { data: menuContentData } = useGetMenuContentQuery(packageData.id);
  const menuContents = menuContentData?.contents || [];

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onSelect) {
      onSelect(packageData);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="group h-60 rounded-2xl relative bg-gradient-to-br from-first to-first/95 border border-second/10 hover:border-second/20 transition-all duration-300 overflow-hidden"
    >
      {/* Background Patterns */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.1),transparent)]" />
        <div className="absolute -right-12 -top-12 w-48 h-48 border border-second/10 rounded-full" />
        <div className="absolute -left-16 -bottom-16 w-48 h-48 border border-second/10 rounded-full" />
      </div>

      <div className="grid grid-cols-12 h-full relative z-10">
        {/* Image Section */}
        <div className="col-span-5 relative overflow-hidden">
          <div className="absolute inset-0 transform group-hover:scale-105 transition-transform duration-700">
            <Image
              src={getImageSrc(packageData.id)}
              alt={packageData.name}
              width={400}
              height={240}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-second/60 to-transparent mix-blend-multiply" />
          </div>

          {/* Dynamic Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-second/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Package Type Badge */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="absolute top-4 left-4 z-30"
          >
            {/* Minimum Clients Tag */}
            <div className=" flex items-center gap-1.5 bg-first/15 backdrop-blur-sm px-3 py-1.5 rounded-full border border-first/10">
              <span className="text-first text-xs">Min.</span>
              <span className="text-first font-medium text-xs">
                {packageData.minimumClients}
              </span>
            </div>
          </motion.div>

          {/* Diagonal divider */}
          <div className="absolute top-0 right-0 h-full w-24 bg-gradient-to-l from-first to-transparent transform skew-x-12 translate-x-12" />
        </div>

        {/* Right side - Content area */}
        <div className="col-span-7 p-6 flex flex-col justify-between relative">
          {/* Content */}
          <div className="relative z-10 space-y-4">
            {/* Title with animated underline */}
            <div className="relative inline-block">
              <h3 className="text-xl font-bold text-second group-hover:text-second/90 transition-colors duration-300">
                {packageData.name}
              </h3>
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-second/20 group-hover:w-full transition-all duration-500 ease-out" />
            </div>

            {/* Menu items */}
            <div className="space-y-2">
              {menuContents
                .filter((content: MenuContent) => content.count !== 0)
                .slice(0, 2)
                .map((content: MenuContent, index: number) => (
                  <motion.div
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 * (index + 1) }}
                    key={index}
                    className="flex items-center gap-2 group/item"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-second/40 group-hover/item:bg-second/60 transition-colors duration-300" />
                    <span className="text-second/70 text-sm group-hover/item:text-second/90 transition-colors duration-300">
                      {content.count} {content.name}
                    </span>
                  </motion.div>
                ))}
            </div>

            {/* Price Display */}
            <div className="flex flex-col group/price">
              <span className="text-second/60 text-xs group-hover/price:text-second/70 transition-colors duration-300">
                Pro Person
              </span>
              <span className="text-second font-bold text-xl group-hover/price:text-second/90 transition-colors duration-300">
                {packageData.price}
              </span>
            </div>
          </div>

          {/* Action Button */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleButtonClick}
            className="absolute bottom-0 left-0 right-0 bg-second py-3 flex items-center justify-center gap-2 transition-colors duration-300 hover:bg-second/90"
          >
            <span className="text-first text-sm font-medium">Auswählen</span>
            <ArrowRight
              size={16}
              className="text-first transform transition-transform duration-300 group-hover:translate-x-1"
            />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default VerticalCard;
