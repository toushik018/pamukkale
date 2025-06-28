import React from "react";

export const CartItemSkeleton = () => {
  return (
    <div className="animate-pulse flex items-center gap-6 p-4 bg-white rounded-xl border border-gray-100">
      {/* Product Image */}
      <div className="w-[100px] h-[100px] bg-gray-100 rounded-lg" />

      {/* Product Info */}
      <div className="flex-grow">
        <div className="h-5 bg-gray-100 rounded-lg w-3/4 mb-2" />
        <div className="flex items-center gap-2">
          <div className="h-4 bg-gray-100 rounded-lg w-24" />
          <div className="h-4 w-1 bg-gray-100 rounded-full" />
          <div className="h-4 bg-gray-100 rounded-lg w-20" />
        </div>
      </div>

      {/* Price */}
      <div className="flex items-center gap-6">
        <div className="h-10 w-24 bg-gray-100 rounded-lg" />
      </div>
    </div>
  );
};

export const CartSkeleton = () => {
  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Main Content */}
      <div className="flex-grow">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-8 overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-100 rounded-xl w-14 h-14" />
                <div className="h-10 w-48 bg-gray-100 rounded-xl" />
              </div>
              <div className="h-10 w-36 bg-gray-100 rounded-xl" />
            </div>
          </div>
        </div>

        {/* Packages */}
        <div className="space-y-6">
          {[1, 2].map((packageIndex) => (
            <div
              key={packageIndex}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
              {/* Package Header */}
              <div className="flex justify-between items-center p-6 bg-white">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gray-100 rounded-xl w-11 h-11" />
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-7 w-40 bg-gray-100 rounded-xl" />
                      <div className="h-6 w-24 bg-gray-100 rounded-full" />
                      <div className="h-6 w-24 bg-gray-100 rounded-full" />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-32 bg-gray-100 rounded-lg" />
                      <div className="h-4 w-1 bg-gray-100 rounded-full" />
                      <div className="h-4 w-20 bg-gray-100 rounded-lg" />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-10 w-24 bg-gray-100 rounded-xl" />
                  <div className="h-8 w-8 bg-gray-100 rounded-xl" />
                  <div className="h-8 w-8 bg-gray-100 rounded-xl" />
                </div>
              </div>

              {/* Package Content */}
              <div className="space-y-6 p-6 bg-gray-50/50">
                {[1, 2].map((categoryIndex) => (
                  <div
                    key={categoryIndex}
                    className="bg-white rounded-xl p-6 shadow-sm"
                  >
                    {/* Category Header */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-2 h-2 bg-gray-100 rounded-full" />
                      <div className="h-6 w-32 bg-gray-100 rounded-xl" />
                      <div className="h-5 w-20 bg-gray-100 rounded-full" />
                    </div>

                    {/* Category Items */}
                    <div className="space-y-4">
                      {[1, 2].map((itemIndex) => (
                        <CartItemSkeleton key={itemIndex} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sticky Summary Sidebar */}
      <div className="lg:w-[380px] shrink-0">
        <div className="sticky top-32">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6">
              {/* Summary Header */}
              <div className="h-7 w-36 bg-gray-100 rounded-xl mb-6" />

              {/* Summary Content */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="h-5 w-28 bg-gray-100 rounded-lg" />
                  <div className="h-5 w-20 bg-gray-100 rounded-lg" />
                </div>
                <div className="flex justify-between items-center">
                  <div className="h-5 w-24 bg-gray-100 rounded-lg" />
                  <div className="h-5 w-20 bg-gray-100 rounded-lg" />
                </div>
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <div className="h-6 w-32 bg-gray-100 rounded-lg" />
                    <div className="h-8 w-28 bg-gray-100 rounded-lg" />
                  </div>
                </div>
              </div>

              {/* Summary Actions */}
              <div className="mt-8 space-y-4">
                <div className="h-12 w-full bg-gray-100 rounded-xl" />
                <div className="h-12 w-full bg-gray-100 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
