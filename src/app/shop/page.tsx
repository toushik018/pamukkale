"use client";

import { Suspense } from "react";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ProductList from "@/components/Products/ProductList";
import { toast } from "sonner";
import {
  useGetCartQuery,
  useGetMenuContentQuery,
  useGetCategoriesQuery,
  useAddPackageMutation,
} from "@/services/api";
import ExtraProductsModal from "@/components/Modals/ExtraProductsModal";
import Stepper from "@/components/Stepper/Stepper";
import { ShopSkeleton } from "@/components/Skeletons";
import CartSummary from "@/components/Cart/CartSummary";
import { useDispatch, useSelector } from "react-redux";
import {
  clearSelectedProduct,
  selectShowModal,
  hideExtraModal,
  showExtraModal,
  setExtraMode,
} from "@/redux/slices/extraSlice";

interface MenuContent {
  name: string;
  ids: number[];
  count: number;
  currentCount?: number;
}

// Wrapper component with Suspense
const ShopWrapper = () => {
  return (
    <Suspense fallback={<ShopSkeleton />}>
      <Shop />
    </Suspense>
  );
};

// existing Shop component (unchanged)
const Shop = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const searchParams = useSearchParams();
  const menuId = searchParams.get("menu");
  const router = useRouter();
  const dispatch = useDispatch();
  const showExtraProductsModal = useSelector(selectShowModal);
  const [categoryStates, setCategoryStates] = useState<{
    [key: string]: {
      hasShownModal: boolean;
      lastCount: number;
    };
  }>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(`categoryStates-${menuId}`);
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });

  const {
    data: cartData,
    isLoading: isCartLoading,
    refetch: refetchCart,
  } = useGetCartQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const {
    data: menuContentData,
    isLoading: isMenuContentLoading,
    error: menuContentError,
  } = useGetMenuContentQuery(Number(menuId), {
    skip: !menuId || isNaN(Number(menuId)),
  });

  const menuContents = useMemo(() => {
    if (
      !menuContentData?.contents ||
      !Array.isArray(menuContentData.contents)
    ) {
      return [];
    }
    return menuContentData.contents;
  }, [menuContentData]);

  const currentCategory = useMemo(() => {
    if (
      !menuContents.length ||
      activeStep < 0 ||
      activeStep >= menuContents.length
    ) {
      return null;
    }
    return menuContents[activeStep];
  }, [menuContents, activeStep]);

  useEffect(() => {
    if (!menuId) {
      setError("Menü ID fehlt. Bitte wählen Sie ein Menü aus.");
      router.push("/");
      return;
    }

    if (menuContentError) {
      setError(
        "Fehler beim Laden des Menüs. Bitte versuchen Sie es später erneut."
      );
      return;
    }

    if (menuContents.length === 0 && !isMenuContentLoading) {
      setError("Keine Menüinhalte gefunden.");
      return;
    }

    setError(null);
  }, [
    menuId,
    menuContentError,
    menuContents.length,
    isMenuContentLoading,
    router,
  ]);

  useEffect(() => {
    if (
      menuContents.length > 0 &&
      (activeStep < 0 || activeStep >= menuContents.length)
    ) {
      setActiveStep(0);
    }
  }, [menuContents.length, activeStep]);

  const [addPackage] = useAddPackageMutation();

  // Memoize getCurrentCategoryCount
  const getCurrentCategoryCount = useCallback(() => {
    if (!currentCategory || !cartData?.cart?.menu?.contents) return 0;

    const cartCategory = cartData.cart.menu.contents.find(
      (content: any) => content.name === currentCategory.name
    );

    if (cartCategory?.currentCount !== undefined) {
      return cartCategory.currentCount;
    }

    if (cartData.products && cartData.products.length > 0) {
      const validProductIds = allProducts.map((p) => p.product_id.toString());

      const categoryProducts = cartData.products.filter(
        (product: { product_id: any }) =>
          validProductIds.includes(product.product_id)
      );

      return categoryProducts.reduce(
        (sum: number, product: any) => sum + Number(product.quantity),
        0
      );
    }

    return 0;
  }, [
    currentCategory?.name,
    cartData?.cart?.menu?.contents,
    cartData?.products,
    allProducts,
  ]);

  // Memoize the current count to prevent infinite loops
  const currentCount = useMemo(
    () => getCurrentCategoryCount(),
    [getCurrentCategoryCount]
  );

  const { data: categoriesData } = useGetCategoriesQuery();

  useEffect(() => {
    const fetchProducts = async () => {
      if (!currentCategory?.ids) return;

      setIsLoadingProducts(true);
      setAllProducts([]);

      try {
        const productPromises = currentCategory.ids.map((id: number) =>
          fetch(`/api/get-products-by-category`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ categoryId: id.toString() }),
          }).then(async (res) => {
            const data = await res.json();
            if (data.products) {
              return {
                ...data,
                products: data.products.map((product: any) => ({
                  ...product,
                  category_id: id.toString(),
                })),
              };
            }
            return data;
          })
        );

        const results = await Promise.all(productPromises);
        const combinedProducts = results.reduce((acc, result) => {
          if (result.products) {
            return [...acc, ...result.products];
          }
          return acc;
        }, []);

        setAllProducts(combinedProducts);
      } catch (error) {
        console.error("Fehler beim Laden der Produkte:", error);
        toast.error("Fehler beim Laden der Produkte");
      } finally {
        setIsLoadingProducts(false);
      }
    };

    fetchProducts();
  }, [currentCategory?.ids]);
  useEffect(() => {
    if (currentCategory && !categoryStates[currentCategory.name]) {
      setCategoryStates((prev) => ({
        ...prev,
        [currentCategory.name]: {
          hasShownModal: false,
          lastCount: currentCount,
        },
      }));
    }
  }, [currentCategory?.name, currentCount]);

  const shouldShowExtraModal = (categoryName: string) => {
    // Never show modal for Extras category
    if (categoryName === "Extras") return false;

    const categoryState = categoryStates[categoryName];
    const currentCategoryData = menuContents?.find(
      (c: { name: string }) => c.name === categoryName
    );
    const requiredCount = currentCategoryData?.count || 0;

    return (
      currentCount >= requiredCount &&
      !categoryState?.hasShownModal &&
      currentCount > (categoryState?.lastCount || 0)
    );
  };

  // Update modal visibility logic
  useEffect(() => {
    if (!currentCategory) return;

    const categoryName = currentCategory.name;

    // Skip modal logic for Extras category
    if (categoryName === "Extras") return;

    const requiredCount = currentCategory.count || 0;
    const categoryState = categoryStates[categoryName];

    if (categoryState) {
      // Reset extra mode if count drops below requirement
      if (currentCount < requiredCount) {
        dispatch(setExtraMode(false));
        setCategoryStates((prev) => ({
          ...prev,
          [categoryName]: {
            hasShownModal: false,
            lastCount: currentCount,
          },
        }));
      }
      // Show modal ONLY when conditions are met AND hasn't been shown yet
      // else if (
      //   currentCount >= requiredCount &&
      //   !categoryState.hasShownModal &&
      //   currentCount > categoryState.lastCount
      // ) {

      // Show modal only for non-Extra categories
      else if (shouldShowExtraModal(categoryName)) {
        dispatch(showExtraModal());
        setCategoryStates((prev) => ({
          ...prev,
          [categoryName]: {
            hasShownModal: true,
            lastCount: currentCount,
          },
        }));
      }
      // Just update last count without showing modal
      // else if (currentCount !== categoryState.lastCount) {
      //   setCategoryStates((prev) => ({
      //     ...prev,
      //     [categoryName]: {
      //       ...prev[categoryName],
      //       lastCount: currentCount,
      //     },
      //   }));
      // }
    }
  }, [currentCategory?.name, currentCount]);

  useEffect(() => {
    return () => {
      if (menuId) {
        localStorage.removeItem(`categoryStates-${menuId}`);
      }
    };
  }, [menuId]);

  useEffect(() => {
    if (menuId) {
      localStorage.setItem(
        `categoryStates-${menuId}`,
        JSON.stringify(categoryStates)
      );
    }
  }, [categoryStates, menuId]);

  const handleNext = async () => {
    const currentCount = getCurrentCategoryCount();
    const requiredCount = currentCategory?.count || 0;

    if (currentCount < requiredCount) {
      toast.error(
        `Bitte wählen Sie mindestens ${requiredCount} ${
          currentCategory.name
        } Artikel${
          requiredCount > 1 ? "s" : ""
        }. Sie haben ${currentCount} ausgewählt.`
      );
      return;
    }

    if (activeStep < menuContents.length - 1) {
      setActiveStep((prevStep) => prevStep + 1);
    } else {
      // This is the last step, call addPackage before proceeding to cart
      try {
        await addPackage({
          guests: Number(guestCount),
          date: date || undefined,
          time: time || undefined,
        }).unwrap();
        router.push("/cart");
      } catch (error) {
        toast.error("Fehler beim Hinzufügen des Pakets");
      }
    }
  };

  const handlePrevious = () => {
    if (activeStep > 0) {
      setActiveStep((prevStep) => prevStep - 1);
    }
  };

  const handleModalNext = async () => {
    const currentCount = getCurrentCategoryCount();
    const requiredCount = currentCategory?.count || 0;

    if (currentCount < requiredCount) {
      toast.error(
        `Bitte wählen Sie mindestens ${requiredCount} ${
          currentCategory.name
        } Artikel${
          requiredCount > 1 ? "s" : ""
        }. Sie haben ${currentCount} ausgewählt.`
      );
      return;
    }

    if (activeStep < menuContents.length - 1) {
      setActiveStep((prevStep) => prevStep + 1);
    } else {
      // Last step, call addPackage before proceeding
      try {
        await addPackage({ guests: Number(guestCount) }).unwrap();
        router.push("/cart");
      } catch (error) {
        toast.error("Fehler beim Hinzufügen des Pakets");
      }
    }
  };

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading state for smoother transition
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const guestCount = searchParams.get("guests");
  const date = searchParams.get("date");
  const time = searchParams.get("time");

  useEffect(() => {
    // Redirect if no guest count
    if (!guestCount) {
      router.push("/");
    }
  }, [guestCount, router]);

  const [error, setError] = useState<string | null>(null);

  const handleStepClick = (targetStep: number) => {
    // If trying to go back, always allow it
    if (targetStep < activeStep) {
      setActiveStep(targetStep);
      return;
    }

    // If current step is Extras, allow navigation
    if (currentCategory?.name === "Extras") {
      setActiveStep(targetStep);
      return;
    }

    // Check if current category requirements are met
    const requiredCount = currentCategory?.count || 0;
    if (getCurrentCategoryCount() >= requiredCount) {
      setActiveStep(targetStep);
    } else {
      toast.error(
        `Bitte wählen Sie ${requiredCount} Produkte aus der Kategorie "${currentCategory?.name}" aus.`
      );
    }
  };

  useEffect(() => {
    if (currentCategory?.name === "Extras") {
      // Disable extra mode when in Extras category
      dispatch(setExtraMode(false));
    }
  }, [currentCategory?.name, dispatch]);

  if (isCartLoading || isMenuContentLoading || isLoadingProducts || isLoading) {
    return <ShopSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md mx-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Oops! Ein Fehler ist aufgetreten
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 bg-first text-second rounded-xl font-medium
                     hover:bg-first/90 transition-all duration-200"
          >
            Zurück zur Startseite
          </button>
        </div>
      </div>
    );
  }

  // Add safety check before rendering main content
  if (!currentCategory || !menuContents.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <p className="text-gray-600">Keine Menüinhalte verfügbar.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="w-full h-full">
        <div className="max-w-[1800px] mx-auto flex">
          {/* Left Sidebar with Stepper - Now fixed below navbar */}
          <div className="w-[300px] fixed top-[64px] md:top-[80px] left-0 bottom-0 bg-first border-r border-third z-40">
            <div className="p-6">
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-second mb-2">
                  {currentCategory?.name || "Menü"}
                </h1>
                <p className="text-sm text-accentGray">
                  {currentCategory?.count || 0} Auswahl inklusive im Paket
                </p>
              </div>

              {/* Vertical Stepper */}
              <div className="overflow-y-auto h-[calc(100vh-64px-180px)] md:h-[calc(100vh-80px-180px)]">
                <Stepper
                  steps={menuContents || []}
                  activeStep={activeStep}
                  onPrevious={handlePrevious}
                  onNext={handleNext}
                  onStepClick={handleStepClick}
                />
              </div>
            </div>
          </div>

          {/* Main Content Area - Adjusted margin to account for fixed stepper */}
          <div className="flex-1 ml-[300px] min-h-screen">
            <div className="p-8">
              {/* Products Grid */}
              <div className="bg-first rounded-[2rem] shadow-sm">
                <div className="p-8">
                  <ProductList
                    products={allProducts}
                    menuContents={menuContents}
                    activeCategoryName={currentCategory?.name}
                    currentCount={getCurrentCategoryCount()}
                    requiredCount={currentCategory?.count || 0}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Cart Summary - Now rendered as a fixed bottom bar */}
          <CartSummary
            cartData={cartData}
            currentCategory={currentCategory}
            getCurrentCategoryCount={getCurrentCategoryCount}
            activeStep={activeStep}
            menuContents={menuContents}
            onPrevious={handlePrevious}
            onNext={handleNext}
          />
        </div>
      </div>

      {/* Keep your existing modal */}
      <ExtraProductsModal onNext={handleModalNext} />
    </div>
  );
};

export default ShopWrapper;
