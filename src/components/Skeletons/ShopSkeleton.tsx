// Create a skeleton component for the shop page
const ShopSkeleton = () => {
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
                  {/* Category Sections */}
                  {[1, 2].map((categoryIndex) => (
                    <div key={categoryIndex} className="space-y-8">
                      {/* Category Header */}
                      <div className="relative flex items-center gap-4">
                        <h2 className="h-8 w-48 bg-gray-200 animate-pulse rounded-lg" />
                        <div className="flex-1 h-[1px] bg-gradient-to-r from-third/30 to-transparent" />
                      </div>

                      {/* Products Grid - Matching ProductList.tsx grid */}
                      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                          <div
                            key={i}
                            className="bg-first rounded-2xl overflow-hidden border border-third"
                          >
                            {/* Product Image Area */}
                            <div className="aspect-square w-full bg-gray-200 animate-pulse" />

                            {/* Product Info */}
                            <div className="p-4">
                              {/* Title and Price Row */}
                              <div className="flex items-start justify-between gap-3 mb-2">
                                <div className="h-6 w-32 bg-gray-200 animate-pulse rounded-md" />
                                <div className="shrink-0 h-6 w-20 bg-gray-200 animate-pulse rounded-full" />
                              </div>

                              {/* Description */}
                              <div className="mb-4">
                                <div className="h-5 w-full bg-gray-200 animate-pulse rounded-md" />
                              </div>

                              {/* Add Button */}
                              <div className="flex justify-end">
                                <div className="w-10 h-10 bg-gray-200 animate-pulse rounded-xl" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Cart Summary - Fixed bottom bar */}
          <div className="fixed bottom-0 left-0 right-0 bg-first border-t border-third z-50">
            <div className="max-w-[1800px] mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                {/* Cart Summary Info */}
                <div className="flex items-center gap-6">
                  {/* Item Count */}
                  <div className="space-y-1">
                    <div className="h-4 w-32 bg-gray-200 animate-pulse rounded-md" />
                    <div className="h-6 w-40 bg-gray-200 animate-pulse rounded-md" />
                  </div>
                  {/* Total Price */}
                  <div className="space-y-1">
                    <div className="h-4 w-24 bg-gray-200 animate-pulse rounded-md" />
                    <div className="h-6 w-32 bg-gray-200 animate-pulse rounded-md" />
                  </div>
                </div>

                {/* Checkout Button */}
                <div className="h-12 w-40 bg-gray-200 animate-pulse rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopSkeleton;
