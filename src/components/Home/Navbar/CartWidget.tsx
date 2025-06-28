"use client";

import React from "react";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useGetCartQuery } from "@/services/api";
import { motion, AnimatePresence } from "framer-motion";
import {
  calculateExtrasTotal,
  calculateTotals,
} from "@/components/Cart/CartPriceCalculation";

const CartWidget = () => {
  const { data: cartData, isLoading } = useGetCartQuery();

  const getTotalItems = (): number => {
    if (!cartData?.products) return 0;
    return cartData.products.reduce(
      (total: number, item: { quantity: string }) => {
        const quantity = Number(item.quantity);
        return total + (isNaN(quantity) ? 0 : quantity);
      },
      0
    );
  };

  // Calculate cart totals using our utility functions
  const extrasTotal = calculateExtrasTotal(cartData);
  const { totalPrice } = calculateTotals(cartData, extrasTotal);

  return (
    <Link href="/cart" className="relative group">
      <div className="flex items-center gap-2 text-white hover:text-white/90 transition-colors duration-300">
        {/* Cart Icon with Badge */}
        <div className="relative">
          <ShoppingBag className="w-5 h-5" />
          <AnimatePresence>
            {getTotalItems() > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="absolute -top-1.5 -right-1.5 bg-white text-[#1D1D1A] font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center"
              >
                {getTotalItems()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Price Display */}
        <div className="text-sm font-medium">
          {isLoading ? (
            <div className="w-12 h-3 bg-white/20 animate-pulse rounded" />
          ) : (
            totalPrice
          )}
        </div>
      </div>
    </Link>
  );
};

export default CartWidget;
