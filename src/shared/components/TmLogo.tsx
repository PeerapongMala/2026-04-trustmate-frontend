import Image from "next/image";

interface TmLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function TmLogo({ size = "md", className = "" }: TmLogoProps) {
  const dimensions = {
    sm: { width: 100, height: 42 },
    md: { width: 140, height: 58 },
    lg: { width: 200, height: 83 },
    xl: { width: 280, height: 117 },
  };

  const { width, height } = dimensions[size];

  return (
    <div className={className}>
      <Image
        src="/logo.png"
        alt="TrustMate"
        width={width}
        height={height}
        priority
      />
    </div>
  );
}
