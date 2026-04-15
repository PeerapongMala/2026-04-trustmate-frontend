import { TmBottomNav } from "@/shared/components";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col">
      <main className="flex-1 pb-16">{children}</main>
      <TmBottomNav />
    </div>
  );
}
