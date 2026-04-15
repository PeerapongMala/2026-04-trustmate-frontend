"use client";

interface TmTagProps {
  label: string;
  selected?: boolean;
  onClick?: () => void;
}

export function TmTag({ label, selected = false, onClick }: TmTagProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
        selected
          ? "bg-tm-orange text-white"
          : "border border-tm-orange text-tm-orange hover:bg-tm-orange/10"
      }`}
    >
      {label}
    </button>
  );
}
