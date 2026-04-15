"use client";

import { InputHTMLAttributes, forwardRef } from "react";

interface TmInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const TmInput = forwardRef<HTMLInputElement, TmInputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label className="text-sm font-medium text-tm-navy">{label}</label>
        )}
        <input
          ref={ref}
          className={`w-full rounded-2xl bg-tm-light px-4 py-3 text-tm-gray placeholder:text-tm-gray/50 focus:outline-none focus:ring-2 focus:ring-tm-orange/50 ${
            error ? "ring-2 ring-red-400" : ""
          } ${className}`}
          {...props}
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

TmInput.displayName = "TmInput";
