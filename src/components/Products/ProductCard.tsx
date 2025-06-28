import { Product } from "@/types/product";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  useAddToCartMutation,
  useEditProductMutation,
  useRemoveProductMutation,
  useGetCartQuery,
} from "@/services/api";
import { toast } from "sonner";
import { FiMinus, FiPlus, FiCheck, FiInfo } from "react-icons/fi";

interface ProductCardProps {
  product: Product;
  activeCategoryName: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  activeCategoryName,
}) => {
  const [localQuantity, setLocalQuantity] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [addToCart] = useAddToCartMutation();
  const [editProduct] = useEditProductMutation();
  const [removeProduct] = useRemoveProductMutation();
  const { data: cartData, refetch: refetchCart } = useGetCartQuery();

  useEffect(() => {
    const cartItem = cartData?.products?.find(
      (item: any) => item.product_id === product.product_id
    );
    setLocalQuantity(cartItem ? Number(cartItem.quantity) : 0);
  }, [cartData, product.product_id]);

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 0) return;
    setIsUpdating(true);
    const toastId = toast.loading("Warenkorb aktualisieren...");
    try {
      const cartItem = cartData?.products?.find(
        (item: any) => item.product_id === product.product_id
      );
      if (newQuantity === 0 && cartItem) {
        await removeProduct({ id: cartItem.cart_id, quantity: 0 });
        toast.success("Produkt aus Warenkorb entfernt", { id: toastId });
      } else if (cartItem) {
        await editProduct({ id: cartItem.cart_id, quantity: newQuantity });
        toast.success("Menge aktualisiert", { id: toastId });
      } else if (newQuantity > 0) {
        await addToCart({ id: product.product_id, quantity: newQuantity });
        toast.success("Produkt zum Warenkorb hinzugefügt", { id: toastId });
      }
      setLocalQuantity(newQuantity);
    } catch (error) {
      console.error("Fehler beim Aktualisieren des Warenkorbs", error);
      toast.error(
        "Fehler beim Aktualisieren des Warenkorbs. Bitte versuchen Sie es erneut.",
        { id: toastId }
      );
    } finally {
      setIsUpdating(false);
      setIsEditing(false);
      refetchCart();
    }
  };

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newQuantity = parseInt(inputValue);
    if (!isNaN(newQuantity)) {
      handleQuantityChange(newQuantity);
    }
    setIsEditing(false);
  };

  const handleIncrement = async () => {
    setIsUpdating(true);
    const toastId = toast.loading("Warenkorb aktualisieren...");
    try {
      const newQuantity = localQuantity + 1;
      const cartItem = cartData?.products?.find(
        (item: any) => item.product_id === product.product_id
      );
      if (cartItem) {
        await editProduct({ id: cartItem.cart_id, quantity: newQuantity });
      } else {
        await addToCart({ id: product.product_id, quantity: 1 });
      }
      setLocalQuantity(newQuantity);
      toast.success("Produkt zum Warenkorb hinzugefügt", { id: toastId });

      const currentCategory = cartData?.cart?.menu?.contents?.find(
        (content: any) => content.name === activeCategoryName
      );

      if (currentCategory) {
        const requiredCount = currentCategory.count || 0;
        const currentCount = (currentCategory.currentCount || 0) + 1;

        if (currentCount >= requiredCount) {
          window.dispatchEvent(
            new CustomEvent("showExtraProductsModal", {
              detail: { categoryName: activeCategoryName },
            })
          );
        }
      }
    } catch (error) {
      console.error("Fehler beim Erhöhen der Menge", error);
      toast.error(
        "Fehler beim Aktualisieren des Warenkorbs. Bitte versuchen Sie es erneut.",
        { id: toastId }
      );
    } finally {
      setIsUpdating(false);
      refetchCart();
    }
  };

  const handleDecrement = async () => {
    if (localQuantity > 0) {
      setIsUpdating(true);
      const toastId = toast.loading("Warenkorb aktualisieren...");
      try {
        const newQuantity = localQuantity - 1;
        const cartItem = cartData?.products?.find(
          (item: any) => item.product_id === product.product_id
        );
        if (cartItem) {
          if (newQuantity === 0) {
            await removeProduct({ id: cartItem.cart_id, quantity: 0 });
            toast.success("Produkt aus Warenkorb entfernt", { id: toastId });
          } else {
            await editProduct({ id: cartItem.cart_id, quantity: newQuantity });
            toast.success("Menge verringert", { id: toastId });
          }
        }
        setLocalQuantity(newQuantity);
      } catch (error) {
        console.error("Fehler beim Verringern der Menge", error);
        toast.error(
          "Fehler beim Aktualisieren des Warenkorbs. Bitte versuchen Sie es erneut.",
          {
            id: toastId,
          }
        );
      } finally {
        setIsUpdating(false);
        refetchCart();
      }
    }
  };

  return (
    <div
      className="group relative bg-black/[0.02] hover:bg-black/[0.04] rounded-2xl p-5 transition-all duration-200
                    border border-black/5 hover:border-black/10"
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-grow">
            <h3 className="text-[15px] font-medium text-black leading-snug group-hover:text-black transition-colors">
              {product.name}
            </h3>
            {product.description && (
              <p className="text-sm text-black/60 mt-1.5 line-clamp-2 leading-normal group-hover:text-black/70">
                {product.description}
              </p>
            )}
          </div>
          <Link
            href={`/shop/${product.product_id}?menuName=${encodeURIComponent(
              activeCategoryName
            )}`}
            className="shrink-0 w-7 h-7 -mt-0.5 flex items-center justify-center rounded-lg 
                     text-black/40 hover:text-black hover:bg-black/5 transition-all"
          >
            <FiInfo className="w-[18px] h-[18px]" />
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[15px] font-medium text-black group-hover:text-black">
              {product.price}
            </span>
            {product.minimum && (
              <span className="text-xs text-black/50 group-hover:text-black/60">
                Min: {product.minimum}
              </span>
            )}
          </div>

          {localQuantity > 0 ? (
            <div
              className="flex items-center justify-between bg-black/[0.03] rounded-xl border border-black/5 
                          group-hover:border-black/10 group-hover:bg-black/[0.05]"
            >
              <button
                onClick={handleDecrement}
                className="w-9 h-9 flex items-center justify-center text-black/50 
                         hover:text-black hover:bg-black/5 rounded-l-xl transition-all"
                disabled={isUpdating}
              >
                <FiMinus className="w-4 h-4" />
              </button>
              {isEditing ? (
                <form
                  onSubmit={handleInputSubmit}
                  className="min-w-[2.75rem] flex"
                >
                  <input
                    type="number"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="w-full text-center bg-transparent border-0 text-sm font-medium 
                             text-black focus:outline-none focus:ring-0"
                    autoFocus
                    onBlur={() => {
                      if (!inputValue) {
                        setIsEditing(false);
                        setInputValue(localQuantity.toString());
                      }
                    }}
                  />
                  <button
                    type="submit"
                    className="w-6 flex items-center justify-center text-black"
                  >
                    <FiCheck className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <span
                  onClick={() => {
                    setIsEditing(true);
                    setInputValue(localQuantity.toString());
                  }}
                  className="text-sm font-medium text-black min-w-[2.75rem] text-center 
                           cursor-pointer hover:bg-black/5 py-2"
                >
                  {localQuantity}
                </span>
              )}
              <button
                onClick={handleIncrement}
                className="w-9 h-9 flex items-center justify-center text-black/50 
                         hover:text-black hover:bg-black/5 rounded-r-xl transition-all"
                disabled={isUpdating}
              >
                <FiPlus className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleIncrement}
              className="w-full h-9 bg-black/[0.03] text-black/80 text-sm font-medium rounded-xl 
                       border border-black/5 group-hover:border-black/10 group-hover:bg-black/[0.05]
                       hover:bg-black/10 hover:text-black hover:border-black/20
                       transition-all focus:outline-none"
              disabled={isUpdating}
            >
              Auswählen
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
