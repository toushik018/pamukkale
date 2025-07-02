import React from "react";
import HorizontalMenuCard from "../HorizontalMenuCard/HorizontalMenuCard";
import { Product } from "@/types/product";
import { motion } from "framer-motion";

interface CategoryProduct extends Product {
  category_id?: string;
}

interface ProductListProps {
  products: CategoryProduct[];
}

const ProductList: React.FC<ProductListProps> = ({ products }) => {
  if (!products || products.length === 0) {
    return (
      <div className="col-span-full flex justify-center items-center py-6">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-third rounded-full mx-auto flex items-center justify-center">
            <svg
              className="w-8 h-8 text-accentGray"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          </div>
          <p className="text-sm text-accentGray">
            Keine Produkte in dieser Kategorie verfügbar.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product, idx) => (
        <motion.div
          key={product.product_id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: idx * 0.1 }}
        >
          <HorizontalMenuCard product={product} />
        </motion.div>
      ))}
    </div>
  );
};

export default ProductList;
