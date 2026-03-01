// BabyLoader component: A cute baby crawling GIF as a loading animation
// Rounded, smooth animation

"use client";

import React from "react";
import Image from "next/image";

interface BabyLoaderProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizePx = { sm: 64, md: 96, lg: 128 };

export const BabyLoader: React.FC<BabyLoaderProps> = ({
  size = "md",
  className = "",
}) => {
  const px = sizePx[size];
  const sizes = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`${sizes[size]} relative rounded-full overflow-hidden`}>
        <Image
          src="/baby-crawling.gif"
          alt="Baby crawling loader"
          width={px}
          height={px}
          className="rounded-full w-full h-full object-cover"
          unoptimized
        />
      </div>
    </div>
  );
};
