interface TmCardProps {
  children: React.ReactNode;
  className?: string;
}

export function TmCard({ children, className = "" }: TmCardProps) {
  return (
    <div className={`rounded-3xl bg-white p-5 shadow-sm border border-tm-light/50 ${className}`}>
      {children}
    </div>
  );
}
