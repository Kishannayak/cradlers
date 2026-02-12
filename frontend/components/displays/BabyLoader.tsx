// BabyLoader component: A cute baby crawling GIF as a loading animation
// Rounded, smooth animation

"use client";

import React from "react";

interface BabyLoaderProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const BabyLoader: React.FC<BabyLoaderProps> = ({
  size = "md",
  className = "",
}) => {
  const sizes = {
    sm: "w-16 h-16", // 64px
    md: "w-24 h-24", // 96px
    lg: "w-32 h-32", // 128px
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`${sizes[size]} relative rounded-full overflow-hidden`}>
        <img
          src="/baby-crawling.gif"
          alt="Baby crawling loader"
          className="rounded-full w-full h-full object-cover"
          style={{
            imageRendering: "auto",
          }}
        />
      </div>
    </div>
  );
};
