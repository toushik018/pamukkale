"use client";

import React, { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  useGetCartQuery,
  useEditProductMutation,
  useRemoveProductMutation,
  useDeletePackageMutation,
} from "@/services/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { ShoppingCart, Trash2, Loader2 } from "lucide-react";
import { CartSkeleton } from "@/components/Skeletons/CartSkeleton";
import { CartPackage } from "@/components/Cart/CartPackage";
import { handleError } from "@/components/Cart/utils";
import { CartProduct, LoadingState } from "@/types/types";
import { getPackageMenuId } from "@/utils/menuUtils";
import { getMenuContents } from "@/constants/categories";
import {
  calculateExtrasTotal,
  calculateTotals,
  formatExtrasTotal,
} from "@/components/Cart/CartPriceCalculation";

interface CategoryProducts {
  [key: string]: CartProduct[];
}

interface PackageOrder {
  id: string;
  package: string;
  price: number;
  products: CategoryProducts;
  guests?: number;
}

interface MenuContent {
  name: string;
  ids: number[];
  count: number;
}

const Cart: React.FC = () => {
  const router = useRouter();
  const {
    data: cartData,
    isLoading: isCartLoading,
    error: cartError,
    refetch,
  } = useGetCartQuery();
  const [editProduct] = useEditProductMutation();
  const [removeProduct] = useRemoveProductMutation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [loadingStates, setLoadingStates] = useState<LoadingState>({});
  const [deletePackage, { isLoading: isDeleting }] = useDeletePackageMutation();
  const [deletingPackageId, setDeletingPackageId] = useState<string | null>(
    null
  );
  const cartItems = useMemo(() => {
    if (!cartData?.cart?.order) {
      return [];
    }

    try {
      // Convert order to array if it's an object
      const orderArray = Array.isArray(cartData.cart.order)
        ? cartData.cart.order
        : Object.values(cartData.cart.order);

      return orderArray
        .map((pkg: PackageOrder) => {
          if (!pkg || typeof pkg !== "object") return null;

          const allProducts: CartProduct[] = [];
          const categoryMap = new Map<string, string>();

          // Add null check for menu contents
          if (
            cartData?.cart?.menu?.contents &&
            Array.isArray(cartData.cart.menu.contents)
          ) {
            cartData.cart.menu.contents.forEach((content: MenuContent) => {
              if (content?.ids) {
                // Add check for content.ids
                content.ids.forEach((id) => {
                  categoryMap.set(id.toString(), content.name);
                });
              }
            });
          }

          // Process all products in the package
          if (pkg.products && typeof pkg.products === "object") {
            Object.entries(pkg.products).forEach(([categoryId, products]) => {
              if (Array.isArray(products)) {
                products.forEach((product: CartProduct) => {
                  if (product && typeof product === "object") {
                    const categoryName =
                      categoryMap.get(categoryId) || "Andere";

                    const extendedProduct: CartProduct = {
                      ...product,
                      category_name: categoryName,
                      package_name: pkg.package || "Unbekanntes Paket",
                      package_price:
                        typeof pkg.price === "number" ? pkg.price : 0,
                    };
                    allProducts.push(extendedProduct);
                  }
                });
              }
            });
          }

          // Group products by category for display
          const groupedProducts = allProducts.reduce((acc, product) => {
            const category = product.category_name || "Andere";
            if (!acc[category]) {
              acc[category] = [];
            }
            acc[category].push(product);
            return acc;
          }, {} as { [key: string]: CartProduct[] });

          return {
            ...pkg,
            groupedProducts,
            products: allProducts,
            guests: pkg.guests,
          };
        })
        .filter(Boolean);
    } catch (error) {
      console.error("Error processing cart items:", error);
      return [];
    }
  }, [cartData]);

  // Calculate extras total first
  const extrasTotal = useMemo(() => calculateExtrasTotal(cartData), [cartData]);

  // Format the extras total for display
  const formattedExtrasTotal = useMemo(
    () => formatExtrasTotal(extrasTotal),
    [extrasTotal]
  );

  // Then calculate subtotal and total
  const { subTotal, totalPrice } = useMemo(
    () => calculateTotals(cartData, extrasTotal),
    [cartData, extrasTotal]
  );

  const handleIncrement = async (item: CartProduct) => {
    if (!item?.cart_id) {
      toast.error("Ungültiges Produkt");
      return;
    }

    setLoadingStates((prev) => ({ ...prev, [item.cart_id]: true }));

    try {
      const newQuantity = Number(item.quantity) + 1;
      if (isNaN(newQuantity)) {
        throw new Error("Ungültige Menge");
      }

      const response = await editProduct({
        id: item.cart_id,
        quantity: newQuantity,
      }).unwrap();

      await refetch();

      if (response.success) {
        toast.success("Artikelmenge erhöht");
      } else {
        handleError(response, "Fehler beim Erhöhen der Artikelmenge");
      }
    } catch (error) {
      handleError(error, "Fehler beim Erhöhen der Artikelmenge");
    } finally {
      setLoadingStates((prev) => ({ ...prev, [item.cart_id]: false }));
    }
  };

  const handleDecrement = async (item: CartProduct) => {
    if (Number(item.quantity) > 1) {
      try {
        const newQuantity = Number(item.quantity) - 1;
        const response = await editProduct({
          id: item.cart_id,
          quantity: newQuantity,
        }).unwrap();
        await refetch();

        if (response.success) {
          toast.success("Artikelmenge verringert");
        } else {
          toast.error("Fehler beim Verringern der Artikelmenge");
        }
      } catch (error: any) {
        toast.error(
          error.data?.message || "Fehler beim Verringern der Artikelmenge"
        );
      }
    } else {
      handleRemove(item);
    }
  };

  const handleRemove = async (item: CartProduct) => {
    try {
      const response = await removeProduct({
        id: item.cart_id,
        quantity: 0,
      }).unwrap();
      await refetch();

      if (response.success) {
        toast.success(response.message || "Artikel aus dem Warenkorb entfernt");
      } else {
        toast.error(response.message || "Fehler beim Entfernen des Artikels");
      }
    } catch (error: any) {
      toast.error(error.data?.message || "Fehler beim Entfernen des Artikels");
    }
  };

  const handleCheckout = async () => {
    setIsProcessing(true);
    try {
      // Format cart data for checkout
      const formattedPackages = Array.isArray(cartData?.cart?.order)
        ? cartData.cart.order
        : Object.values(cartData?.cart?.order || {});

      // Make sure guest counts are included in the packages
      const packagesWithGuests = formattedPackages.map((pkg: any) => ({
        ...pkg,
        guests: pkg.guests || null,
      }));

      // Store the formatted data for use in checkout
      localStorage.setItem(
        "checkoutData",
        JSON.stringify({
          packages: packagesWithGuests,
          totals: cartData?.totals,
        })
      );

      router.push("/checkout");
    } catch (error) {
      toast.error("Fehler beim Weiterleiten zum Auftrag");
      setIsProcessing(false);
    }
  };

  const handleClearCart = async () => {
    if (window.confirm("Möchten Sie wirklich den gesamten Warenkorb leeren?")) {
      try {
        await deletePackage({}).unwrap();
        toast.success("Warenkorb wurde erfolgreich geleert");
      } catch (error) {
        toast.error("Fehler beim Leeren des Warenkorbs");
      }
    }
  };

  const handleDeletePackage = async (
    packageId: string,
    packageName: string
  ) => {
    try {
      setDeletingPackageId(packageId);
      await deletePackage({ id: packageId }).unwrap();
      toast.success(`${packageName} wurde erfolgreich entfernt`);
      await refetch(); // Refetch cart data after deletion
    } catch (error) {
      toast.error("Fehler beim Entfernen des Pakets");
      console.error("Error deleting package:", error);
    } finally {
      setDeletingPackageId(null);
    }
  };

  if (isCartLoading) {
    return (
      <div className="min-h-screen py-12 px-4 md:px-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-5xl mx-auto">
          <CartSkeleton />
        </div>
      </div>
    );
  }

  if (cartError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <div className="text-center space-y-4">
          <h2 className="text-xl text-red-500">
            Fehler beim Laden des Warenkorbs
          </h2>
          <button
            onClick={() => refetch()}
            className="px-6 py-3 bg-first text-black rounded-xl hover:bg-first/90 transition-all shadow-sm hover:shadow"
          >
            Erneut versuchen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-grow">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Header */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-8 overflow-hidden">
                <div className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center gap-4">
                      <div className="p-3 bg-first/10 rounded-xl">
                        <ShoppingCart className="h-8 w-8 text-first" />
                      </div>
                      Ihr Warenkorb
                    </h1>
                    {cartItems.length > 0 && (
                      <button
                        onClick={handleClearCart}
                        disabled={isDeleting}
                        className="group flex items-center gap-2 px-4 py-2.5 
                                 bg-red-50 text-red-500 rounded-xl transition-all duration-200
                                 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isDeleting ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span>Wird geleert...</span>
                          </>
                        ) : (
                          <>
                            <Trash2 className="h-5 w-5" />
                            <span>Warenkorb leeren</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Cart Items */}
              {cartItems.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex flex-col items-center justify-center py-24 px-4 bg-white rounded-2xl shadow-sm border border-gray-100"
                >
                  <div className="mb-8">
                    <div className="p-6 bg-first/10 rounded-full">
                      <ShoppingCart className="h-16 w-16 text-first" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                    Ihr Warenkorb ist leer
                  </h2>
                  <p className="text-gray-500 mb-8 text-center max-w-md">
                    Sie haben noch keine Artikel in Ihrem Warenkorb. Entdecken
                    Sie unser Menü und finden Sie etwas Leckeres!
                  </p>
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-first 
                           text-black rounded-xl font-medium hover:bg-first/90 
                           transition-all duration-200 shadow-sm hover:shadow"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    Menü durchsuchen
                  </Link>
                </motion.div>
              ) : (
                <div className="space-y-6">
                  <AnimatePresence mode="wait">
                    {Array.isArray(cartData?.cart?.order)
                      ? cartData.cart.order.map(
                          (pkg: PackageOrder, index: number) => (
                            <motion.div
                              key={`${pkg.package}-${index}`}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                            >
                              <CartPackage
                                pkg={pkg}
                                cartData={cartData}
                                onIncrement={handleIncrement}
                                onDecrement={handleDecrement}
                                onRemove={handleRemove}
                                loadingStates={loadingStates}
                                isDeleting={
                                  isDeleting && deletingPackageId === pkg.id
                                }
                                handleDeletePackage={() =>
                                  handleDeletePackage(pkg.id!, pkg.package)
                                }
                              />
                            </motion.div>
                          )
                        )
                      : Object.values(cartData?.cart?.order || {}).map(
                          (pkg, index) => {
                            const packageOrder = pkg as PackageOrder;
                            return (
                              <motion.div
                                key={`${packageOrder.package}-${index}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                              >
                                <CartPackage
                                  pkg={packageOrder}
                                  cartData={cartData}
                                  onIncrement={handleIncrement}
                                  onDecrement={handleDecrement}
                                  onRemove={handleRemove}
                                  loadingStates={loadingStates}
                                  isDeleting={
                                    isDeleting &&
                                    deletingPackageId === packageOrder.id
                                  }
                                  handleDeletePackage={() =>
                                    handleDeletePackage(
                                      packageOrder.id!,
                                      packageOrder.package
                                    )
                                  }
                                />
                              </motion.div>
                            );
                          }
                        )}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          </div>

          {/* Cart Summary - Sticky Sidebar */}
          {cartItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:w-[380px] shrink-0"
            >
              <div className="sticky top-32">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-6">
                      Zusammenfassung
                    </h2>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center text-gray-600">
                        <span>Zwischensumme</span>
                        <span className="font-medium text-gray-900">
                          {subTotal}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-gray-600">
                        <span>Extras</span>
                        <span className="font-medium text-gray-900">
                          {formattedExtrasTotal}
                        </span>
                      </div>
                      <div className="pt-4 border-t border-gray-100">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-semibold text-gray-900">
                            Gesamt
                          </span>
                          <span className="text-2xl font-bold text-gray-900">
                            {totalPrice}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 space-y-4">
                      <button
                        onClick={handleCheckout}
                        disabled={isProcessing}
                        className="w-full flex items-center justify-center gap-2 
                                 bg-first text-black px-8 py-4 
                                 rounded-xl font-medium transition-all
                                 hover:bg-first/90 disabled:opacity-50 
                                 disabled:cursor-not-allowed shadow-sm hover:shadow"
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Verarbeiten...</span>
                          </>
                        ) : (
                          "Angebot einholen"
                        )}
                      </button>
                      <Link
                        href="/#menu-section"
                        className="w-full flex items-center justify-center px-8 py-4 
                               bg-gray-50 text-gray-900 rounded-xl hover:bg-gray-100 
                               transition-all font-medium"
                      >
                        Zurück zu den Menüs
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
