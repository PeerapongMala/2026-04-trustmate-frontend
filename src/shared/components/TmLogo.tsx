interface TmLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function TmLogo({ size = "md", className = "" }: TmLogoProps) {
  const textSizes = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-4xl",
    xl: "text-5xl",
  };

  const iconSizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-14 h-14",
    xl: "w-20 h-20",
  };

  const mateSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-xl",
    xl: "text-2xl",
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Logo icon - two people */}
      <svg
        viewBox="0 0 48 48"
        fill="none"
        className={iconSizes[size]}
      >
        <circle cx="18" cy="14" r="4" stroke="#31356E" strokeWidth="2.5" />
        <circle cx="30" cy="14" r="4" stroke="#31356E" strokeWidth="2.5" />
        <path
          d="M10 32c0-4.42 3.58-8 8-8h2M38 32c0-4.42-3.58-8-8-8h-2"
          stroke="#31356E"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M20 24v8M28 24v8"
          stroke="#31356E"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M18 36l6-4 6 4"
          stroke="#31356E"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {/* Text */}
      <div className="flex flex-col leading-tight">
        <span className={`font-bold text-tm-navy ${textSizes[size]}`}>
          Trust
        </span>
        <span className={`font-bold text-blue-500 ${mateSizes[size]} -mt-1`}>
          Mate
        </span>
      </div>
    </div>
  );
}
