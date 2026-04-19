interface StepHeaderProps {
  stepLabel: string;
  title: string;
}

export function StepHeader({ stepLabel, title }: StepHeaderProps) {
  return (
    <header className="flex items-center gap-3 px-4 pt-6 pb-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-tm-light">
        <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-tm-navy">
          <path
            d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
          <path
            d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <div>
        <p className="text-xs text-tm-gray">{stepLabel}</p>
        <p className="font-bold text-tm-navy">{title}</p>
      </div>
    </header>
  );
}
