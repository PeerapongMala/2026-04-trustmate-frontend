interface TmCardProps {
  children: React.ReactNode;
  className?: string;
}

export function TmCard({ children, className = "" }: TmCardProps) {
  return (
    <div className={`rounded-3xl bg-white p-5 shadow-sm ${className}`}>
      {children}
    </div>
  );
}
