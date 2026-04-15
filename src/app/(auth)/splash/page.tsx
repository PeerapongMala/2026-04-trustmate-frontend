"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { TmLogo } from "@/shared/components";

export default function SplashPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      const token = localStorage.getItem("token");
      router.replace(token ? "/" : "/login");
    }, 1500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-tm-bg">
      <div className="animate-pulse">
        <TmLogo size="lg" />
      </div>
    </div>
  );
}
