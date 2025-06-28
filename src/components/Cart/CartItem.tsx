import React from "react";
import { CartProduct } from "../../types/types";
import { useGetProductByIdQuery } from "@/services/api";
import { Loader2 } from "lucide-react";
import ProductItem from "@/components/Products/ProductItem";

interface CartItemProps {
  item: CartProduct;
  onIncrement: (item: CartProduct) => void;
  onDecrement: (item: CartProduct) => void;
  onRemove: (item: CartProduct) => void;
  categoryName: string;
  isLoading?: boolean;
}

export const CartItem: React.FC<CartItemProps> = ({
  item,
  onIncrement,
  onDecrement,
  onRemove,
  categoryName,
  isLoading,
}) => {
  if (!item?.cart_id || !item?.product_id || !item?.name) {
    return null;
  }

  const {
    data: productDetails,
    isLoading: isProductLoading,
    error: productError,
  } = useGetProductByIdQuery(item.product_id.toString());

  if (isProductLoading) {
    return (
      <div className="animate-pulse bg-white rounded-xl p-4 border border-gray-100">
        <div className="flex items-center gap-6">
          <div className="w-[100px] h-[100px] rounded-lg bg-gray-100" />
          <div className="flex-grow space-y-3">
            <div className="h-5 w-48 bg-gray-100 rounded-md" />
            <div className="h-4 w-32 bg-gray-100 rounded-md" />
          </div>
          <div className="flex items-center gap-4">
            <div className="h-10 w-24 bg-gray-100 rounded-lg" />
            <div className="h-8 w-32 bg-gray-100 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (productError || !productDetails?.products?.[0]) {
    return (
      <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-100">
        <p className="text-sm text-red-600">
          Fehler beim Laden der Produkt-Details
        </p>
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white text-red-600 rounded-lg hover:bg-red-50 transition-colors"
        >
          <Loader2 className="w-4 h-4 animate-spin" />
          Erneut laden
        </button>
      </div>
    );
  }

  const productForItem = {
    product_id: parseInt(item.product_id),
    name: item.name,
    thumb: item.image || "/placeholder.png",
    price: item.price,
    quantity: parseInt(item.quantity) || 0,
    leadTime: productDetails.products[0].leadTime,
  };

  return (
    <ProductItem
      product={productForItem}
      onIncrement={() => onIncrement(item)}
      onDecrement={() => onDecrement(item)}
      onRemove={() => onRemove(item)}
      isLoading={isLoading}
    />
  );
};
