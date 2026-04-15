"use client";

import { ButtonHTMLAttributes } from "react";

interface TmButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "solid" | "outline";
  size?: "sm" | "md" | "lg";
}

export function TmButton({
  variant = "solid",
  size = "md",
  className = "",
  children,
  ...props
}: TmButtonProps) {
  const base = "rounded-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-tm-orange/50 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    solid: "bg-tm-orange text-white hover:bg-tm-orange/90",
    outline: "border-2 border-tm-orange text-tm-orange hover:bg-tm-orange/10",
  };

  const sizes = {
    sm: "px-4 py-1.5 text-sm",
    md: "px-6 py-2.5 text-base",
    lg: "px-8 py-3 text-lg",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
