import React from "react";
import HorizontalMenuCard from "../HorizontalMenuCard/HorizontalMenuCard";
import { useGetCategoriesQuery } from "@/services/api";
import { Product } from "@/types/product";
import { motion } from "framer-motion";

interface MenuContent {
  name: string;
  ids: number[];
  count?: number;
}

interface CategoryProduct extends Product {
  category_id?: string;
}

interface Category {
  id: string;
  title: string;
}

interface ProductListProps {
  products: CategoryProduct[];
  menuContents: MenuContent[];
  activeCategoryName?: string;
  currentCount: number;
  requiredCount: number;
}

const ProductList: React.FC<ProductListProps> = ({
  products,
  menuContents,
  activeCategoryName,
  currentCount,
  requiredCount,
}) => {
  const { data: categoriesData } = useGetCategoriesQuery();

  const currentContent = menuContents.find(
    (content) => content.name === activeCategoryName
  );
  const categoryIds = currentContent?.ids || [];

  const ProgressIndicator = () => (
    <div className="sticky top-[64px] md:top-[80px] z-50 bg-first/80 backdrop-blur-md px-6 py-3 rounded-[1rem] border border-third/50 ">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <div className="text-sm text-accentGray mb-1">Fortschritt</div>
            <div className="flex items-center gap-2 text-lg font-semibold">
              <span className="text-second">{currentCount}</span>
              <span className="text-accentGray">/</span>
              <span className="text-second">{requiredCount}</span>
              <span className="text-accentGray text-base font-normal">
                ausgewählte Produkte
              </span>
            </div>
          </div>
        </div>

        <div className="w-32 h-2 rounded-full bg-third overflow-hidden">
          <motion.div
            className="h-full bg-second rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(currentCount / requiredCount) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>
    </div>
  );

  if (!products || products.length === 0) {
    return (
      <div className="col-span-full flex justify-center items-center py-12">
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
          <p className="text-xl text-accentGray">
            Keine Produkte in dieser Kategorie verfügbar.
          </p>
        </div>
      </div>
    );
  }

  // For single category
  if (categoryIds.length === 1) {
    return (
      <div className="space-y-8">
        <ProgressIndicator />
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product, idx) => (
            <motion.div
              key={product.product_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
            >
              <HorizontalMenuCard
                product={product}
                activeCategoryName={
                  activeCategoryName || menuContents[0]?.name || ""
                }
              />
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  // For multiple categories
  return (
    <div className="space-y-12">
      <ProgressIndicator />
      <div className="space-y-16">
        {categoryIds.map((categoryId) => {
          const category = categoriesData?.categories.find(
            (cat: Category) => cat.id === categoryId.toString()
          );

          const categoryProducts = products.filter(
            (product) => product.category_id === categoryId.toString()
          );

          if (!categoryProducts.length) return null;

          return (
            <motion.div
              key={categoryId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              {category?.title && (
                <div className="relative flex items-center gap-4">
                  <h3 className="text-xl font-medium text-second">
                    {category.title}
                  </h3>
                  <div className="flex-1 h-[1px] bg-gradient-to-r from-third/30 to-transparent" />
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {categoryProducts.map((product, idx) => (
                  <motion.div
                    key={product.product_id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                  >
                    <HorizontalMenuCard
                      product={product}
                      activeCategoryName={
                        activeCategoryName || menuContents[0]?.name || ""
                      }
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductList;
