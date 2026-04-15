interface TmMetAvatarProps {
  size?: "sm" | "md" | "lg";
}

export function TmMetAvatar({ size = "md" }: TmMetAvatarProps) {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-16 h-16",
  };

  return (
    <div
      className={`${sizes[size]} flex-shrink-0 rounded-full bg-tm-light flex items-center justify-center`}
    >
      {/* Cartoon face with glasses - เมท */}
      <svg viewBox="0 0 40 40" fill="none" className="w-3/4 h-3/4">
        {/* Hair buns */}
        <circle cx="13" cy="8" r="4" fill="#494F56" />
        <circle cx="27" cy="8" r="4" fill="#494F56" />
        {/* Head */}
        <circle cx="20" cy="18" r="10" fill="#FDDCB5" />
        {/* Hair */}
        <path d="M10 16c0-5.5 4.5-10 10-10s10 4.5 10 10" fill="#494F56" />
        {/* Glasses */}
        <circle cx="16" cy="19" r="3.5" stroke="#31356E" strokeWidth="1.5" fill="white" />
        <circle cx="24" cy="19" r="3.5" stroke="#31356E" strokeWidth="1.5" fill="white" />
        <path d="M19.5 19h1" stroke="#31356E" strokeWidth="1" />
        {/* Eyes */}
        <circle cx="16" cy="19.5" r="1.2" fill="#31356E" />
        <circle cx="24" cy="19.5" r="1.2" fill="#31356E" />
        {/* Smile */}
        <path d="M17 24c1.5 1.5 4.5 1.5 6 0" stroke="#E47B18" strokeWidth="1" strokeLinecap="round" fill="none" />
      </svg>
    </div>
  );
}
