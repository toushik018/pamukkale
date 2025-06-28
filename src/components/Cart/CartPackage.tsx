import React, { useState } from "react";
import { PackageOrder, MenuContent, CartProduct } from "../../types/types";
import { CartItem } from "./CartItem";
import { Trash2, Loader2, Package, ChevronDown } from "lucide-react";
import { getMenuContents } from "@/constants/categories";
import { getPackageMenuId } from "@/utils/menuUtils";
import { motion, AnimatePresence } from "framer-motion";

interface CartPackageProps {
  pkg: PackageOrder;
  cartData: any;
  onIncrement: (item: CartProduct) => void;
  onDecrement: (item: CartProduct) => void;
  onRemove: (item: CartProduct) => void;
  loadingStates: { [key: string]: boolean };
  isDeleting: boolean;
  handleDeletePackage: () => void;
}

export const CartPackage: React.FC<CartPackageProps> = ({
  pkg,
  cartData,
  onIncrement,
  onDecrement,
  onRemove,
  loadingStates,
  isDeleting,
  handleDeletePackage,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const getGroupedProducts = () => {
    const groupedProducts: { [key: string]: CartProduct[] } = {};

    if (pkg.products && typeof pkg.products === "object") {
      const menuId = getPackageMenuId(pkg.package);
      const menuContents =
        cartData?.cart?.menu?.contents ||
        (menuId ? getMenuContents(menuId) : []);

      Object.entries(pkg.products).forEach(([categoryId, products]) => {
        if (!Array.isArray(products)) return;

        let categoryName = "Andere";

        if (menuContents?.length > 0) {
          const category = menuContents.find((content: { ids?: number[] }) => {
            return content?.ids && content.ids.includes(parseInt(categoryId));
          });

          if (category?.name) {
            categoryName = category.name;
          } else {
            const fallbackContents = menuId ? getMenuContents(menuId) : [];
            const fallbackCategory = fallbackContents.find(
              (content) =>
                content.ids && content.ids.includes(parseInt(categoryId))
            );
            if (fallbackCategory?.name) {
              categoryName = fallbackCategory.name;
            }
          }
        }

        if (!groupedProducts[categoryName]) {
          groupedProducts[categoryName] = [];
        }

        products.forEach((product) => {
          if (product) {
            groupedProducts[categoryName].push(product);
          }
        });
      });
    }

    return groupedProducts;
  };

  const groupedProducts = getGroupedProducts();
  const totalItems = Object.values(groupedProducts).reduce(
    (sum, products) => sum + products.length,
    0
  );

  const renderProducts = () => {
    if (!pkg?.products) {
      console.warn("No products found in package:", pkg);
      return null;
    }

    return (
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="space-y-0 bg-gray-50/50">
              {Object.entries(groupedProducts).map(
                ([categoryName, products]) => (
                  <div
                    key={categoryName}
                    className="bg-white rounded-xl p-3"
                  >
                    <h3 className="text-lg font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 bg-first rounded-full" />
                      {categoryName}
                      <span className="text-sm font-normal text-gray-400">
                        ({products.length} Artikel)
                      </span>
                    </h3>
                    <div className="space-y-4">
                      {products.map((item: CartProduct) => (
                        <CartItem
                          key={item.cart_id}
                          item={item}
                          onIncrement={onIncrement}
                          onDecrement={onDecrement}
                          onRemove={onRemove}
                          categoryName={categoryName}
                          isLoading={loadingStates[item.cart_id]}
                        />
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  return (
    <motion.div
      layout
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200"
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left"
      >
        <div className="flex justify-between items-center p-6 bg-white">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-first/10 rounded-xl">
              <Package className="w-5 h-5 text-first" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-semibold text-gray-800">
                  {pkg.package}
                </h2>
                {pkg.guests && (
                  <span className="text-sm px-3 py-1 bg-gray-100 text-gray-600 rounded-full">
                    {pkg.guests} Gäste
                  </span>
                )}
                <span className="text-sm px-3 py-1 bg-gray-100 text-gray-600 rounded-full">
                  {totalItems} Artikel
                </span>
              </div>
              {pkg.date && pkg.time && (
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                  <span>
                    {pkg.date
                      ? (() => {
                          const date = new Date(pkg.date);
                          const day = date.getDate();
                          const month = date.toLocaleString("de-DE", {
                            month: "long",
                          });
                          const year = date.getFullYear();
                          return `${day} ${month} ${year}`;
                        })()
                      : ""}
                  </span>
                  <span>•</span>
                  <span>{pkg.time} Uhr</span>
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-lg font-bold text-gray-800 bg-first/5 px-4 py-2 rounded-xl">
              {pkg.price}€
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeletePackage();
              }}
              disabled={isDeleting}
              className="p-2 hover:bg-red-50 rounded-xl transition-all duration-200 group"
            >
              {isDeleting ? (
                <Loader2 className="w-5 h-5 animate-spin text-red-500" />
              ) : (
                <Trash2 className="w-5 h-5 text-red-400 group-hover:text-red-500 transition-colors" />
              )}
            </button>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="w-5 h-5 text-gray-400" />
            </motion.div>
          </div>
        </div>
      </button>
      {renderProducts()}
    </motion.div>
  );
};

export default CartPackage;
