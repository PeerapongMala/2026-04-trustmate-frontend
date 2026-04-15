"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TmLogo, TmInput, TmButton, TmCard } from "@/shared/components";
import { api } from "@/shared/lib/api";
import type { AuthResponse } from "@/shared/types/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data, error: apiError } = await api.post<AuthResponse>(
      "/auth/login",
      { email, password }
    );

    if (apiError) {
      setError(apiError);
      setLoading(false);
      return;
    }

    if (data?.accessToken) {
      localStorage.setItem("token", data.accessToken);
      router.push("/");
    }

    setLoading(false);
  }

  return (
    <>
      <TmLogo size="lg" className="mb-8" />

      <TmCard className="w-full">
        <h1 className="mb-6 text-center text-2xl font-bold text-tm-navy">
          เข้าสู่ระบบ
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <TmInput
            label="อีเมล"
            type="email"
            placeholder="ป้อนอีเมลของคุณ..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div>
            <TmInput
              label="รหัสผ่าน"
              type="password"
              placeholder="ป้อนรหัสผ่านของคุณ..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Link
              href="/forgot-password"
              className="mt-1 block text-right text-sm text-tm-gray hover:text-tm-orange"
            >
              ลืมรหัสผ่าน
            </Link>
          </div>

          {error && (
            <p className="text-center text-sm text-red-500">{error}</p>
          )}

          <div className="flex justify-end">
            <TmButton type="submit" disabled={loading}>
              {loading ? "กำลังเข้าสู่ระบบ..." : ">> ถัดไป"}
            </TmButton>
          </div>
        </form>

        {/* Divider */}
        <div className="mt-4 flex items-center gap-3">
          <div className="flex-1 border-t border-tm-light" />
          <span className="text-xs text-tm-gray">หรือ</span>
          <div className="flex-1 border-t border-tm-light" />
        </div>

        {/* Google Login */}
        <a
          href={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"}/auth/google`}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-full border border-tm-light bg-white py-2.5 text-sm font-medium text-tm-gray transition-colors hover:bg-tm-light"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          เข้าสู่ระบบด้วย Google
        </a>

        <p className="mt-4 text-center text-sm text-tm-gray">
          ยังไม่มีบัญชี{" "}
          <Link
            href="/register"
            className="font-bold text-tm-orange hover:underline"
          >
            สมัครเลย!
          </Link>
        </p>
      </TmCard>
    </>
  );
}
