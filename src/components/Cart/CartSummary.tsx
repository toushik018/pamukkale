import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  Trash2,
  ShoppingBag,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRemoveProductMutation } from "@/services/api";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CartSummaryProps {
  cartData: any;
  currentCategory: {
    name?: string;
    count?: number;
  };
  getCurrentCategoryCount: () => number;
  activeStep: number;
  menuContents: any[];
  onPrevious: () => void;
  onNext: () => void;
}

const CartSummary: React.FC<CartSummaryProps> = ({
  cartData,
  currentCategory,
  getCurrentCategoryCount,
  activeStep,
  menuContents,
  onPrevious,
  onNext,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [removeProduct] = useRemoveProductMutation();
  const [isExpanded, setIsExpanded] = useState(false);

  const isExtrasCategory = currentCategory?.name === "Extras";
  const totalItems =
    cartData?.products?.reduce(
      (sum: number, product: any) => sum + Number(product.quantity),
      0
    ) || 0;
  const totalPrice =
    cartData?.products?.reduce((sum: number, product: any) => {
      const price = parseFloat(product.price.replace("€", "").trim());
      return sum + price * Number(product.quantity);
    }, 0) || 0;

  const handleNext = async () => {
    setIsLoading(true);
    try {
      if (
        isExtrasCategory ||
        getCurrentCategoryCount() >= (currentCategory?.count || 0)
      ) {
        await onNext();
      } else {
        toast.error(`Bitte wählen Sie ${currentCategory?.count} Produkte aus.`);
      }
    } catch (error) {
      console.error("Navigation error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveProduct = async (cartId: string) => {
    setRemovingId(cartId);
    try {
      await removeProduct({ id: cartId, quantity: 0 });
      toast.success("Produkt entfernt");
    } catch (error) {
      console.error("Error removing product:", error);
      toast.error("Fehler beim Entfernen des Produkts");
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <>
      {/* Compact Fixed Bottom Bar */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 bg-first border-t border-third shadow-lg z-50"
      >
        <div className="max-w-[1800px] mx-auto">
          <div className="flex items-center justify-between p-4">
            {/* Selection Progress */}
            <div className="flex items-center gap-6">
              {/* Current Selection Info */}
              <div className="flex items-center gap-3">
                <div className="flex flex-col">
                  <span className="text-sm text-accentGray">
                    Aktuelle Auswahl
                  </span>
                  <div className="flex items-center gap-2 font-medium text-second">
                    <span>{getCurrentCategoryCount()}</span>
                    <span className="text-accentGray">/</span>
                    <span>{currentCategory?.count || 0}</span>
                    <span className="text-sm text-accentGray ml-1">
                      {currentCategory?.name}
                    </span>
                  </div>
                </div>
                <div className="w-20 h-1.5 rounded-full bg-third overflow-hidden">
                  <motion.div
                    className="h-full bg-second rounded-full"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${
                        (getCurrentCategoryCount() /
                          (currentCategory?.count || 1)) *
                        100
                      }%`,
                    }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>
              </div>

              {/* Cart Summary */}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-3 px-4 py-2 bg-third/10 rounded-xl hover:bg-third/20 transition-colors"
              >
                <div className="relative">
                  <ShoppingBag className="w-5 h-5 text-second" />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 w-4 h-4 flex items-center justify-center bg-second text-first text-xs font-medium rounded-full">
                      {totalItems}
                    </span>
                  )}
                </div>
                <div className="text-left">
                  <div className="text-sm text-accentGray">Gesamt</div>
                  <div className="font-medium text-second">
                    {totalPrice.toFixed(2)}€
                  </div>
                </div>
              </button>
            </div>

            {/* Navigation */}
            <div className="flex gap-3">
              <button
                onClick={onPrevious}
                disabled={activeStep === 0 || isLoading}
                className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-third rounded-xl text-second font-medium 
                         hover:bg-third/10 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                <span>Zurück</span>
              </button>
              <button
                onClick={handleNext}
                disabled={
                  isLoading ||
                  (!isExtrasCategory &&
                    getCurrentCategoryCount() < (currentCategory?.count || 0))
                }
                className="flex items-center justify-center gap-2 px-8 py-3 bg-second rounded-xl text-first font-medium 
                         hover:bg-second/90 transition-colors disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Wird geladen...</span>
                  </>
                ) : (
                  <>
                    <span>
                      {activeStep === menuContents.length - 1
                        ? "Warenkorb ansehen"
                        : "Weiter"}
                    </span>
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Expandable Cart Details */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-t border-third"
              >
                <ScrollArea className="h-[300px]">
                  <div className="p-4">
                    {!cartData?.products || cartData.products.length === 0 ? (
                      <div className="text-center py-8 text-accentGray">
                        Ihr Warenkorb ist leer
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {cartData.products.map((product: any) => (
                          <motion.div
                            key={product.cart_id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex items-center justify-between p-3 bg-third/5 rounded-xl"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-lg overflow-hidden bg-third/10">
                                <img
                                  src={
                                    product.thumb || "/images/placeholder.png"
                                  }
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <p className="font-medium text-second">
                                  {product.name}
                                </p>
                                <div className="flex items-center gap-2 text-sm text-accentGray">
                                  <span>× {product.quantity}</span>
                                  {product.price !== "0.00€" && (
                                    <span>{product.price}</span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() =>
                                handleRemoveProduct(product.cart_id)
                              }
                              disabled={removingId === product.cart_id}
                              className="p-2 hover:bg-red-100 rounded-lg transition-all duration-200"
                            >
                              {removingId === product.cart_id ? (
                                <Loader2 className="w-4 h-4 animate-spin text-red-500" />
                              ) : (
                                <Trash2 className="w-4 h-4 text-red-500" />
                              )}
                            </button>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Bottom Spacing */}
      <div className="h-20" />
    </>
  );
};

export default CartSummary;
