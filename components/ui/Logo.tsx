import React from "react";
import Link from "next/link";

export interface LogoProps {
  className?: string;
  iconClassName?: string;
  showText?: boolean;
  textClassName?: string;
  size?: "sm" | "md" | "lg";
  variant?: "contained" | "plain";
  href?: string;
}

export default function Logo({
  className = "",
  iconClassName = "",
  showText = true,
  textClassName = "",
  size = "md",
  variant = "contained",
  href,
}: LogoProps) {
  const sizeMap = {
    sm: {
      container: "w-7 h-7 rounded-lg p-1.5",
      svg: "w-4 h-4",
      text: "text-sm font-black tracking-tight uppercase",
    },
    md: {
      container: "w-9 h-9 rounded-xl p-2",
      svg: "w-5 h-5",
      text: "text-base font-black tracking-tight uppercase",
    },
    lg: {
      container: "w-11 h-11 rounded-2xl p-2.5",
      svg: "w-6 h-6",
      text: "text-xl font-black tracking-tight uppercase",
    },
  };

  const currentSize = sizeMap[size];

  const svgContent = (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={`${variant === "plain" ? currentSize.svg : "w-full h-full"} ${iconClassName}`}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M6.25,14.09A8.78,8.78,0,0,1,8.72,8.71,8,8,0,0,0,16,20h6V18H16A6,6,0,0,1,12.88,6.88,6,6,0,0,0,18,16h4V14H18a4,4,0,0,1-1.64-7.64A4,4,0,0,0,16,8a4,4,0,0,0,4,4h2V10H20a2,2,0,0,1,0-4h2V4H15A10.89,10.89,0,0,0,4.25,13.93,2.27,2.27,0,0,1,2,16v2A4.28,4.28,0,0,0,6.25,14.09Z" />
    </svg>
  );

  const logoNode = (
    <div className={`inline-flex items-center gap-2.5 shrink-0 ${className}`}>
      {variant === "contained" ? (
        <div
          className={`bg-gradient-to-br from-red-500 via-red-600 to-rose-700 text-white flex items-center justify-center shadow-lg shadow-red-500/40 shrink-0 transition-transform group-hover:scale-105 border border-red-400/30 ${currentSize.container}`}
        >
          {svgContent}
        </div>
      ) : (
        <div className={`text-red-500 flex items-center justify-center shrink-0 ${currentSize.svg}`}>
          {svgContent}
        </div>
      )}
      {showText && (
        <span className={`text-white font-extrabold tracking-wider ${currentSize.text} ${textClassName}`}>
          Sports<span className="text-red-500">Booking</span>
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="group inline-flex items-center">
        {logoNode}
      </Link>
    );
  }

  return logoNode;
}
