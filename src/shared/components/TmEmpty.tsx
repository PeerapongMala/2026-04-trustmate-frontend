interface TmEmptyProps {
  icon?: string;
  title: string;
  description?: string;
}

export function TmEmpty({
  icon = "📭",
  title,
  description,
}: TmEmptyProps) {
  return (
    <div className="flex flex-col items-center gap-2 py-16 text-center">
      <span className="text-4xl">{icon}</span>
      <p className="text-base font-medium text-tm-navy">{title}</p>
      {description && (
        <p className="text-sm text-tm-gray">{description}</p>
      )}
    </div>
  );
}
