"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TmLogo } from "@/shared/components";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4" },
  { href: "/admin/posts", label: "โพสต์", icon: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" },
  { href: "/admin/reports", label: "Reports", icon: "M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
  { href: "/admin/therapists", label: "ที่ปรึกษา", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
  { href: "/admin/questions", label: "คำถาม", icon: "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  }

  return (
    <div className="min-h-screen bg-tm-bg">
      {/* Admin header */}
      <header className="sticky top-0 z-40 border-b border-tm-light bg-tm-bg/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <TmLogo size="sm" />
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-tm-navy">Admin</span>
              <span className="rounded-full bg-tm-orange/10 px-2 py-0.5 text-[10px] font-medium text-tm-orange">
                Panel
              </span>
            </div>
          </div>
          <Link
            href="/"
            className="flex items-center gap-1.5 rounded-full border border-tm-light px-3 py-1.5 text-sm text-tm-gray transition-colors hover:bg-tm-light"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
              <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            กลับหน้าหลัก
          </Link>
        </div>
      </header>

      {/* Admin nav */}
      <nav className="border-b border-tm-light bg-tm-bg">
        <div className="mx-auto flex max-w-5xl gap-1 overflow-x-auto px-4 py-2">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-sm transition-colors ${
                isActive(item.href)
                  ? "bg-tm-orange text-white font-medium shadow-sm"
                  : "text-tm-gray hover:bg-tm-light hover:text-tm-navy"
              }`}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
                <path d={item.icon} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      <main className="mx-auto max-w-5xl p-4 pb-8">{children}</main>
    </div>
  );
}
