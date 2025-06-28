"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Lottie from "lottie-react";
import animationData from "./animation.json";

const Loading = () => {
  const isLoading = useSelector((state: RootState) => state.loading);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/20 backdrop-blur-sm">
      <div className="flex flex-col items-center w-fit">
        {/* <img
          src="/logos/pamukkale-logo.png"
          width={150}
          height={150}
          alt="Pamukkale Logo"
          className="object-contain"
        /> */}
        <Lottie
          className="w-1/2 h-1/2"
          animationData={animationData}
          loop={true}
        />
      </div>
    </div>
  );
};

export default Loading;
