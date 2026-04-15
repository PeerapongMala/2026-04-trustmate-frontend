interface TmEnvelopeProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

export function TmEnvelope({ title, subtitle, className = "" }: TmEnvelopeProps) {
  return (
    <div className={`relative overflow-hidden rounded-xl ${className}`}>
      {/* Envelope body */}
      <div className="bg-gradient-to-b from-amber-50 to-amber-100 p-4 pb-8">
        {/* Envelope flap */}
        <div className="absolute top-0 left-0 right-0">
          <svg viewBox="0 0 200 60" className="w-full">
            <path
              d="M0 0 L100 50 L200 0 L200 0 L0 0 Z"
              fill="#D4A574"
              opacity="0.3"
            />
          </svg>
        </div>

        {/* Content */}
        <div className="relative mt-6 text-center">
          {title && (
            <p className="text-xs font-medium text-tm-navy line-clamp-2">
              {title}
            </p>
          )}
          {subtitle && (
            <p className="mt-1 text-[10px] text-tm-gray line-clamp-2">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Envelope bottom fold */}
      <div className="h-2 bg-gradient-to-t from-amber-200/50 to-amber-100" />
    </div>
  );
}
