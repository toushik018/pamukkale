"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { FiCheck } from "react-icons/fi";
import Link from "next/link";
import {
  useAddToCartMutation,
  useEditProductMutation,
  useRemoveProductMutation,
  useGetCartQuery,
} from "@/services/api";
import { Product } from "@/types/product";
import { FaMinus, FaPlus } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  setSelectedProduct,
  showExtraModal,
  clearSelectedProduct,
  selectIsExtraMode,
} from "@/redux/slices/extraSlice";
import { useAddExtraMutation } from "@/services/api";
import { Loader2 } from "lucide-react";

interface HorizontalMenuCardProps {
  product: Product;
  activeCategoryName: string;
}

const HorizontalMenuCard = ({
  product,
  activeCategoryName,
}: HorizontalMenuCardProps) => {
  const [localQuantity, setLocalQuantity] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const { data: cartData, refetch: refetchCart } = useGetCartQuery();
  const [addToCart] = useAddToCartMutation();
  const [editProduct] = useEditProductMutation();
  const [removeProduct] = useRemoveProductMutation();

  const dispatch = useDispatch();
  const isExtraMode = useSelector(selectIsExtraMode);
  const [addExtra] = useAddExtraMutation();

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
    const toastId = toast.loading("Warenkorb aktualisieren...");
    try {
      if (isExtraMode) {
        const response = await addExtra({
          product_id: product.product_id,
        }).unwrap();

        if (response.success) {
          toast.success("Extra erfolgreich hinzugefügt", { id: toastId });
        }
      } else {
        const newQuantity = localQuantity + 1;
        const cartItem = cartData?.products?.find(
          (item: any) => item.product_id === product.product_id
        );

        if (cartItem) {
          await editProduct({ id: cartItem.cart_id, quantity: newQuantity });
        } else {
          await addToCart({ id: product.product_id, quantity: 1 });
        }

        toast.success("Produkt zum Warenkorb hinzugefügt", { id: toastId });
      }

      setLocalQuantity((prev) => prev + 1);
    } catch (error) {
      toast.error("Fehler beim Hinzufügen", { id: toastId });
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
    <div className="relative group h-[420px]">
      <div className="relative flex flex-col h-full bg-first rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg border border-third">
        {/* Product Image */}
        <Link
          href={`/shop/${product.product_id}?menuName=${encodeURIComponent(
            activeCategoryName
          )}`}
          className="relative aspect-square w-full overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-second/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <img
            src={product.thumb || "/images/placeholder.png"}
            alt={product.name}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
          />
        </Link>

        {/* Product Info */}
        <div className="flex flex-col flex-1 p-4">
          <div className="flex-1 min-h-0">
            <div className="flex items-start justify-between gap-3 mb-3">
              <h3 className="text-base font-medium text-second line-clamp-2 group-hover:text-second/90 transition-colors">
                {product.name}
              </h3>
              <span className="shrink-0 text-base font-semibold text-second/90 bg-third/10 px-3 py-1 rounded-full">
                {product.price}€
              </span>
            </div>
            <div className="h-[48px] overflow-hidden">
              {product.description && (
                <p className="text-sm text-accentGray leading-relaxed line-clamp-2">
                  {product.description}
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-4 mt-3 border-t border-third/10">
            {localQuantity > 0 && (
              <>
                <button
                  onClick={handleDecrement}
                  disabled={isUpdating}
                  className="w-9 h-9 rounded-xl bg-third/10 text-second hover:bg-second hover:text-first flex items-center justify-center transition-all duration-300"
                >
                  <FaMinus className="w-3 h-3" />
                </button>
                <span className="w-8 text-center font-medium text-second">
                  {localQuantity}
                </span>
              </>
            )}
            <button
              onClick={handleIncrement}
              disabled={isUpdating}
              className="w-9 h-9 rounded-xl bg-second text-first flex items-center justify-center hover:bg-second/90 transition-all duration-300"
            >
              <FaPlus className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {isUpdating && (
        <div className="absolute inset-0 bg-first/50 backdrop-blur-sm rounded-2xl flex items-center justify-center">
          <div className="animate-spin">
            <Loader2 className="w-6 h-6 text-second" />
          </div>
        </div>
      )}
    </div>
  );
};

export default HorizontalMenuCard;
