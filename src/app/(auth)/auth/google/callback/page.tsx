"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { TmLoading } from "@/shared/components";

function GoogleCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      localStorage.setItem("token", token);
      router.replace("/");
    } else {
      router.replace("/login");
    }
  }, [router, searchParams]);

  return <TmLoading text="กำลังเข้าสู่ระบบด้วย Google..." />;
}

export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={<TmLoading text="กำลังเข้าสู่ระบบด้วย Google..." />}>
      <GoogleCallbackContent />
    </Suspense>
  );
}
