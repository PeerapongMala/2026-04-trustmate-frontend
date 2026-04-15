"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const HomeIcon = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 24 24" fill={active ? "#31356E" : "none"} stroke="#31356E" strokeWidth="2" className="w-6 h-6">
    <path d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h3a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h3a1 1 0 001-1V10" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChatIcon = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 24 24" fill={active ? "#31356E" : "none"} stroke="#31356E" strokeWidth="2" className="w-6 h-6">
    <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CareIcon = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 24 24" fill={active ? "#31356E" : "none"} stroke="#31356E" strokeWidth="2" className="w-6 h-6">
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ProfileIcon = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 24 24" fill={active ? "#31356E" : "none"} stroke="#31356E" strokeWidth="2" className="w-6 h-6">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const navItems: NavItem[] = [
  { href: "/", label: "Home", icon: <HomeIcon active={false} /> },
  { href: "/chat", label: "Chat", icon: <ChatIcon active={false} /> },
  { href: "/care", label: "Care", icon: <CareIcon active={false} /> },
  { href: "/profile", label: "Profile", icon: <ProfileIcon active={false} /> },
];

export function TmBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-tm-light bg-tm-light/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-md items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 transition-colors ${
                isActive ? "text-tm-navy" : "text-tm-gray/60"
              }`}
            >
              {item.href === "/" && <HomeIcon active={isActive} />}
              {item.href === "/chat" && <ChatIcon active={isActive} />}
              {item.href === "/care" && <CareIcon active={isActive} />}
              {item.href === "/profile" && <ProfileIcon active={isActive} />}
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
