import React from "react";

const VerticalCardSkeleton = () => (
  <div className="h-60 rounded-2xl relative bg-first border border-second/10 overflow-hidden">
    <div className="grid grid-cols-12 h-full">
      {/* Left side - Image skeleton */}
      <div className="col-span-5 relative overflow-hidden">
        <div className="absolute inset-0 bg-second/5 animate-pulse" />

        {/* Minimum clients badge skeleton */}
        <div className="absolute top-4 left-4 z-30">
          <div className="h-7 w-20 bg-second/5 animate-pulse rounded-full" />
        </div>

        {/* Diagonal divider skeleton */}
        <div className="absolute top-0 right-0 h-full w-24 bg-gradient-to-l from-first to-transparent transform skew-x-12 translate-x-12" />
      </div>

      {/* Right side - Content skeleton */}
      <div className="col-span-7 p-6 flex flex-col justify-between relative">
        {/* Title skeleton */}
        <div className="space-y-4">
          <div className="h-7 bg-second/5 animate-pulse rounded-lg w-3/4" />

          {/* Menu items skeleton */}
          <div className="space-y-2">
            {[1, 2].map((index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-second/5 animate-pulse" />
                <div className="h-5 bg-second/5 animate-pulse rounded w-32" />
              </div>
            ))}
          </div>

          {/* Price skeleton */}
          <div className="flex flex-col">
            <div className="h-4 bg-second/5 animate-pulse rounded w-16 mb-1" />
            <div className="h-7 bg-second/5 animate-pulse rounded w-24" />
          </div>
        </div>

        {/* Button skeleton */}
        <div className="absolute bottom-0 left-0 right-0">
          <div className="h-12 bg-second/5 animate-pulse" />
        </div>
      </div>
    </div>
  </div>
);

export default VerticalCardSkeleton;
