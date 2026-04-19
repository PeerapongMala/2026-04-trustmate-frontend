"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { TmLoading } from "@/shared/components";
import { api } from "@/shared/lib/api";

function GoogleCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");
    const legacyToken = searchParams.get("token");

    async function exchange() {
      if (code) {
        const { data, error } = await api.post<{ accessToken: string }>(
          "/auth/google/exchange",
          { code },
        );
        if (data?.accessToken && !error) {
          localStorage.setItem("token", data.accessToken);
          router.replace("/");
          return;
        }
      } else if (legacyToken) {
        // Backward compatibility during rollout only — remove once backend
        // stops emitting ?token=.
        localStorage.setItem("token", legacyToken);
        router.replace("/");
        return;
      }
      router.replace("/login");
    }

    exchange();
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
