"use client";

import { Suspense } from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProductList from "@/components/Products/ProductList";
import { useGetCartQuery, useGetCategoriesQuery } from "@/services/api";
import { ShopSkeleton } from "@/components/Skeletons";
import CartSummary from "@/components/Cart/CartSummary";

// Main Shop component
const Shop = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [productsByCategory, setProductsByCategory] = useState<any>({});
  const router = useRouter();

  const { data: cartData, isLoading: isCartLoading } = useGetCartQuery();
  const { data: categoriesData, isLoading: isCategoriesLoading } =
    useGetCategoriesQuery();

  useEffect(() => {
    const fetchProductsByCategory = async () => {
      if (!categoriesData?.categories) return;

      const productsMap: any = {};

      for (const category of categoriesData.categories) {
        try {
          const response = await fetch("/api/get-products-by-category", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ categoryId: category.id }),
          });

          const data = await response.json();
          if (data.products && data.products.length > 0) {
            productsMap[category.id] = {
              title: category.title,
              products: data.products,
            };
          }
        } catch (error) {
          console.error(
            `Error fetching products for category ${category.id}:`,
            error
          );
        }
      }

      setProductsByCategory(productsMap);
      setIsLoading(false);
    };

    if (categoriesData?.categories) {
      fetchProductsByCategory();
    }
  }, [categoriesData]);

  if (isCartLoading || isCategoriesLoading || isLoading) {
    return <ShopSkeleton />;
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="w-full h-full">
        <div className="max-w-[1800px] mx-auto">
          {/* Main Content Area */}
          <div className="flex-1 min-h-screen">
            <div className="p-8">
              {/* Products Grid */}
              <div className="bg-first rounded-[2rem] shadow-sm">
                <div className="p-8 space-y-16">
                  {Object.entries(productsByCategory).map(
                    ([categoryId, category]: [string, any]) => (
                      <div key={categoryId} className="space-y-8">
                        <div className="relative flex items-center gap-4">
                          <h2 className="text-xl font-medium text-second">
                            {category.title}
                          </h2>
                          <div className="flex-1 h-[1px] bg-gradient-to-r from-third/30 to-transparent" />
                        </div>
                        <ProductList products={category.products} />
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Cart Summary - Fixed bottom bar */}
          <CartSummary
            cartData={cartData}
            onNext={() => router.push("/cart")}
          />
        </div>
      </div>
    </div>
  );
};

export default Shop;
