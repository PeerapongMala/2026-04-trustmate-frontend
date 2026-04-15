export function TmLoading({ text = "กำลังโหลด..." }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-tm-light border-t-tm-orange" />
      <p className="text-sm text-tm-gray">{text}</p>
    </div>
  );
}
