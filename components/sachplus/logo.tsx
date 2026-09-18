"use client";

import Link from "next/link";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  inverted?: boolean;
  showTagline?: boolean;
  className?: string;
  href?: string;
}

export function LogoMark({
  size = 40,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        {/* Background gradient */}
        <linearGradient id="sp-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0284C7" />
          <stop offset="100%" stopColor="#0369A1" />
        </linearGradient>

        {/* Laundry water swirl gradient */}
        <linearGradient id="sp-water" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0284C7" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>

        {/* Coffee gold gradient */}
        <linearGradient id="sp-gold" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0284C7" />
          <stop offset="50%" stopColor="#0284C7" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>
      </defs>

      {/* Rounded Squircle Container */}
      <rect width="48" height="48" rx="14" fill="url(#sp-bg)" />

      {/* Subtle border highlight */}
      <rect
        x="0.75"
        y="0.75"
        width="46.5"
        height="46.5"
        rx="13.25"
        stroke="#ffffff"
        strokeOpacity="0.25"
        strokeWidth="1.5"
      />

      {/* 1. Washing Machine Drum Vortex / Water Ring */}
      <circle
        cx="24"
        cy="25"
        r="14"
        stroke="url(#sp-water)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="60 28"
      />

      {/* 2. Coffee Cup Body & Base */}
      <path
        d="M17 21H31C31 21 31 28 24 28C17 28 17 21 17 21Z"
        fill="#ffffff"
        fillOpacity="0.95"
      />
      {/* Coffee Cup Handle */}
      <path
        d="M31 22.5C32.5 22.5 33.5 23.5 33.5 25C33.5 26.5 32.5 27.5 31 27.5"
        stroke="#ffffff"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* Cup Saucer Base */}
      <path
        d="M18 30.5H30"
        stroke="#ffffff"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      {/* 3. Coffee Aroma Steams / Bubbles */}
      <path
        d="M21 18C21 16.5 22.5 15.5 22 14"
        stroke="url(#sp-gold)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M26 18C26 16.5 27.5 15.5 27 14"
        stroke="url(#sp-gold)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />

      {/* 4. Sparkling Clean "+" Star at top right */}
      <path
        d="M37 7V13M34 10H40"
        stroke="url(#sp-gold)"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <circle cx="37" cy="10" r="1" fill="#ffffff" />
    </svg>
  );
}

export function Logo({
  size = "md",
  inverted = false,
  showTagline = true,
  className = "",
  href = "/",
}: LogoProps) {
  const markSizes = {
    sm: 32,
    md: 40,
    lg: 48,
  };

  const titleSizes = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-2xl",
  };

  const subSizes = {
    sm: "text-[9px]",
    md: "text-[10px]",
    lg: "text-xs",
  };

  const content = (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <LogoMark size={markSizes[size]} className="shrink-0 shadow-md shadow-[#0369A1]/15" />
      <div className="flex flex-col leading-none">
        <span
          className={`font-extrabold tracking-tight ${titleSizes[size]} ${
            inverted ? "text-white" : "text-[#0F172A]"
          }`}
        >
          Sạch
          <span className="text-[#0284C7] font-black ml-0.5">+</span>
        </span>
        {showTagline && (
          <span
            className={`font-bold tracking-[0.14em] uppercase mt-1 ${subSizes[size]} ${
              inverted ? "text-[#E0F2FE]" : "text-[#0284C7]"
            }`}
          >
            Laundry & Coffee
          </span>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block hover:opacity-95 transition-opacity">
        {content}
      </Link>
    );
  }

  return content;
}
