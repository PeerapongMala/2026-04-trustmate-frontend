interface TmAvatarProps {
  size?: "sm" | "md" | "lg";
  color?: string;
  className?: string;
}

export function TmAvatar({
  size = "md",
  color,
  className = "",
}: TmAvatarProps) {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-14 h-14",
  };

  return (
    <div
      className={`${sizes[size]} rounded-full flex items-center justify-center ${className}`}
      style={{ backgroundColor: color || "#D8E1ED" }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="w-1/2 h-1/2 text-tm-gray/40"
      >
        <path
          d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}
