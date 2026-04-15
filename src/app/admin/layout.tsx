import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto min-h-screen max-w-4xl">
      {/* Admin header */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-tm-light bg-tm-navy px-4 py-3">
        <span className="text-lg font-bold text-white">TrustMate Admin</span>
        <Link href="/" className="text-sm text-tm-blue hover:text-white">
          กลับหน้าหลัก
        </Link>
      </header>

      {/* Admin nav */}
      <nav className="flex gap-1 overflow-x-auto border-b border-tm-light bg-tm-bg px-4 py-2">
        {[
          { href: "/admin", label: "Dashboard" },
          { href: "/admin/posts", label: "โพสต์" },
          { href: "/admin/reports", label: "Reports" },
          { href: "/admin/therapists", label: "ที่ปรึกษา" },
          { href: "/admin/questions", label: "คำถาม" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="whitespace-nowrap rounded-full px-3 py-1.5 text-sm text-tm-navy hover:bg-tm-light"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <main className="p-4">{children}</main>
    </div>
  );
}
