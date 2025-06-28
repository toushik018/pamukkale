import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Minus, Plus, Trash2 } from "lucide-react";

interface ProductItemProps {
  product: {
    product_id: number;
    name: string;
    thumb?: string;
    image?: string;
    price?: string | number;
    quantity: number;
    leadTime?: string;
  };
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
  isLoading?: boolean;
}

const ProductItem: React.FC<ProductItemProps> = ({
  product,
  onIncrement,
  onDecrement,
  onRemove,
  isLoading = false,
}) => {
  if (!product || typeof product !== "object") {
    console.error("Invalid product data:", product);
    return null;
  }

  const formatPrice = (price: string | number | undefined): string => {
    try {
      if (typeof price === "number") {
        return price.toFixed(2);
      }
      if (typeof price === "string") {
        const numericPrice = parseFloat(price.replace(/[^0-9.-]+/g, ""));
        return isNaN(numericPrice) ? "0.00" : numericPrice.toFixed(2);
      }
      return "0.00";
    } catch (error) {
      console.error("Error formatting price:", error);
      return "0.00";
    }
  };

  const totalPrice = formatPrice(
    typeof product.price === "number"
      ? product.price * product.quantity
      : parseFloat((product.price || "0").replace(/[^0-9.-]+/g, "")) *
          product.quantity
  );

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`group relative flex items-center gap-6 p-2 bg-white rounded-xl border border-gray-100
                hover:border-gray-200 hover:shadow-sm transition-all duration-200
                ${isLoading ? "opacity-50 pointer-events-none" : ""}`}
    >
      {/* Product Image with Hover Effect */}
      <div className="relative w-[100px] h-[100px] rounded-lg overflow-hidden bg-gray-50 group-hover:shadow-md transition-all duration-200">
        <Image
          src={product?.thumb || "/images/placeholder.png"}
          alt={product?.name || ""}
          fill
          className="object-cover transform group-hover:scale-105 transition-transform duration-200"
        />
      </div>

      {/* Product Info with Clean Typography */}
      <div className="flex-grow">
        <h3 className="text-base font-medium text-gray-900 mb-1 group-hover:text-gray-700 transition-colors">
          {product?.name}
        </h3>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>{formatPrice(product?.price)}€ pro Stück</span>
          <span className="text-gray-300">•</span>
          <span>Menge: {product?.quantity}</span>
        </div>
      </div>

      {/* Price and Actions */}
      <div className="flex items-center gap-6">
        <span className="text-lg font-semibold text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">
          {totalPrice}€
        </span>

        {/* Quantity Controls - Commented Out */}
        {/* <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={onDecrement}
            disabled={isLoading || product.quantity <= 1}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 
                     text-gray-400 hover:text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition-all
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Minus size={16} strokeWidth={2} />
          </button>
          <button
            onClick={onIncrement}
            disabled={isLoading}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 
                     text-gray-400 hover:text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition-all
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={16} strokeWidth={2} />
          </button>
          <button
            onClick={onRemove}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 
                     text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all"
          >
            <Trash2 size={16} strokeWidth={2} />
          </button>
        </div> */}
      </div>
    </motion.div>
  );
};

export default ProductItem;
