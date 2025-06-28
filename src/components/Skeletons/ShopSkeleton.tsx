// Create a skeleton component for the shop page
const ShopSkeleton = () => {
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="w-full h-full">
        <div className="max-w-[1800px] mx-auto flex">
          {/* Left Sidebar with Stepper */}
          <div className="w-[300px] fixed top-[64px] md:top-[80px] left-0 bottom-0 bg-white border-r border-gray-100 z-40">
            <div className="p-6">
              <div className="mb-8">
                <div className="h-8 w-48 bg-gray-100 animate-pulse rounded-lg mb-2" />
                <div className="h-5 w-32 bg-gray-100 animate-pulse rounded-lg" />
              </div>

              {/* Vertical Stepper Skeleton */}
              <div className="space-y-8">
                {[1, 2, 3, 4].map((_, idx) => (
                  <div key={idx} className="relative pl-16">
                    <div className="absolute left-0 w-12 h-12 rounded-xl bg-gray-100 animate-pulse" />
                    <div className="py-2">
                      <div className="h-6 w-32 bg-gray-100 animate-pulse rounded-lg mb-2" />
                      <div className="h-4 w-24 bg-gray-100 animate-pulse rounded-lg" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 ml-[300px] min-h-screen">
            <div className="p-8">
              {/* Progress Indicator Skeleton */}
              <div className="sticky top-[64px] md:top-[80px] z-50 bg-white/80 backdrop-blur-md px-6 py-3 rounded-[1rem] border border-gray-100 mb-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="h-4 w-20 bg-gray-100 animate-pulse rounded-lg mb-1" />
                      <div className="h-6 w-40 bg-gray-100 animate-pulse rounded-lg" />
                    </div>
                  </div>
                  <div className="w-32 h-2 rounded-full bg-gray-100 animate-pulse" />
                </div>
              </div>

              {/* Products Grid */}
              <div className="bg-white rounded-[2rem] shadow-sm">
                <div className="p-8">
                  <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                      <div
                        key={i}
                        className="bg-white rounded-2xl overflow-hidden border border-gray-100"
                      >
                        {/* Image Skeleton */}
                        <div className="aspect-square w-full bg-gray-100 animate-pulse" />

                        {/* Content */}
                        <div className="p-4">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div className="h-5 w-32 bg-gray-100 animate-pulse rounded-lg" />
                            <div className="h-5 w-16 bg-gray-100 animate-pulse rounded-lg" />
                          </div>
                          <div className="h-4 w-full bg-gray-100 animate-pulse rounded-lg mb-2" />
                          <div className="h-4 w-3/4 bg-gray-100 animate-pulse rounded-lg" />

                          {/* Action Buttons */}
                          <div className="flex items-center justify-end gap-2 pt-3 mt-3 border-t border-gray-100">
                            <div className="h-8 w-8 bg-gray-100 animate-pulse rounded-lg" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Cart Summary Skeleton */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-lg z-50">
          <div className="max-w-[1800px] mx-auto">
            <div className="flex items-center justify-between p-4">
              {/* Selection Progress */}
              <div className="flex items-center gap-6">
                {/* Current Selection Info */}
                <div className="flex items-center gap-3">
                  <div className="flex flex-col">
                    <div className="h-4 w-24 bg-gray-100 animate-pulse rounded-lg mb-1" />
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-16 bg-gray-100 animate-pulse rounded-lg" />
                      <div className="h-5 w-32 bg-gray-100 animate-pulse rounded-lg" />
                    </div>
                  </div>
                  <div className="w-20 h-1.5 rounded-full bg-gray-100 animate-pulse" />
                </div>

                {/* Cart Summary Button */}
                <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-xl">
                  <div className="w-5 h-5 bg-gray-100 animate-pulse rounded-full" />
                  <div>
                    <div className="h-4 w-16 bg-gray-100 animate-pulse rounded-lg mb-1" />
                    <div className="h-5 w-20 bg-gray-100 animate-pulse rounded-lg" />
                  </div>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex gap-3">
                <div className="h-12 w-28 bg-gray-100 animate-pulse rounded-xl" />
                <div className="h-12 w-32 bg-gray-100 animate-pulse rounded-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Spacing */}
        <div className="h-20" />
      </div>
    </div>
  );
};

export default ShopSkeleton;
